window.STORE = {
  name: "East Side Liquor Co",
  phone: "(250) 260-6606",
  phoneHref: "tel:+12502606606",
  social: {
    instagram: "https://www.instagram.com/eastsideliquorcompany/",
    instagramHandle: "@eastsideliquorcompany",
  },

  // Set to false when you drop this month’s flyer image in images/flyers/
  flyerComingSoon: true,

  // Newest month first. Do not delete old lines — past months stay in the archive.
  // Filename must include YYYY-MM (example: 2026-08-august.jpg)
  monthlyFlyers: [
    // "images/flyers/2026-08-august.jpg",
  ],

  loyaltyProgram: {
    rate: "1%",
    title: "Points & Cashback Rewards",
    headline: "Earn 1% cashback on every transaction",
    description:
      "Every purchase you make in store earns you points — get 1% cashback on everything you buy. The more you shop, the more you save!",
    badge: "Rewards Program",
  },

  offers: [
    {
      tag: "Beer",
      title: "15-pack special",
      description: "Selected beer 15-packs — cold and ready to go.",
      price: "$19",
      priceDetail: "15 pack",
    },
    {
      tag: "Wine",
      title: "Everyday wines",
      description: "Solid bottles for weeknights and weekends.",
      price: "from $8",
    },
    {
      tag: "Coolers & Cider",
      title: "Chilled starters",
      description: "Coolers and cider priced to share.",
      price: "from $10",
    },
    {
      tag: "Veterans",
      title: "Veterans discount",
      description:
        "Special discount for veterans — thank you for your service. Show your ID in store.",
      price: "Ask in store",
    },
  ],
};
