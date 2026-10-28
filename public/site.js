$('watchFrame').innerHTML = `
  <video controls autoplay playsinline preload="metadata" poster="${safeCssUrl(film.poster || fallbackPoster(film.title))}">
    <source src="${safeCssUrl(film.videoUrl || film.backdrop || film.poster || fallbackPoster(film.title))}" type="video/mp4">
  </video>
`;
