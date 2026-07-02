import type { Props } from "astro";
import IconMail from "@/assets/icons/IconMail.svg";
import IconGitHub from "@/assets/icons/IconGitHub.svg";
import IconBrandX from "@/assets/icons/IconBrandX.svg";
import IconLinkedin from "@/assets/icons/IconLinkedin.svg";
import IconWhatsapp from "@/assets/icons/IconWhatsapp.svg";
import IconFacebook from "@/assets/icons/IconFacebook.svg";
import IconTelegram from "@/assets/icons/IconTelegram.svg";
import IconPinterest from "@/assets/icons/IconPinterest.svg";
import config, { SITE } from "@/config";

interface Social {
  name: string;
  href: string;
  linkTitle: string;
  icon: (_props: Props) => Element;
}

const ICONS = {
  facebook: IconFacebook,
  github: IconGitHub,
  linkedin: IconLinkedin,
  mail: IconMail,
  pinterest: IconPinterest,
  telegram: IconTelegram,
  whatsapp: IconWhatsapp,
  x: IconBrandX,
} as const;

export const SOCIALS: Social[] = [
  ...config.socials.map(social => ({
    name: formatSocialName(social.name),
    href: social.url,
    linkTitle: social.linkTitle ?? getSocialLinkTitle(social.name),
    icon: getIcon(social.name),
  })),
];

export const SHARE_LINKS: Social[] = [
  ...config.shareLinks.map(social => ({
    name: formatSocialName(social.name),
    href: social.url,
    linkTitle: social.linkTitle ?? getShareLinkTitle(social.name),
    icon: getIcon(social.name),
  })),
];

function getIcon(name: string) {
  const key = name.toLowerCase() as keyof typeof ICONS;
  const icon = ICONS[key];

  if (!icon) {
    throw new Error(`Unsupported social icon: ${name}`);
  }

  return icon;
}

function formatSocialName(name: string) {
  if (name.toLowerCase() === "x") return "X";

  return name.charAt(0).toUpperCase() + name.slice(1);
}

function getSocialLinkTitle(name: string) {
  const formattedName = formatSocialName(name);

  if (name.toLowerCase() === "mail") {
    return `Send an email to ${SITE.title}`;
  }

  return `${SITE.title} on ${formattedName}`;
}

function getShareLinkTitle(name: string) {
  const formattedName = formatSocialName(name);

  if (name.toLowerCase() === "mail") {
    return "Share this post via email";
  }

  if (["telegram", "whatsapp"].includes(name.toLowerCase())) {
    return `Share this post via ${formattedName}`;
  }

  return `Share this post on ${formattedName}`;
}
