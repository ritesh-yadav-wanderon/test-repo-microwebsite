export interface DestItem {
  label: string;
  slug: string;
  trending?: boolean;
}

export interface DestRegion {
  label: string;
  slug: string;
  allLabel: string;
  items: DestItem[];
  seeMore?: boolean;
}

/** Destination regions shared by the burger menu and the enquiry contact form. */
export const DEST_REGIONS: DestRegion[] = [
  {
    label: "India", slug: "india", allLabel: "All trips in India", seeMore: true,
    items: [
      { label: "Ladakh",            slug: "ladakh",            trending: true  },
      { label: "Spiti",             slug: "spiti",             trending: true  },
      { label: "Meghalaya",         slug: "meghalaya"                          },
      { label: "Kashmir",           slug: "kashmir"                            },
      { label: "Sikkim",            slug: "sikkim"                             },
      { label: "Himachal Pradesh",  slug: "himachal-pradesh"                   },
      { label: "Uttarakhand",       slug: "uttarakhand"                        },
      { label: "Arunachal Pradesh", slug: "arunachal-pradesh"                  },
      { label: "Andaman",           slug: "andaman"                            },
      { label: "Rajasthan",         slug: "rajasthan"                          },
      { label: "Kerala",            slug: "kerala"                             },
      { label: "Nagaland",          slug: "nagaland"                           },
    ],
  },
  {
    label: "Europe", slug: "europe", allLabel: "All trips to Europe (multiple destinations)",
    items: [
      { label: "Iceland",     slug: "iceland",     trending: true },
      { label: "Spain",       slug: "spain",       trending: true },
      { label: "France",      slug: "france"                      },
      { label: "Switzerland", slug: "switzerland"                 },
      { label: "Georgia",     slug: "georgia"                     },
    ],
  },
  {
    label: "Asia", slug: "asia", allLabel: "All trips to Asia",
    items: [
      { label: "Japan",      slug: "japan",      trending: true },
      { label: "Bhutan",     slug: "bhutan",     trending: true },
      { label: "Sri Lanka",  slug: "sri-lanka"                  },
      { label: "Kazakhstan", slug: "kazakhstan"                  },
      { label: "Maldives",   slug: "maldives"                   },
      { label: "Malaysia",   slug: "malaysia"                   },
      { label: "Mauritius",  slug: "mauritius"                  },
    ],
  },
  {
    label: "South East Asia", slug: "south-east-asia", allLabel: "All trips to South East Asia",
    items: [
      { label: "Bali",        slug: "bali",        trending: true },
      { label: "Thailand",    slug: "thailand",    trending: true },
      { label: "Vietnam",     slug: "vietnam",     trending: true },
      { label: "Philippines", slug: "philippines"                 },
    ],
  },
  {
    label: "Middle East", slug: "middle-east", allLabel: "All trips to Middle East",
    items: [
      { label: "Turkey", slug: "turkey", trending: true },
      { label: "Dubai",  slug: "dubai",  trending: true },
    ],
  },
  {
    label: "Africa", slug: "africa", allLabel: "All trips to Africa",
    items: [
      { label: "Kenya",        slug: "kenya",        trending: true },
      { label: "South Africa", slug: "south-africa", trending: true },
    ],
  },
  {
    label: "Oceania", slug: "oceania", allLabel: "All trips to Oceania",
    items: [
      { label: "Australia",    slug: "australia",    trending: true },
      { label: "New Zealand",  slug: "new-zealand",  trending: true },
    ],
  },
];
