interface Window {
  __closeLightbox?: (() => void) | null;
  __lightboxSwapBound?: boolean;
  theme?: {
    themeValue: string;
    setPreference: () => void;
    reflectPreference: () => void;
    getTheme: () => string;
    setTheme: (val: string) => void;
  };
}
