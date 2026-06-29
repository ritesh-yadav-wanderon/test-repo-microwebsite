export interface CategoryTheme {
  name: string;
  stripBg: string;
  underline: string;
  sectionGradient: string;
  tabActive: string;
  pillBg: string;
  pillBorder: string;
  progressFill: string;
  destIcoBg: string;
  cardAccent: string;
  cardPillBg: string;
}

export const CATEGORY_THEMES: CategoryTheme[] = [
  {
    name: "All Trips",
    stripBg: "#fdf6ee",
    underline: "#8a6a4f",
    sectionGradient: "linear-gradient(180deg, rgba(133,89,0,0.06) 0%, rgba(254,253,251,0.4) 100%)",
    tabActive: "#362725",
    pillBg: "#f3efe5",
    pillBorder: "#ebe6dd",
    progressFill: "#ae957e",
    destIcoBg: "radial-gradient(circle at 50% 42%, #ffffff 0%, #efe2d3 78%)",
    cardAccent: "#846950",
    cardPillBg: "#fefdfc",
  },
  {
    name: "Adventure",
    stripBg: "#fdf2e4",
    underline: "#c06428",
    sectionGradient: "linear-gradient(180deg, rgba(190,95,10,0.09) 0%, rgba(254,253,251,0.4) 100%)",
    tabActive: "#6a2e08",
    pillBg: "#fdf2e4",
    pillBorder: "#e8ccaa",
    progressFill: "#c07438",
    destIcoBg: "radial-gradient(circle at 50% 42%, #ffffff 0%, #f8ddb8 78%)",
    cardAccent: "#a85820",
    cardPillBg: "#fdf2e4",
  },
  {
    name: "Luxury",
    stripBg: "#f6f0fc",
    underline: "#8050b4",
    sectionGradient: "linear-gradient(180deg, rgba(120,70,180,0.07) 0%, rgba(254,253,251,0.4) 100%)",
    tabActive: "#3d1860",
    pillBg: "#f6f0fc",
    pillBorder: "#d8c8f0",
    progressFill: "#9878c8",
    destIcoBg: "radial-gradient(circle at 50% 42%, #ffffff 0%, #e8d5f8 78%)",
    cardAccent: "#7040a8",
    cardPillBg: "#f6f0fc",
  },
  {
    name: "Culture",
    stripBg: "#fef2f0",
    underline: "#b84040",
    sectionGradient: "linear-gradient(180deg, rgba(180,55,55,0.07) 0%, rgba(254,253,251,0.4) 100%)",
    tabActive: "#701818",
    pillBg: "#fef2f0",
    pillBorder: "#f0ccc8",
    progressFill: "#c86868",
    destIcoBg: "radial-gradient(circle at 50% 42%, #ffffff 0%, #f8d8d0 78%)",
    cardAccent: "#a03030",
    cardPillBg: "#fef2f0",
  },
  {
    name: "Festival",
    stripBg: "#fdf8e8",
    underline: "#c89018",
    sectionGradient: "linear-gradient(180deg, rgba(200,140,0,0.07) 0%, rgba(254,253,251,0.4) 100%)",
    tabActive: "#7a5000",
    pillBg: "#fdf8e8",
    pillBorder: "#edd898",
    progressFill: "#d4a030",
    destIcoBg: "radial-gradient(circle at 50% 42%, #ffffff 0%, #f8e8a8 78%)",
    cardAccent: "#b08020",
    cardPillBg: "#fdf8e8",
  },
  {
    name: "Wellness",
    stripBg: "#eef8f2",
    underline: "#2e7d58",
    sectionGradient: "linear-gradient(180deg, rgba(40,120,80,0.07) 0%, rgba(254,253,251,0.4) 100%)",
    tabActive: "#154a2c",
    pillBg: "#eef8f2",
    pillBorder: "#b8e0c8",
    progressFill: "#4a9e70",
    destIcoBg: "radial-gradient(circle at 50% 42%, #ffffff 0%, #c0eccc 78%)",
    cardAccent: "#267050",
    cardPillBg: "#eef8f2",
  },
  {
    name: "Weekend",
    stripBg: "#eef4fc",
    underline: "#2858b0",
    sectionGradient: "linear-gradient(180deg, rgba(40,80,180,0.07) 0%, rgba(254,253,251,0.4) 100%)",
    tabActive: "#102868",
    pillBg: "#eef4fc",
    pillBorder: "#b8cce8",
    progressFill: "#4878c0",
    destIcoBg: "radial-gradient(circle at 50% 42%, #ffffff 0%, #c0d4f0 78%)",
    cardAccent: "#2050a8",
    cardPillBg: "#eef4fc",
  },
];
