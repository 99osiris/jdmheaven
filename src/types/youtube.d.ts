interface YT {
  Player: {
    new (
      elementId: string,
      options: {
        videoId: string;
        playerVars?: {
          autoplay?: number;
          controls?: number;
          loop?: number;
          mute?: number;
          showinfo?: number;
          rel?: number;
          playsinline?: number;
          playlist?: string;
        };
        events?: {
          onReady?: (event: { target: { playVideo: () => void } }) => void;
        };
      }
    ): void;
  };
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}