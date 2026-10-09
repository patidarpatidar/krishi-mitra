export const adminData = {
  categories: [
    {
      id: "cat-001",
      name: "अनाज",
      slug: "cereals",
      description: "गेहूं, मक्का, ज्वार आदि अनाज फसलों की जानकारी",
      status: "active",
    },
    {
      id: "cat-002",
      name: "दलहन",
      slug: "pulses",
      description: "चना, मसूर, उड़द, मूंग आदि",
      status: "active",
    },
    {
      id: "cat-003",
      name: "तिलहन",
      slug: "oilseeds",
      description: "सोयाबीन, सरसों आदि",
      status: "active",
    },
    {
      id: "cat-004",
      name: "सब्जियां",
      slug: "vegetables",
      description: "विभिन्न सब्जी फसलों की जानकारी",
      status: "active",
    },
    {
      id: "cat-005",
      name: "मसाले",
      slug: "spices",
      description: "लहसुन, धनिया आदि",
      status: "active",
    },
  ],

  crops: [
    {
      id: "crop-001",
      name: "सोयाबीन",
      englishName: "Soybean",
      slug: "soybean",
      category: "तिलहन",
      status: "published",
      featured: true,

      image: "/images/crops/soybean.jpg",

      shortDescription:
        "मध्य प्रदेश की प्रमुख खरीफ तिलहन फसल।",

      description:
        "सोयाबीन की उन्नत खेती, बुवाई, किस्म, खाद, सिंचाई, रोग एवं कीट प्रबंधन की जानकारी।",

      season: "खरीफ",

      soil:
        "अच्छी जल निकासी वाली दोमट एवं मध्यम काली मिट्टी।",

      sowingTime:
        "मानसून की शुरुआत के बाद पर्याप्त नमी होने पर।",

      seedRate:
        "लगभग 30-40 किलोग्राम प्रति हेक्टेयर, किस्म एवं बीज आकार के अनुसार।",

      irrigation:
        "सामान्यतः वर्षा आधारित; आवश्यकता के अनुसार सिंचाई।",

      fertilizers: [
        "मृदा परीक्षण के आधार पर उर्वरक दें।",
        "जैविक खाद का उपयोग लाभकारी हो सकता है।",
      ],

      diseases: [
        "पीला मोजेक",
        "रस्ट",
        "चारकोल रॉट",
      ],

      pests: [
        "गर्डल बीटल",
        "सेमीलूपर",
        "अफिड",
      ],

      content: [],
    },

    {
      id: "crop-002",
      name: "गेहूं",
      englishName: "Wheat",
      slug: "wheat",
      category: "अनाज",
      status: "published",
      featured: true,

      image: "/images/crops/wheat.jpg",

      shortDescription:
        "रबी मौसम की प्रमुख खाद्यान्न फसल।",

      description:
        "गेहूं की उन्नत खेती और उत्पादन प्रबंधन।",

      season: "रबी",

      soil: "उपजाऊ दोमट मिट्टी।",

      sowingTime: "अक्टूबर के अंत से नवंबर।",

      seedRate: "100-125 kg/ha",

      irrigation: "फसल की अवस्था एवं मिट्टी के अनुसार।",

      fertilizers: [],
      diseases: [],
      pests: [],
      content: [],
    },

    {
      id: "crop-003",
      name: "लहसुन",
      englishName: "Garlic",
      slug: "garlic",
      category: "मसाले",
      status: "published",
      featured: true,

      image: "/images/crops/garlic.jpg",

      shortDescription:
        "नीमच-मालवा क्षेत्र की महत्वपूर्ण मसाला फसल।",

      description:
        "लहसुन की उन्नत खेती, किस्म, लागत, उत्पादन एवं रोग प्रबंधन।",

      season: "रबी",

      soil: "भुरभुरी एवं अच्छी जल निकासी वाली मिट्टी।",

      sowingTime: "सितंबर-अक्टूबर",

      seedRate: "किस्म के अनुसार",

      irrigation: "नियमित हल्की सिंचाई।",

      fertilizers: [],
      diseases: [],
      pests: [],
      content: [],
    },

    {
      id: "crop-004",
      name: "चना",
      englishName: "Chickpea",
      slug: "gram",
      category: "दलहन",
      status: "draft",
      featured: false,

      image: "/images/crops/gram.jpg",

      shortDescription:
        "प्रमुख रबी दलहन फसल।",

      description:
        "चना उत्पादन एवं फसल प्रबंधन।",

      season: "रबी",

      soil: "मध्यम से भारी दोमट मिट्टी।",

      sowingTime: "अक्टूबर-नवंबर",

      seedRate: "किस्म के अनुसार",

      irrigation: "सीमित सिंचाई।",

      fertilizers: [],
      diseases: [],
      pests: [],
      content: [],
    },
  ],

  schemes: [
    {
      id: "scheme-001",
      name: "प्रधानमंत्री किसान सम्मान निधि",
      shortName: "PM-KISAN",
      category: "आय सहायता",
      level: "केंद्र सरकार",
      status: "published",

      summary:
        "पात्र किसान परिवारों के लिए केंद्र सरकार की आय सहायता योजना।",

      benefits: [
        "₹6,000 प्रति वर्ष की सहायता",
        "तीन समान किस्तों में भुगतान",
      ],

      eligibility: [
        "योजना के नियमों के अनुसार पात्र किसान परिवार",
      ],

      documents: [
        "आधार",
        "बैंक खाता",
        "भूमि संबंधी जानकारी",
      ],

      officialUrl:
        "https://pmkisan.gov.in/",

      applyUrl:
        "https://pmkisan.gov.in/",
    },

    {
      id: "scheme-002",
      name: "प्रधानमंत्री फसल बीमा योजना",
      shortName: "PMFBY",
      category: "फसल बीमा",
      level: "केंद्र सरकार",
      status: "published",

      summary:
        "प्राकृतिक जोखिमों से फसल सुरक्षा के लिए फसल बीमा योजना।",

      benefits: [
        "अधिसूचित फसलों का बीमा",
        "फसल नुकसान की स्थिति में दावा प्रक्रिया",
      ],

      eligibility: [
        "अधिसूचित क्षेत्र और फसल के अनुसार पात्र किसान",
      ],

      documents: [
        "आधार",
        "बैंक विवरण",
        "भूमि/फसल संबंधी जानकारी",
      ],

      officialUrl:
        "https://pmfby.gov.in/",

      applyUrl:
        "https://pmfby.gov.in/farmerApplicationForm",
    },
  ],

  organic: [
    {
      id: "organic-001",
      title: "जैविक खेती की शुरुआत कैसे करें",
      slug: "organic-farming-start",
      category: "जैविक खेती",
      status: "published",

      summary:
        "रासायनिक इनपुट पर निर्भरता कम करके जैविक खेती की शुरुआत।",

      content:
        "जैविक खेती में मिट्टी की सेहत, जैविक खाद, फसल चक्र और जैविक कीट प्रबंधन महत्वपूर्ण हैं।",

      featured: true,
    },

    {
      id: "organic-002",
      title: "वर्मी कम्पोस्ट बनाने की विधि",
      slug: "vermicompost",
      category: "जैविक खाद",
      status: "draft",

      summary:
        "कृषि अवशेषों से वर्मी कम्पोस्ट तैयार करने की जानकारी।",

      content:
        "वर्मी कम्पोस्ट तैयार करने के लिए उपयुक्त जैविक सामग्री, नमी और केंचुओं का उपयोग किया जाता है।",

      featured: false,
    },
  ],

  livestock: [
    {
      id: "live-001",
      title: "गाय पालन",
      slug: "cow-farming",
      category: "गाय",
      status: "published",

      description:
        "गाय पालन, नस्ल, आहार, स्वास्थ्य और दूध उत्पादन की जानकारी।",

      content: [],
    },

    {
      id: "live-002",
      title: "भैंस पालन",
      slug: "buffalo-farming",
      category: "भैंस",
      status: "published",

      description:
        "भैंस पालन और डेयरी प्रबंधन की जानकारी।",

      content: [],
    },
  ],

  livestockListings: [
    {
      id: "listing-001",

      sellerName: "Ramesh Patidar",
      phone: "9340000000",

      animalType: "गाय",
      breed: "Gir",

      age: "4 वर्ष",

      location: "Neemuch",

      price: "85000",

      description:
        "स्वस्थ दूध देने वाली गाय।",

      status: "pending",

      submittedAt: "2026-10-08",
    },

    {
      id: "listing-002",

      sellerName: "Mohan Singh",
      phone: "9826000000",

      animalType: "भैंस",
      breed: "Murrah",

      age: "5 वर्ष",

      location: "Mandsaur",

      price: "95000",

      description:
        "दूध देने वाली स्वस्थ भैंस।",

      status: "approved",

      submittedAt: "2026-10-07",
    },
  ],

  blogCategories: [
    {
      id: "blog-cat-001",
      name: "कृषि समाचार",
      slug: "agriculture-news",
      status: "active",
    },

    {
      id: "blog-cat-002",
      name: "उन्नत खेती",
      slug: "advanced-farming",
      status: "active",
    },

    {
      id: "blog-cat-003",
      name: "किसान सलाह",
      slug: "farmer-advice",
      status: "active",
    },

    {
      id: "blog-cat-004",
      name: "मंडी एवं बाजार",
      slug: "mandi-market",
      status: "active",
    },
  ],

  blogs: [
    {
      id: "blog-001",

      title:
        "लहसुन की उन्नत खेती: 1 एकड़ में अधिक उत्पादन कैसे लें?",

      slug:
        "garlic-advanced-farming",

      category:
        "उन्नत खेती",

      author:
        "Krishi Mitra",

      status:
        "published",

      featured:
        true,

      excerpt:
        "लहसुन की खेती में बेहतर उत्पादन के लिए बुवाई, सिंचाई, पोषण और रोग प्रबंधन की जानकारी।",

      image:
        "/images/blog/garlic.jpg",

      content:
        "<h2>लहसुन की उन्नत खेती</h2><p>लहसुन एक महत्वपूर्ण मसाला फसल है। सही किस्म, समय पर बुवाई और उचित प्रबंधन से बेहतर उत्पादन प्राप्त किया जा सकता है।</p>",

      tags: [
        "लहसुन",
        "खेती",
        "रबी",
      ],

      views: 245,

      publishedAt:
        "2026-10-08",
    },

    {
      id: "blog-002",

      title:
        "सोयाबीन में रोग और कीट प्रबंधन",

      slug:
        "soybean-pest-management",

      category:
        "किसान सलाह",

      author:
        "Krishi Mitra",

      status:
        "draft",

      featured:
        false,

      excerpt:
        "सोयाबीन में प्रमुख रोग एवं कीटों की पहचान और प्रबंधन।",

      image:
        "/images/blog/soybean.jpg",

      content:
        "<h2>सोयाबीन रोग प्रबंधन</h2><p>रोग की सही पहचान के बाद स्थानीय कृषि विशेषज्ञ की सलाह के अनुसार प्रबंधन करें।</p>",

      tags: [
        "सोयाबीन",
        "रोग",
        "कीट",
      ],

      views: 0,

      publishedAt:
        null,
    },
  ],
};