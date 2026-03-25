export const SITE = {
  website: "https://romanfaeh.com/",
  author: "Roman Faeh",
  profile: "https://romanfaeh.com/",
  desc: "This is where I write about AI systems, security, and the engineering decisions that actually hold up.",
  title: "Roman Faeh",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 4,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: false,
  showBackButton: true, // show back button in post detail
  editPost: {
    enabled: true,
    text: "Edit page",
    url: "https://github.com/satnaing/astro-paper/edit/main/",
  },
  dynamicOgImage: true,
  dir: "ltr", // "rtl" | "auto"
  lang: "en", // html lang code. Set this empty and default will be "en"
  timezone: "Europe/Zurich",
} as const;
