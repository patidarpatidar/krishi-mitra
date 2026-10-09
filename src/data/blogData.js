// data/blogData.js

export const BLOG_CATEGORIES = [
  {
    id: 'all',
    label: 'सभी लेख',
    icon: '📚',
  },
  {
    id: 'फसल सुरक्षा',
    label: 'फसल सुरक्षा',
    icon: '🛡️',
  },
  {
    id: 'फसल प्रबंधन',
    label: 'फसल प्रबंधन',
    icon: '🌾',
  },
  {
    id: 'जैविक खेती',
    label: 'जैविक खेती',
    icon: '🌱',
  },
  {
    id: 'कृषि तकनीक',
    label: 'कृषि तकनीक',
    icon: '🚜',
  },
];

export const blogsData = [
  {
    id: '1',
    slug: 'garlic-care-masterclass',
    title:
      'लहसुन में पीलापन, थ्रिप्स व कंद आकार बढ़ाने की संपूर्ण गाइड',
    category: 'फसल सुरक्षा',
    date: '2026-09-28',
    dateLabel: '28 सितंबर 2026',

    author: 'डॉ. आर. के. शर्मा',
    authorRole: 'वरिष्ठ कृषि वैज्ञानिक',
    authorAvatar: '👨‍🌾',

    readTime: 6,
    views: 12450,
    likes: 840,
    comments: 92,

    hasVideo: true,
    hasGallery: true,
    isFeatured: true,

    coverImage:
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1200&q=80',

    excerpt:
      'नीमच व मंदसौर अंचल के लहसुन उत्पादकों के लिए विशेष गाइड। पीलापन, थ्रिप्स, रोग और कंद विकास को समझें।',

    tags: [
      'लहसुन',
      'नीमच',
      'मंदसौर',
      'थ्रिप्स',
      'NPK',
      'फसल सुरक्षा',
    ],

    content: {
      introduction:
        'लहसुन की फसल में पीलापन, थ्रिप्स और कंद के छोटे आकार जैसी समस्याएं कई कारणों से हो सकती हैं। सही पहचान के बाद ही उपचार या प्रबंधन का निर्णय लेना चाहिए।',

      sections: [
        {
          id: 'symptoms',
          title: 'लहसुन में पीलापन और थ्रिप्स की पहचान',
          paragraphs: [
            'पत्तियों पर चांदी जैसी धारियां या सफेद धब्बे दिखाई देना थ्रिप्स के संभावित प्रकोप का संकेत हो सकता है।',
            'पत्तियों का असामान्य पीलापन केवल कीट के कारण नहीं होता। पोषक तत्वों की कमी, जल प्रबंधन, जड़ संबंधी समस्या या रोग भी कारण हो सकते हैं।',
          ],
          bullets: [
            'पत्तियों पर सफेद या सिल्वर धारियां',
            'पत्तियों की नोक का सूखना',
            'नई पत्तियों की कमजोर बढ़वार',
            'कंद का अपेक्षित आकार न बनना',
          ],
        },

        {
          id: 'disease',
          title: 'फफूंदजनित रोग की संभावना',
          paragraphs: [
            'बैंगनी-भूरे धब्बे दिखाई देने पर फफूंदजनित रोग की संभावना देखी जा सकती है। खेत में लगातार नमी और खराब वायु संचार से समस्या बढ़ सकती है।',
          ],
          bullets: [
            'पत्तियों पर भूरे या बैंगनी धब्बे',
            'धब्बों के आसपास पीला क्षेत्र',
            'पुरानी पत्तियों का जल्दी सूखना',
          ],
        },

        {
          id: 'management',
          title: 'फसल प्रबंधन के महत्वपूर्ण कदम',
          paragraphs: [
            'किसी भी दवा या पोषक तत्व का प्रयोग करने से पहले खेत की वास्तविक स्थिति, रोग/कीट की पहचान और स्थानीय कृषि विशेषज्ञ की सलाह को प्राथमिकता दें।',
          ],
          bullets: [
            'खेत में नियमित निरीक्षण करें',
            'अधिक सिंचाई से बचें',
            'पौधों के बीच पर्याप्त हवा का आवागमन रखें',
            'पोषक तत्वों की कमी की पुष्टि करें',
            'एक साथ कई उत्पादों को बिना compatibility जांच के न मिलाएं',
          ],
        },
      ],

      safetyNote:
        'किसी भी कीटनाशक या फफूंदनाशक का उपयोग केवल उसके लेबल/स्थानीय कृषि विभाग की अनुशंसा के अनुसार करें। मात्रा और मिश्रण उत्पाद के formulation के अनुसार बदल सकते हैं।',

      faqs: [
        {
          question: 'लहसुन में पीलापन आने का मुख्य कारण क्या हो सकता है?',
          answer:
            'पीलापन कई कारणों से हो सकता है जैसे पोषक तत्वों की कमी, जल प्रबंधन, जड़ संबंधी समस्या, रोग या कीट। केवल पीलापन देखकर दवा तय नहीं करनी चाहिए।',
        },
        {
          question: 'थ्रिप्स की पहचान कैसे करें?',
          answer:
            'पत्तियों पर सिल्वर/सफेद धारियां, मुड़ती पत्तियां और नई बढ़वार पर नुकसान संभावित संकेत हैं। खेत में प्रत्यक्ष निरीक्षण आवश्यक है।',
        },
        {
          question: 'क्या हर बार पीलापन होने पर फफूंदनाशक देना चाहिए?',
          answer:
            'नहीं। पहले कारण की पहचान करें। पोषण, पानी और जड़ की स्थिति भी जांचें।',
        },
      ],
    },

    galleryImages: [
      {
        url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
        title: 'लहसुन की फसल',
      },
      {
        url: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80',
        title: 'फसल निरीक्षण',
      },
    ],

    youtubeVideoId: 'dQw4w9WgXcQ',

    calculator: {
      enabled: true,

      waterPerAcre: 150,

      recommendations: [
        {
          name: 'उत्पाद 1',
          type: 'कीट प्रबंधन',
          quantity: 100,
          unit: 'ml',
          note: 'उत्पाद के लेबल के अनुसार वास्तविक मात्रा सत्यापित करें।',
        },
        {
          name: 'उत्पाद 2',
          type: 'फफूंद प्रबंधन',
          quantity: 300,
          unit: 'gram',
          note: 'Formulation के अनुसार मात्रा बदल सकती है।',
        },
        {
          name: 'पोषक तत्व',
          type: 'फसल पोषण',
          quantity: 750,
          unit: 'gram',
          note: 'फसल अवस्था और मिट्टी परीक्षण के आधार पर उपयोग करें।',
        },
      ],
    },
  },

  {
    id: '2',
    slug: 'soyabean-harvesting-tips',
    title:
      'सोयाबीन कटाई एवं भण्डारण में नमी नियंत्रण: बेहतर गुणवत्ता कैसे बनाए रखें?',
    category: 'फसल प्रबंधन',
    date: '2026-09-25',
    dateLabel: '25 सितंबर 2026',

    author: 'सुरेश पटेल',
    authorRole: 'उन्नत कृषक',
    authorAvatar: '👨‍🌾',

    readTime: 4,
    views: 8100,
    likes: 512,
    comments: 34,

    hasVideo: false,
    hasGallery: true,
    isFeatured: false,

    coverImage:
      'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1000&q=80',

    excerpt:
      'कटाई, सफाई और भंडारण के दौरान नमी एवं गुणवत्ता का ध्यान रखने से उपज की गुणवत्ता बेहतर रखी जा सकती है।',

    tags: ['सोयाबीन', 'भंडारण', 'कटाई', 'मंडी'],

    content: {
      introduction:
        'सोयाबीन की गुणवत्ता केवल उत्पादन पर निर्भर नहीं करती। कटाई के बाद सफाई, सुखाने और भंडारण की प्रक्रिया भी महत्वपूर्ण है।',

      sections: [
        {
          id: 'harvesting',
          title: 'कटाई का सही समय',
          paragraphs: [
            'कटाई से पहले फसल की परिपक्वता और मौसम की स्थिति देखें। अत्यधिक नमी में कटाई करने से भंडारण संबंधी समस्या बढ़ सकती है।',
          ],
          bullets: [
            'फसल की परिपक्वता जांचें',
            'बारिश की संभावना देखें',
            'कटाई के बाद उचित सुखाने की व्यवस्था रखें',
          ],
        },
        {
          id: 'storage',
          title: 'भंडारण के दौरान ध्यान रखें',
          paragraphs: [
            'भंडारण स्थान साफ, सूखा और हवा का उचित आवागमन वाला होना चाहिए।',
          ],
          bullets: [
            'अनाज को साफ करें',
            'नमी की नियमित जांच करें',
            'भंडारण स्थान में पानी का रिसाव न हो',
          ],
        },
      ],

      safetyNote:
        'भंडारण में अनाज की गुणवत्ता और नमी के लिए स्थानीय मंडी/कृषि विशेषज्ञ की सलाह को प्राथमिकता दें।',

      faqs: [
        {
          question: 'सोयाबीन को भंडारण से पहले क्या करना चाहिए?',
          answer:
            'सफाई, उचित सुखाने और नमी की जांच के बाद ही भंडारण करना बेहतर है।',
        },
      ],
    },

    galleryImages: [],

    calculator: {
      enabled: false,
    },
  },

  {
    id: '3',
    slug: 'organic-jeevamrut-production',
    title:
      'कम लागत में जीवामृत: सामग्री, प्रक्रिया और खेत में उपयोग की पूरी जानकारी',
    category: 'जैविक खेती',
    date: '2026-09-20',
    dateLabel: '20 सितंबर 2026',

    author: 'राकेश धाकड़',
    authorRole: 'जैविक खेती विशेषज्ञ',
    authorAvatar: '👨‍🌾',

    readTime: 5,
    views: 15300,
    likes: 1205,
    comments: 145,

    hasVideo: true,
    hasGallery: false,
    isFeatured: false,

    coverImage:
      'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=1000&q=80',

    excerpt:
      'प्राकृतिक खेती में उपयोग होने वाले जैविक inputs को समझें और उनके उपयोग से पहले आवश्यक सावधानियां जानें।',

    tags: ['जैविक खाद', 'जीवामृत', 'प्राकृतिक खेती'],

    content: {
      introduction:
        'जीवामृत जैसी पारंपरिक जैविक formulations का उपयोग कुछ किसान मिट्टी प्रबंधन के लिए करते हैं। इनके परिणाम खेत, मिट्टी और प्रबंधन के अनुसार अलग हो सकते हैं।',

      sections: [
        {
          id: 'benefits',
          title: 'जैविक input का उद्देश्य',
          paragraphs: [
            'जैविक inputs का उपयोग मिट्टी में जैविक गतिविधि और पोषक प्रबंधन के लिए किया जाता है।',
          ],
          bullets: [
            'मिट्टी की जैविक गतिविधि पर ध्यान',
            'जैविक पदार्थों का उपयोग',
            'रासायनिक inputs के साथ integrated approach',
          ],
        },
      ],

      safetyNote:
        'जैविक formulation को भी सावधानी से तैयार और उपयोग करें। किसी भी दावे को स्थानीय कृषि विशेषज्ञ और खेत के परिणाम के आधार पर सत्यापित करें।',

      faqs: [
        {
          question: 'क्या जैविक input हर खेत में समान परिणाम देता है?',
          answer:
            'नहीं। मिट्टी, फसल, मौसम और प्रबंधन के अनुसार परिणाम अलग हो सकते हैं।',
        },
      ],
    },

    galleryImages: [],

    calculator: {
      enabled: false,
    },
  },

  {
    id: '4',
    slug: 'drone-spraying-technology',
    title:
      'खेती में ड्रोन स्प्रेयर: समय, पानी और रसायनों की बचत को कैसे समझें?',
    category: 'कृषि तकनीक',
    date: '2026-09-15',
    dateLabel: '15 सितंबर 2026',

    author: 'इंजीनियर अजय वर्मा',
    authorRole: 'एग्री-टेक विशेषज्ञ',
    authorAvatar: '👨‍💻',

    readTime: 4,
    views: 6700,
    likes: 380,
    comments: 28,

    hasVideo: true,
    hasGallery: true,
    isFeatured: false,

    coverImage:
      'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1000&q=80',

    excerpt:
      'ड्रोन आधारित spraying में coverage, पानी की मात्रा, मौसम और application quality को समझने की पूरी जानकारी।',

    tags: ['ड्रोन', 'स्मार्ट फार्मिंग', 'तकनीक', 'छिड़काव'],

    content: {
      introduction:
        'कृषि ड्रोन बड़े खेतों में application efficiency सुधारने का एक विकल्प हो सकते हैं। परिणाम drone model, nozzle, weather और operator skill पर निर्भर करते हैं।',

      sections: [
        {
          id: 'technology',
          title: 'कृषि ड्रोन कैसे उपयोग किए जाते हैं?',
          paragraphs: [
            'ड्रोन में tank, pump, nozzles, battery और flight control system होता है। Application से पहले field mapping और weather conditions को देखना महत्वपूर्ण है।',
          ],
          bullets: [
            'हवा की गति जांचें',
            'उचित nozzle selection करें',
            'field boundary और obstacles देखें',
            'operator training आवश्यक है',
          ],
        },
      ],

      safetyNote:
        'ड्रोन संचालन स्थानीय नियमों, trained operator और संबंधित कृषि-input label requirements के अनुसार करें।',

      faqs: [
        {
          question: 'क्या हर pesticide drone से spray किया जा सकता है?',
          answer:
            'नहीं। संबंधित product label और स्थानीय regulatory guidance की जांच आवश्यक है।',
        },
      ],
    },

    galleryImages: [
      {
        url: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80',
        title: 'कृषि ड्रोन',
      },
    ],

    calculator: {
      enabled: false,
    },
  },
];

export function getBlogBySlug(slug) {
  return blogsData.find((blog) => blog.slug === slug);
}

export function getRelatedBlogs(currentBlog, limit = 3) {
  if (!currentBlog) return [];

  return blogsData
    .filter(
      (blog) =>
        blog.slug !== currentBlog.slug &&
        blog.category === currentBlog.category
    )
    .slice(0, limit);
}