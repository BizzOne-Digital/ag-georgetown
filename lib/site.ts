export const SITE_URL = "https://www.agliquidationgeorgetown.com";

export const BUSINESS = {
  name: "AG Liquidation Perfume & Cosmetics - Georgetown",
  shortName: "AG Liquidation",
  address: {
    street: "130 Guelph St",
    city: "Georgetown",
    region: "ON",
    postalCode: "L7G 1T9",
    country: "CA",
  },
  // TODO: confirm real business phone number with client
  phone: "(905) 000-0000",
  instagramHandle: "@agcosmeticsgeorgetown",
  instagramUrl: "https://www.instagram.com/agcosmeticsgeorgetown",
  // TODO: confirm real store hours with client - placeholder based on sibling
  // AG location pattern (Burlington: 7 days, 10am-6:30pm)
  hours: [
    { days: "Monday - Saturday", time: "10:00 AM - 7:00 PM" },
    { days: "Sunday", time: "11:00 AM - 5:00 PM" },
  ],
  geo: {
    // TODO: confirm precise geo-coordinates for 130 Guelph St, Georgetown, ON
    lat: 43.6499,
    lng: -79.9192,
  },
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=130+Guelph+St+Georgetown+ON+L7G+1T9",
};

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/products" },
  { label: "Offers", href: "/offers" },
  { label: "About", href: "/about" },
  { label: "Visit Us", href: "/contact" },
];

export const FOOTER_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/products" },
  { label: "Offers", href: "/offers" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];
