#!/usr/bin/env python3
"""End-to-end smoke test against a LOCAL Wrangler server only."""
import argparse, json, os, subprocess, tempfile
from pathlib import Path
import requests

parser=argparse.ArgumentParser()
parser.add_argument('--base',default='http://127.0.0.1:8787')
parser.add_argument('--password',default=os.environ.get('ADMIN_PASSWORD','local-test-password'))
parser.add_argument('--keep',action='store_true',help='Keep the test movie for browser checks')
args=parser.parse_args()
base=args.base.rstrip('/')
s=requests.Session()
checks=[]
def check(name,condition,detail=''):
    if not condition: raise AssertionError(f'{name}: {detail}')
    checks.append(name);print(f'PASS {name} {detail}')
def req(method,path,expected=200,**kwargs):
    response=s.request(method,base+path,timeout=45,**kwargs)
    check(f'{method} {path} -> {expected}',response.status_code==expected,f'got {response.status_code}: {response.text[:250]}')
    return response
def upload(kind,path,content_type):
    size=path.stat().st_size
    started=req('POST','/api/admin/uploads/start',201,json={'kind':kind,'filename':path.name,'size':size,'type':content_type}).json()
    chunk_size=started['chunk_size'];parts=[]
    with path.open('rb') as handle:
        for number in range(1,started['part_count']+1):
            blob=handle.read(chunk_size)
            data=req('PUT',f"/api/admin/uploads/{started['id']}/{number}",data=blob,headers={'Content-Type':'application/octet-stream'}).json()
            parts.append({'partNumber':data['partNumber'],'etag':data['etag']})
    completed=req('POST',f"/api/admin/uploads/{started['id']}",json={'parts':parts}).json()
    check(f'{kind} upload size verified',completed['size']==size)
    return started,completed

with tempfile.TemporaryDirectory() as temp:
    temp=Path(temp);video=temp/'authorized-test.mp4';poster=temp/'poster.png';vtt=temp/'english.vtt'
    subprocess.run(['ffmpeg','-v','error','-f','lavfi','-i','testsrc2=size=320x180:rate=24','-f','lavfi','-i','sine=frequency=660:sample_rate=44100','-t','30','-c:v','libx264','-pix_fmt','yuv420p','-c:a','aac','-movflags','+faststart','-y',str(video)],check=True)
    from PIL import Image
    Image.new('RGB',(400,600),(35,20,22)).save(poster)
    vtt.write_text('WEBVTT\n\n00:00.000 --> 00:30.000\nCineWave local subtitle test\n')
    check('homepage loads',req('GET','/').text.find('CINEWAVE')>=0)
    req('GET','/api/admin/movies',401)
    req('POST','/api/admin/uploads/start',401,json={})
    req('POST','/api/admin/login',401,json={'password':'wrong'})
    login=req('POST','/api/admin/login',json={'password':args.password})
    cookie=login.headers.get('set-cookie','').split(';')[0]
    check('secure admin cookie issued',all(flag in login.headers.get('set-cookie','') for flag in ['HttpOnly','Secure','SameSite=Strict']))
    s.headers.update({'Cookie':cookie})
    req('GET','/api/admin/session')
    req('POST','/api/admin/movies',403,json={},headers={'Origin':'https://attacker.example'})
    req('POST','/api/admin/uploads/start',400,json={'kind':'video','filename':'movie.exe','size':100,'type':'application/octet-stream'})
    req('POST','/api/admin/uploads/start',400,json={'kind':'subtitle','filename':'large.vtt','size':6*1024*1024,'type':'text/vtt'})
    bad=temp/'bad.vtt';bad.write_text('<html>not subtitles</html>')
    bad_session=req('POST','/api/admin/uploads/start',201,json={'kind':'subtitle','filename':'bad.vtt','size':bad.stat().st_size,'type':'text/vtt'}).json()
    req('PUT',f"/api/admin/uploads/{bad_session['id']}/1",400,data=bad.read_bytes())
    req('DELETE',f"/api/admin/uploads/{bad_session['id']}")
    video_session,video_upload=upload('video',video,'video/mp4')
    poster_session,poster_upload=upload('poster',poster,'image/png')
    subtitle_session,subtitle_upload=upload('subtitle',vtt,'text/vtt')
    movie={'title':'CineWave API Test','category':'ghana','category_label':'Ghanaian Stories','year':2026,'rating':'PG','duration':'30 sec','creator':'CineWave Test','poster_url':'','poster_key':poster_upload['key'],'stream_type':'r2','stream_url':'','video_key':video_upload['key'],'archive_id':'','synopsis':'Local automated test movie.','subtitles':[{'id':'english-test','lang':'en','label':'English','key':subtitle_upload['key']}], 'featured':True,'rights_verified':True,'published':False}
    movie_id=req('POST','/api/admin/movies',201,json=movie).json()['id']
    check('draft hidden from public catalog',movie_id not in [item['id'] for item in req('GET','/api/movies').json()['movies']])
    req('GET',f'/api/media/{movie_id}',404)
    req('DELETE',f"/api/admin/uploads/{video_session['id']}",409)
    movie['published']=True
    req('PUT',f'/api/admin/movies/{movie_id}',json=movie)
    public=next(item for item in req('GET','/api/movies').json()['movies'] if item['id']==movie_id)
    check('published R2 routes exposed',public['stream_url']==f'/api/media/{movie_id}' and public['download_url'].endswith('?download=1'))
    check('private R2 keys not exposed',all(key not in public for key in ['video_key','poster_key']) and 'key' not in public['subtitles'][0])
    full=req('GET',f'/api/media/{movie_id}')
    check('full MP4 matches upload',full.content==video.read_bytes() and full.headers['Content-Type']=='video/mp4')
    ranged=req('GET',f'/api/media/{movie_id}',206,headers={'Range':'bytes=0-99'})
    check('100-byte range response',len(ranged.content)==100 and ranged.headers['Content-Range'].startswith('bytes 0-99/'))
    suffix=req('GET',f'/api/media/{movie_id}',206,headers={'Range':'bytes=-100'})
    check('suffix range response',len(suffix.content)==100 and suffix.content==video.read_bytes()[-100:])
    req('GET',f'/api/media/{movie_id}',416,headers={'Range':'bytes=999999999-'})
    head=req('HEAD',f'/api/media/{movie_id}')
    check('HEAD has no body and correct length',not head.content and int(head.headers['Content-Length'])==video.stat().st_size)
    download=req('GET',f'/api/media/{movie_id}?download=1')
    check('direct download attachment',download.headers['Content-Disposition'].startswith('attachment;') and download.content==video.read_bytes())
    poster_response=req('GET',f'/api/posters/{movie_id}')
    check('private poster served',poster_response.content==poster.read_bytes() and poster_response.headers['Content-Type']=='image/png')
    subtitle_response=req('GET',f'/api/subtitles/{movie_id}/english-test')
    check('WebVTT subtitle served',subtitle_response.text.startswith('WEBVTT') and subtitle_response.headers['Content-Type'].startswith('text/vtt'))
    req('PUT',f'/api/admin/movies/{movie_id}',400,json={**movie,'rights_verified':False})
    movie['title']='CineWave API Test Updated';req('PUT',f'/api/admin/movies/{movie_id}',json=movie)
    check('edit persisted',next(item for item in req('GET','/api/admin/movies').json()['movies'] if item['id']==movie_id)['title']==movie['title'])
    if not args.keep:
        req('DELETE',f'/api/admin/movies/{movie_id}')
        req('GET',f'/api/media/{movie_id}',404)
        check('movie removed from admin',movie_id not in [item['id'] for item in req('GET','/api/admin/movies').json()['movies']])
        for session in [video_session,poster_session,subtitle_session]:req('DELETE',f"/api/admin/uploads/{session['id']}")
    else:print('KEEP movie id:',movie_id)
print(f'\n{len(checks)} checks passed.')
