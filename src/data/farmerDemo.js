export const demoFarmer = {
  id: "farmer-001",

  name: "Rajmal Patidar",

  phone: "9340004380",

  email: "farmer@krishimitra.in",

  password: "farmer123",

  village: "Neemuch",

  district: "Neemuch",

  state: "Madhya Pradesh",

  pincode: "458441",

  landArea: 5,

  landUnit: "Acre",

  irrigation: "Borewell",

  crops: [
    {
      id: "crop-1",
      name: "सोयाबीन",
      area: 2,
      season: "खरीफ",
      status: "फसल बढ़ रही है",
      sowingDate: "2026-06-20",
    },
    {
      id: "crop-2",
      name: "लहसुन",
      area: 1.5,
      season: "रबी",
      status: "बुवाई की तैयारी",
      sowingDate: "",
    },
    {
      id: "crop-3",
      name: "गेहूँ",
      area: 1.5,
      season: "रबी",
      status: "बुवाई की तैयारी",
      sowingDate: "",
    },
  ],
};

export const mandiData = [
  {
    id: 1,
    commodity: "सोयाबीन",
    market: "नीमच",
    price: 4850,
    unit: "क्विंटल",
    change: 80,
  },
  {
    id: 2,
    commodity: "लहसुन",
    market: "नीमच",
    price: 7200,
    unit: "क्विंटल",
    change: -120,
  },
  {
    id: 3,
    commodity: "गेहूँ",
    market: "नीमच",
    price: 2580,
    unit: "क्विंटल",
    change: 35,
  },
  {
    id: 4,
    commodity: "चना",
    market: "मंदसौर",
    price: 5900,
    unit: "क्विंटल",
    change: 55,
  },
  {
    id: 5,
    commodity: "मक्का",
    market: "नीमच",
    price: 2150,
    unit: "क्विंटल",
    change: -25,
  },
];

export const weatherData = {
  location: "नीमच, मध्य प्रदेश",
  temperature: 29,
  condition: "आंशिक बादल",
  humidity: 62,
  wind: 14,
  rainChance: 35,
};

export const advisories = [
  {
    id: 1,
    crop: "सोयाबीन",
    title: "फसल में पत्तियों की निगरानी करें",
    description:
      "पत्तियों पर पीले या भूरे धब्बे दिखाई देने पर फसल की नियमित निगरानी करें। किसी भी दवा का प्रयोग करने से पहले उत्पाद लेबल और स्थानीय कृषि विशेषज्ञ की सलाह देखें।",
    type: "फसल सलाह",
  },
  {
    id: 2,
    crop: "लहसुन",
    title: "सिंचाई का ध्यान रखें",
    description:
      "मिट्टी की नमी के अनुसार सिंचाई करें और खेत में पानी जमा न होने दें।",
    type: "सिंचाई",
  },
  {
    id: 3,
    crop: "गेहूँ",
    title: "खेत की तैयारी",
    description:
      "रबी फसल की बुवाई से पहले खेत की तैयारी, बीज चयन और स्थानीय अनुशंसाओं की जांच करें।",
    type: "रबी तैयारी",
  },
];

export const farmerSchemes = [
  {
    id: "pm-kisan",
    name: "प्रधानमंत्री किसान सम्मान निधि",
    shortName: "PM-KISAN",
    category: "आय सहायता",
    description:
      "पात्र भूमिधारी किसान परिवारों के लिए केंद्र सरकार की आय सहायता योजना।",
    url: "https://pmkisan.gov.in/",
  },
  {
    id: "pmfby",
    name: "प्रधानमंत्री फसल बीमा योजना",
    shortName: "PMFBY",
    category: "फसल बीमा",
    description:
      "अधिसूचित फसलों के लिए फसल जोखिम और बीमा से संबंधित योजना।",
    url: "https://pmfby.gov.in/",
  },
  {
    id: "kcc",
    name: "किसान क्रेडिट कार्ड",
    shortName: "KCC",
    category: "कृषि ऋण",
    description:
      "कृषि एवं संबद्ध गतिविधियों के लिए बैंकिंग क्रेडिट सुविधा।",
    url: "https://www.myscheme.gov.in/schemes/kcc",
  },
];

export const savedItems = [
  {
    id: 1,
    type: "article",
    title: "सोयाबीन की खेती की पूरी जानकारी",
    category: "फसल",
  },
  {
    id: 2,
    type: "scheme",
    title: "प्रधानमंत्री किसान सम्मान निधि",
    category: "सरकारी योजना",
  },
];