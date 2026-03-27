import { figmaSrc } from "@/lib/figmaAssets";
import type {
  FooterColumn,
  FooterLinkItem,
  NavigationBarProps,
  SiteFooterProps,
} from "@/components/layout/types";

const f = figmaSrc;

function footerLinks(labels: string[]): FooterLinkItem[] {
  return labels.map((label) => ({
    id: label.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
    label,
  }));
}

const indiaColumn: FooterColumn = {
  id: "india",
  title: "India Packages",
  links: footerLinks([
    "Ladakh",
    "Kashmir",
    "Andaman",
    "Meghalaya",
    "Spiti Valley",
    "Kerala",
    "Sikkim",
    "Rajasthan",
    "Himachal Pradesh",
    "Uttarakhand",
  ]),
};

const intlColumn: FooterColumn = {
  id: "intl",
  title: "International Packages",
  links: footerLinks([
    "Europe",
    "Bhutan",
    "Vietnam",
    "Bali",
    "Thailand",
    "Dubai",
    "Turkey",
    "Sri Lanka",
    "Maldives",
    "Singapore",
    "Malaysia",
    "Mauritius",
    "Baku",
    "Almaty",
  ]),
};

const specialColumn: FooterColumn = {
  id: "special",
  title: "WanderOn Special",
  links: footerLinks([
    "Honeymoon Packages",
    "Corporate Tours",
    "Weekend Getaways",
  ]),
};

const companyColumn: FooterColumn = {
  id: "company",
  title: "Company",
  links: footerLinks([
    "About Us",
    "Privacy Policy",
    "Cancellation Policy",
    "Terms & Conditions",
    "Disclaimer",
    "Careers",
  ]),
};

/** Site-wide header (navigation) — used from root layout. */
export const siteNavigation: NavigationBarProps = {
  logoSrc: f("5db605581f3bea4a33a0e64b17437646cdc40e94.png"),
  logoAlt: "WanderOn",
  searchPlaceholder: "Where do you want to go?",
  searchIconSrc: f("0dfcd344a6ce667e7965febb0c4c75513addfe11.svg"),
  topLinks: [
    { id: "xmas", label: "Christmas & New Year" },
    { id: "about", label: "About us" },
    { id: "corporate", label: "Corporate Tours" },
  ],
  phoneHref: "tel:+919090403075",
  phoneLabel: "+91-9090403075",
  callIconSrc: f("875ee872dc9eeea268782b92f80372419313bffa.svg"),
  categories: [
    { id: "intl-pkg", label: "International Packages", showChevron: true },
    { id: "india-pkg", label: "India Packages", showChevron: true },
    { id: "weekend", label: "Weekend Trips", showChevron: true },
    { id: "group", label: "Group Tours", showChevron: true },
    { id: "visa-free", label: "Visa Free Countries", showChevron: true },
    { id: "honeymoon", label: "Honeymoon Packages", showChevron: false },
  ],
  chevronIconSrc: f("6c632e9bb06c70b22b62abdab70d2a6be8d6ed06.svg"),
};

/** Site-wide footer — used from root layout. */
export const siteFooter: SiteFooterProps = {
  columns: [indiaColumn, intlColumn, specialColumn, companyColumn],
  companyName: "WANDERON EXPERIENCES PVT LTD",
  companyAddress:
    "3rd Floor, Building No-436, Phase IV, Udyog Vihar, Sector-18, Gurugram, Haryana-122015",
  contacts: [
    {
      id: "web",
      iconSrc: f("c8bef2f0a85985f7e63aa43b87eaa44c99127295.svg"),
      text: "www.wanderon.in",
      widthPx: 173,
      href: "https://www.wanderon.in",
    },
    {
      id: "mail",
      iconSrc: f("35508e4a9e13d853a35ee86614576bc224551c1a.svg"),
      text: "hello@wanderon.in",
      widthPx: 194,
      href: "mailto:hello@wanderon.in",
    },
    {
      id: "phone",
      iconSrc: f("4da4cae07c4a318997e4aaa3174c2791aca67bfb.svg"),
      text: "+91-9090403075",
      widthPx: 171,
      href: "tel:+919090403075",
    },
  ],
  socials: [
    {
      id: "instagram",
      href: "#",
      ariaLabel: "Instagram",
      iconSrc: f("f85f70d5dc020db322a014933351964c8213cb69.svg"),
      iconWidth: 18,
      iconHeight: 18,
    },
    {
      id: "facebook",
      href: "#",
      ariaLabel: "Facebook",
      iconSrc: f("bcbaf615c6ec61cf9c2b353dcf1ad197c65fd0ec.svg"),
      iconWidth: 30,
      iconHeight: 30,
      variant: "facebook",
    },
    {
      id: "linkedin",
      href: "#",
      ariaLabel: "LinkedIn",
      iconSrc: f("0dd038c0f142786b68a22ba1c673ea39046bb605.svg"),
      iconWidth: 18,
      iconHeight: 18,
    },
    {
      id: "youtube",
      href: "#",
      ariaLabel: "YouTube",
      iconSrc: f("0b9f0036b254472c8ce3b97b6927f9c1dc77be29.svg"),
      iconWidth: 20,
      iconHeight: 14,
      variant: "youtube",
    },
  ],
  skylineSrc: f("4b074ab72af3fd49fc1f3e2492579f81a853829f.png"),
  copyright: "© WANDERON EXPERIENCES PVT LTD, All rights reserved.",
};
