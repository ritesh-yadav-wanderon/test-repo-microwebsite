export type NavTopLink = {
  id: string;
  label: string;
};

export type NavCategory = {
  id: string;
  label: string;
  showChevron: boolean;
};

export type NavigationBarProps = {
  logoSrc: string;
  logoAlt: string;
  searchPlaceholder: string;
  searchIconSrc: string;
  topLinks: NavTopLink[];
  onTopLinkClick?: (id: string) => void;
  phoneHref: string;
  phoneLabel: string;
  callIconSrc: string;
  categories: NavCategory[];
  chevronIconSrc: string;
  onCategoryClick?: (id: string) => void;
};

export type FooterLinkItem = {
  id: string;
  label: string;
  href?: string;
  onClick?: () => void;
};

export type FooterColumn = {
  id: string;
  title: string;
  links: FooterLinkItem[];
};

export type FooterContactItem = {
  id: string;
  iconSrc: string;
  text: string;
  widthPx: number;
  href?: string;
};

export type FooterSocialItem = {
  id: string;
  href: string;
  iconSrc: string;
  ariaLabel: string;
  iconWidth: number;
  iconHeight: number;
  variant?: "default" | "facebook" | "youtube";
};

export type SiteFooterProps = {
  columns: FooterColumn[];
  companyName: string;
  companyAddress: string;
  contacts: FooterContactItem[];
  socials: FooterSocialItem[];
  skylineSrc: string;
  copyright: string;
};
