/* NOCTURA homepage repair — uses the existing licensed_catalog.js */
(() => {
  "use strict";

  const films = Array.isArray(window.NOCTURA_MOVIE_CATALOG)
    ? window.NOCTURA_MOVIE_CATALOG.filter(movie => movie && movie.enabled !== false)
    : [];

  const $ = id => document.getElementById(id);
  const safe = value => String(value ?? "");
  const imageFallback = "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600"><rect width="100%" height="100%" fill="#191919"/><text x="50%" y="50%" fill="#aaa" font-size="24" text-anchor="middle">NOCTURA</text></svg>'
  );

  function poster(movie) {
    return movie.poster || movie.poster_url || imageFallback;
  }

  function playable(movie) {
    return Boolean(movie.streamUrl || movie.stream_url || movie.videoUrl);
  }

  function setHero(movie) {
    if (!movie) {
      $("heroTitle").textContent = "Welcome to NOCTURA";
      $("heroDesc").textContent = "Explore the movie catalogue.";
      $("heroYear").textContent = "—";
      $("heroRating").textContent = "—";
      $("heroDuration").textContent = "—";
      $("heroPlayBtn").textContent = "▶ Playback unavailable";
      $("heroPlayBtn").setAttribute("aria-disabled", "true");
      $("heroPlayBtn").href = "#";
      return;
    }

    $("heroTitle").textContent = movie.title || "Featured movie";
    $("heroDesc").textContent = movie.description || movie.synopsis || "Discover this title in the NOCTURA catalogue.";
    $("heroYear").textContent = safe(movie.year) || "—";
    $("heroRating").textContent = movie.rating || movie.certificate || "NR";
    $("heroDuration").textContent = movie.duration || "—";
    $("heroBillboard").style.backgroundImage =
      `linear-gradient(90deg, rgba(10,10,12,.95), rgba(10,10,12,.68)), url("${poster(movie)}")`;

    const play = $("heroPlayBtn");
    if (playable(movie)) {
      play.href = movie.streamUrl || movie.stream_url || movie.videoUrl;
      play.removeAttribute("aria-disabled");
      play.textContent = "▶ Play Now";
    } else {
      play.href = "#";
      play.setAttribute("aria-disabled", "true");
      play.textContent = "▶ Playback unavailable";
    }
    play.onclick = event => {
      if (!playable(movie)) {
        event.preventDefault();
        alert("This title has catalogue information, but NOCTURA has no verified playable video source configured for it yet.");
      }
    };
    $("heroDetailsBtn").onclick = () => showDetails(movie);
  }

  function makeCard(movie) {
    const card = document.createElement("article");
    card.className = "card";
    card.tabIndex = 0;
    const wrap = document.createElement("div");
    wrap.className = "card-img-wrapper";
    const img = document.createElement("img");
    img.src = poster(movie);
    img.alt = `${movie.title || "Movie"} poster`;
    img.loading = "lazy";
    img.onerror = () => { img.onerror = null; img.src = imageFallback; };
    wrap.appendChild(img);

    const content = document.createElement("div");
    content.className = "card-content";
    const title = document.createElement("div");
    title.className = "card-title";
    title.textContent = movie.title || "Untitled";
    const meta = document.createElement("div");
    meta.className = "card-sub";
    const year = document.createElement("span");
    year.textContent = safe(movie.year) || "Year unknown";
    const genre = document.createElement("span");
    genre.textContent = movie.genre || movie.category || "Film";
    meta.append(year, genre);
    content.append(title, meta);
    card.append(wrap, content);
    card.addEventListener("click", () => showDetails(movie));
    card.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        showDetails(movie);
      }
    });
    return card;
  }

  function render(list = films) {
    const spotlight = $("ghanaianRow");
    const general = $("generalRow");
    if (!spotlight || !general) return;
    spotlight.replaceChildren();
    general.replaceChildren();

    const featured = list.filter(movie => movie.featured);
    const firstRow = featured.length ? featured : list.slice(0, 5);
    const firstSet = new Set(firstRow);
    firstRow.forEach(movie => spotlight.appendChild(makeCard(movie)));
    list.filter(movie => !firstSet.has(movie)).forEach(movie => general.appendChild(makeCard(movie)));

    if (!list.length) {
      general.textContent = "No titles match your search or filters.";
    }
    $("catalogueHeading").textContent = list === films ? "Trending Releases" : "Search & Filter Results";
  }

  function showDetails(movie) {
    const modal = $("infoModal");
    const content = $("modalContent");
    content.replaceChildren();

    const title = document.createElement("h2");
    title.textContent = movie.title || "Movie details";
    const meta = document.createElement("p");
    meta.textContent = [movie.year, movie.genre, movie.language, movie.duration].filter(Boolean).join(" • ");
    const description = document.createElement("p");
    description.textContent = movie.description || movie.synopsis || "No description available.";
    description.style.margin = "14px 0";
    const rights = document.createElement("p");
    rights.textContent = movie.licenceUrl
      ? "Rights/source information is listed for review. Confirm territorial and commercial streaming rights before publishing."
      : "Streaming rights information has not been supplied for this title.";
    const play = document.createElement("button");
    play.className = "btn btn-primary";
    play.textContent = playable(movie) ? "▶ Play Now" : "Playback not configured";
    play.disabled = !playable(movie);
    if (playable(movie)) play.onclick = () => { window.location.href = movie.streamUrl || movie.stream_url || movie.videoUrl; };
    content.append(title, meta, description, rights, play);
    modal.style.display = "flex";
  }

  window.closeModal = function () {
    const modal = $("infoModal");
    if (modal) modal.style.display = "none";
  };

  window.applyFilters = function () {
    const industry = $("filterIndustry")?.value || "all";
    const genre = $("filterGenre")?.value || "all";
    const filtered = films.filter(movie => {
      const category = String(movie.category || "").toLowerCase();
      const industryMatch = industry === "all" ||
        (industry === "Ghanaian Cinema" && ["ghanaian", "kumawood"].includes(category)) ||
        (industry === "Nollywood" && category === "nollywood") ||
        (industry === "Hollywood" && category === "hollywood") ||
        (industry === "K-Drama" && ["kdrama", "k-drama"].includes(category));
      const genreMatch = genre === "all" ||
        String(movie.genre || "").toLowerCase() === genre.toLowerCase();
      return industryMatch && genreMatch;
    });
    render(filtered);
  };

  function setupSearch() {
    const input = $("searchInput");
    if (!input) return;
    input.addEventListener("input", () => {
      const q = input.value.trim().toLowerCase();
      const results = films.filter(movie =>
        [movie.title, movie.creator, movie.genre, movie.category, movie.language]
          .some(value => safe(value).toLowerCase().includes(q))
      );
      render(q ? results : films);
      const dropdown = $("searchResults");
      if (dropdown) dropdown.style.display = "none";
    });
  }

  function init() {
    const featured = films.find(movie => movie.featured) || films[0];
    setHero(featured);
    render(films);
    setupSearch();
    if (!films.length) {
      $("heroTitle").textContent = "Catalogue unavailable";
      $("heroDesc").textContent = "The movie catalogue file did not load. Check that licensed_catalog.js is deployed beside index.html.";
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
