// player.js - Defensive error handling
const video = document.getElementById('nocturaPlayer');
const errorOverlay = document.getElementById('playerErrorMessage');

if (video) {
  video.onerror = (e) => {
    console.error('Playback error encountered:', video.error);
    if (errorOverlay) {
      errorOverlay.classList.remove('hidden');
    }
  };

  video.onplaying = () => {
    if (errorOverlay) {
      errorOverlay.classList.add('hidden');
    }
  };
}

function retryPlayback() {
  if (video) {
    if (errorOverlay) errorOverlay.classList.add('hidden');
    video.load();
    video.play().catch(err => console.warn('Autoplay blocked; user interaction required:', err));
  }
}
