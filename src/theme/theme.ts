/**
 * Resolved design tokens aligned with `tokens.json` / `token.json` (DTCG-style).
 */
export type AppTheme = {
  color: {
    /** Figma `About-us 1280px` frame fill — `color/ref/palette/neutral/100` */
    pageCanvas: string;
    neutral100: string;
    neutral200: string;
    neutral700: string;
    neutral900: string;
    cyan700: string;
    onSurface: string;
    onSurfaceVariant: string;
    onPrimary: string;
    primary: string;
    yellow600: string;
    footerBg: string;
    overlay: string;
    grey0: string;
    brandLabel: string;
    tertiaryText: string;
    primaryTextUi: string;
    socialBg: string;
  };
  radius: {
    sm: string;
    md: string;
    lg: string;
    pill: string;
  };
  space: {
    0: string;
    4: string;
    8: string;
    12: string;
    16: string;
    20: string;
    24: string;
    28: string;
    32: string;
    40: string;
    48: string;
    64: string;
    96: string;
  };
  shadow: {
    displayTitle: string;
    avatar: string;
  };
  font: {
    body: string;
  };
  layout: {
    maxWidth: string;
  };
};

export const theme: AppTheme = {
  color: {
    pageCanvas: "#f2f2f2",
    neutral100: "#f2f2f2",
    neutral200: "#d7d7d7",
    neutral700: "#595959",
    neutral900: "#2d2d2d",
    cyan700: "#01afd1",
    onSurface: "#2d2d2d",
    onSurfaceVariant: "#707070",
    onPrimary: "#f2f2f2",
    primary: "#01afd1",
    yellow600: "#fee60b",
    footerBg: "#112023",
    overlay: "rgba(0, 0, 0, 0.4)",
    grey0: "#fbfbfb",
    brandLabel: "#494949",
    tertiaryText: "#4e4e4e",
    primaryTextUi: "#202020",
    socialBg: "#212e30",
  },
  radius: {
    sm: "4px",
    md: "8px",
    lg: "12px",
    pill: "9999px",
  },
  space: {
    0: "0",
    4: "4px",
    8: "8px",
    12: "12px",
    16: "16px",
    20: "20px",
    24: "24px",
    28: "28px",
    32: "32px",
    40: "40px",
    48: "48px",
    64: "64px",
    96: "96px",
  },
  shadow: {
    displayTitle: "0 2px 8px rgba(0, 0, 0, 0.12)",
    avatar: "0 6px 24px 6px rgba(0, 0, 0, 0.16)",
  },
  font: {
    body: 'var(--font-roboto, "Roboto"), system-ui, sans-serif',
  },
  /** Content rails span full viewport; sections use their own max-width + padding. */
  layout: {
    maxWidth: "100%",
  },
};
