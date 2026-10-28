export interface MovieItem {
  id: string;
  title: string;
  year: number;
  category: "ghanaian-african" | "hollywood-action" | "bollywood" | "kdrama" | "international";
  synopsis: string;
  posterUrl: string;
  backdropUrl: string;
  videoUrl: string;
  videoFormat: "video/mp4" | "application/x-mpegURL"; // MP4 or HLS
  subtitles?: Array<{
    lang: string;
    label: string;
    src: string; // .vtt file
    default?: boolean;
  }>;
  rightsStatus: "Public Domain" | "Creative Commons CC-BY" | "Open Access / Rights Holder Licensed";
  licenceSourceUrl: string;
  attributionRequirements: string;
  verificationNotes: string;
}
