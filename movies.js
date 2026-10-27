/*
 * CineWave Ghana — corrected catalogue data
 * IMPORTANT: Do not label a title as licensed/public domain unless you have verified
 * the rights for your country and the specific copy/source. The earlier sample MP4
 * links were unrelated demo videos and have intentionally been removed.
 *
 * The current index.html is a self-contained site with its own built-in film list.
 * This file is a clean catalogue for future integration; it is not loaded by index.html yet.
 */
const MOVIES_DATABASE = [
  {
    id: "cls-01",
    title: "The General",
    category: "classics",
    categoryLabel: "Full-Length Classic Movies",
    year: 1926,
    duration: "Feature film",
    rating: "NR",
    poster: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/The_General_%281926%29_poster.jpg/800px-The_General_%281926%29_poster.jpg",
    backdrop: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/The_General_%281926%29_poster.jpg/800px-The_General_%281926%29_poster.jpg",
    synopsis: "A railway engineer races to rescue his locomotive and the woman he loves during the American Civil War.",
    streamType: "archive",
    archiveId: "TheGeneral1926_201602",
    videoUrl: "https://archive.org/details/TheGeneral1926_201602",
    subtitles: {},
    rightsStatus: "Verify source terms and public-domain status in your territory before streaming."
  },
  {
    id: "cls-02",
    title: "Night of the Living Dead",
    category: "classics",
    categoryLabel: "Full-Length Classic Movies",
    year: 1968,
    duration: "Feature film",
    rating: "NR",
    poster: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Night_of_the_Living_Dead_%281968%29_theatrical_poster.jpg/800px-Night_of_the_Living_Dead_%281968%29_theatrical_poster.jpg",
    backdrop: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Night_of_the_Living_Dead_%281968%29_theatrical_poster.jpg/800px-Night_of_the_Living_Dead_%281968%29_theatrical_poster.jpg",
    synopsis: "Strangers barricade themselves in a farmhouse as the dead begin to walk.",
    streamType: "archive",
    archiveId: "night_of_the_living_dead",
    videoUrl: "https://archive.org/details/night_of_the_living_dead",
    subtitles: {},
    rightsStatus: "Verify source terms and public-domain status in your territory before streaming."
  },
  {
    id: "cls-03",
    title: "His Girl Friday",
    category: "classics",
    categoryLabel: "Full-Length Classic Movies",
    year: 1940,
    duration: "Feature film",
    rating: "NR",
    poster: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=85",
    backdrop: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1600&q=85",
    synopsis: "A fast-paced newsroom comedy about an ambitious reporter and her editor.",
    streamType: "archive",
    archiveId: "HisGirlFriday1940",
    videoUrl: "https://archive.org/details/HisGirlFriday1940",
    subtitles: {},
    rightsStatus: "Verify source terms and public-domain status in your territory before streaming."
  },
  {
    id: "cls-04",
    title: "Nosferatu",
    category: "classics",
    categoryLabel: "Full-Length Classic Movies",
    year: 1922,
    duration: "Feature film",
    rating: "NR",
    poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=85",
    backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=85",
    synopsis: "A silent-era vampire classic directed by F. W. Murnau.",
    streamType: "archive",
    archiveId: "Nosferatu_1922",
    videoUrl: "https://archive.org/details/Nosferatu_1922",
    subtitles: {},
    rightsStatus: "Verify source terms and public-domain status in your territory before streaming."
  },
  {
    id: "act-01",
    title: "Hollywood Action Movie — Add Licensed Title",
    category: "hollywood",
    categoryLabel: "Hollywood Action Movies",
    year: null,
    duration: "Varies",
    rating: "NR",
    poster: "",
    backdrop: "",
    synopsis: "Add a movie only after you have a working, authorized stream URL.",
    streamType: "not-configured",
    videoUrl: "",
    subtitles: {},
    rightsStatus: "No video configured. Add a licensed/authorized source before publishing."
  },
  {
    id: "bol-01",
    title: "Bollywood Movie — Add Licensed Title",
    category: "bollywood",
    categoryLabel: "Bollywood Cinema",
    year: null,
    duration: "Varies",
    rating: "NR",
    poster: "",
    backdrop: "",
    synopsis: "Add a movie only after you have a working, authorized stream URL.",
    streamType: "not-configured",
    videoUrl: "",
    subtitles: {},
    rightsStatus: "No video configured. Add a licensed/authorized source before publishing."
  },
  {
    id: "for-01",
    title: "Foreign Movie — Add Licensed Title",
    category: "foreign",
    categoryLabel: "Foreign Cinema",
    year: null,
    duration: "Varies",
    rating: "NR",
    poster: "",
    backdrop: "",
    synopsis: "Add a movie only after you have a working, authorized stream URL.",
    streamType: "not-configured",
    videoUrl: "",
    subtitles: {},
    rightsStatus: "No video configured. Add a licensed/authorized source before publishing."
  },
  {
    id: "kd-01",
    title: "K-Drama — Add Licensed Title",
    category: "kdrama",
    categoryLabel: "K-Dramas & Asian Series",
    year: null,
    duration: "Varies",
    rating: "NR",
    poster: "",
    backdrop: "",
    synopsis: "Add a series only after you have a working, authorized stream URL.",
    streamType: "not-configured",
    videoUrl: "",
    subtitles: {},
    rightsStatus: "No video configured. Add a licensed/authorized source before publishing."
  }
];
