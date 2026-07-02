import userConfig from "../astro-paper.config";
import type { ResolvedAstroPaperConfig } from "./types/config";

const DEFAULT_OG_IMAGE = "";

const config: ResolvedAstroPaperConfig = {
  site: {
    ...userConfig.site,
    ogImage: userConfig.site.ogImage ?? DEFAULT_OG_IMAGE,
    lang: userConfig.site.lang ?? "en",
    timezone: userConfig.site.timezone ?? "UTC",
    dir: userConfig.site.dir ?? "ltr",
    googleVerification: userConfig.site.googleVerification,
  },
  posts: {
    perPage: userConfig.posts?.perPage ?? 4,
    perIndex: userConfig.posts?.perIndex ?? 4,
    scheduledPostMargin:
      userConfig.posts?.scheduledPostMargin ?? 15 * 60 * 1000,
  },
  features: {
    lightAndDarkMode: userConfig.features?.lightAndDarkMode ?? true,
    dynamicOgImage: userConfig.features?.dynamicOgImage ?? true,
    showArchives: userConfig.features?.showArchives ?? true,
    showBackButton: userConfig.features?.showBackButton ?? true,
    editPost: userConfig.features?.editPost ?? { enabled: false },
    search: userConfig.features?.search ?? "pagefind",
  },
  socials: userConfig.socials ?? [],
  shareLinks: userConfig.shareLinks ?? [],
};

export default config;

// Compatibility layer for the existing local code while site configuration moves
// to the upstream AstroPaper `astro-paper.config.ts` shape.
export const SITE = {
  website: config.site.url,
  author: config.site.author,
  profile: config.site.profile,
  desc: config.site.description,
  title: config.site.title,
  ogImage: config.site.ogImage,
  lightAndDarkMode: config.features.lightAndDarkMode,
  postPerIndex: config.posts.perIndex,
  postPerPage: config.posts.perPage,
  scheduledPostMargin: config.posts.scheduledPostMargin,
  showArchives: config.features.showArchives,
  showBackButton: config.features.showBackButton,
  editPost:
    config.features.editPost.enabled === true
      ? {
          enabled: true,
          text: "Edit page",
          url: config.features.editPost.url,
        }
      : {
          enabled: false,
          text: "Edit page",
          url: "",
        },
  dynamicOgImage: config.features.dynamicOgImage,
  dir: config.site.dir,
  lang: config.site.lang,
  timezone: config.site.timezone,
} as const;
