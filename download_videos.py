
#!/usr/bin/env python3
import os
import sys
import urllib.request
from pathlib import Path

PACKAGE_DIR = Path(__file__).resolve().parent
VIDEO_DIR = PACKAGE_DIR / 'videos'
VIDEO_DIR.mkdir(exist_ok=True)

try:
    import importlib.util
    spec = importlib.util.spec_from_file_location('catalog', PACKAGE_DIR / 'movies.js')
    if spec and spec.loader:
        mod = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(mod)
        CATALOG = getattr(mod, 'NOCTURA_MOVIE_CATALOG', [])
except Exception:
    print('Unable to import movies.js. Make sure the catalogue file is present.', file=sys.stderr)
    sys.exit(1)

verified = [item for item in CATALOG if item.get('enabled') and item.get('videoUrl')]

if not verified:
    print('No enabled videos available for download.')
    sys.exit(0)

for item in verified:
    url = item['videoUrl']
    filename = os.path.basename(url)
    out_path = VIDEO_DIR / filename
    print(f'Downloading {item["title"]} -> {filename}')
    try:
        urllib.request.urlretrieve(url, out_path)
    except Exception as exc:
        print(f'Failed to download {item["title"]}: {exc}', file=sys.stderr)

print(f'Completed downloads to: {VIDEO_DIR}')
