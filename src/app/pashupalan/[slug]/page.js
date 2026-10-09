
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookOpen,
  Calculator,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  Copy,
  Heart,
  IndianRupee,
  Lightbulb,
  List,
  Milk,
  Minus,
  Plus,
  Share2,
  ShieldCheck,
  Sprout,
  TrendingUp,
  Wallet,
  Wheat,
} from "lucide-react";

const articles = {
  "gay-bhains-palan": {
    title: "गाय-भैंस पालन कैसे शुरू करें? पूरी जानकारी",
    subtitle:
      "डेयरी व्यवसाय शुरू करने से पहले नस्ल, शेड, चारा, स्वास्थ्य, दूध की बिक्री और खर्च की जानकारी समझें।",
    category: "डेयरी फार्मिंग",
    readTime: "12 मिनट",
    image:
      "https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=1400&q=85",
    updated: "अक्टूबर 2026",
    intro:
      "गाय-भैंस पालन ग्रामीण परिवारों के लिए एक संभावित आय का साधन हो सकता है। सफलता पशु की सेहत, दूध उत्पादन, चारे की उपलब्धता, बाजार और लागत नियंत्रण पर निर्भर करती है। शुरुआत अपनी क्षमता और स्थानीय बाजार को समझकर करें।",
    facts: [
      ["शुरुआत", "छोटे स्तर से"],
      ["मुख्य खर्च", "पशु, शेड, चारा"],
      ["कमाई", "दूध और संबंधित उत्पाद"],
      ["जरूरी बात", "पशु स्वास्थ्य और बाजार"],
    ],
    sections: [
      {
        id: "planning",
        title: "1. डेयरी व्यवसाय की योजना",
        content:
          "सबसे पहले अपने क्षेत्र में दूध की मांग, खरीदने वाले डेयरी केंद्र, भुगतान की शर्तें और दूध का संभावित भाव पता करें। पानी, बिजली, पशु चिकित्सक और चारे की उपलब्धता भी देखें। शुरुआत में उतने ही पशु रखें जिनकी रोजाना देखभाल कर सकें।",
        points: [
          "स्थानीय दूध खरीदार और भुगतान चक्र पता करें।",
          "दैनिक चारा, पानी और सफाई का इंतजाम करें।",
          "पशु खरीदने से पहले पशु चिकित्सक से जांच कराएं।",
        ],
      },
      {
        id: "shed",
        title: "2. पशु शेड और सफाई",
        content:
          "शेड हवादार, सुरक्षित, सूखा और आसानी से साफ होने वाला होना चाहिए। बारिश का पानी जमा न हो तथा गोबर और गंदे पानी की निकासी की व्यवस्था रहे। जगह की आवश्यकता पशु के आकार और स्थानीय पशुपालन सलाह के अनुसार तय करें।",
        points: [
          "फिसलन रहित फर्श और उचित ढलान रखें।",
          "साफ पानी हर समय उपलब्ध रखें।",
          "गर्मी, ठंड और बारिश से बचाव करें।",
        ],
      },
      {
        id: "animal",
        title: "3. सही पशु का चुनाव",
        content:
          "पशु चुनते समय केवल नस्ल या दिखाई देने वाले आकार पर भरोसा न करें। उसकी उम्र, स्वास्थ्य, दूध का वास्तविक रिकॉर्ड, ब्याने का इतिहास और उपलब्ध चारे के अनुसार अनुकूलता जांचें। खरीद का निर्णय अनुभवी व्यक्ति और पशु चिकित्सक की मदद से लें।",
        points: [
          "दूध उत्पादन का सत्यापन करें।",
          "टीकाकरण और बीमारी का इतिहास पूछें।",
          "खरीद, परिवहन और शुरुआती देखभाल का बजट रखें।",
        ],
      },
      {
        id: "feed",
        title: "4. चारा और पोषण प्रबंधन",
        content:
          "दूध देने वाले पशुओं के लिए हरा चारा, सूखा चारा, संतुलित पशु आहार और मिनरल मिश्रण का चुनाव उनकी जरूरत के अनुसार होना चाहिए। आहार की मात्रा पशु के वजन, दूध उत्पादन, गर्भावस्था और स्वास्थ्य पर निर्भर करती है। स्थानीय पशु विशेषज्ञ से राशन तय करवाएं।",
        points: [
          "चारे में अचानक बड़ा बदलाव न करें।",
          "फफूंद लगा या खराब चारा न खिलाएं।",
          "स्वच्छ पानी और नियमित भोजन व्यवस्था रखें।",
        ],
      },
      {
        id: "health",
        title: "5. स्वास्थ्य और टीकाकरण",
        content:
          "पशुओं की नियमित निगरानी करें। भूख कम होना, बुखार, दूध अचानक घट जाना, लंगड़ापन या असामान्य व्यवहार दिखे तो पशु चिकित्सक से संपर्क करें। टीकाकरण, कृमिनाशक और प्रजनन संबंधी सलाह स्थानीय पशु चिकित्सा विभाग से लें।",
        points: [
          "नए पशु को कुछ समय अलग रखकर जांच कराएं।",
          "बीमार पशु को जरूरत के अनुसार अलग रखें।",
          "इलाज और टीकाकरण का रिकॉर्ड रखें।",
        ],
      },
      {
        id: "income",
        title: "6. दूध की आय और खर्च",
        content:
          "आय का अनुमान निकालते समय रोजाना बिकने वाला दूध और वास्तविक बिक्री भाव लें। खर्च में चारा, पशु आहार, मजदूरी, दवा, बिजली, परिवहन, रखरखाव और पशु खरीदने की लागत शामिल करें। नीचे दिया कैलकुलेटर केवल अनुमान बनाने में मदद करता है।",
        points: [
          "बिकने वाले दूध की मात्रा ही दर्ज करें।",
          "दैनिक और मासिक खर्च लिखें।",
          "कम दूध या बीमारी वाले समय के लिए रिजर्व रखें।",
        ],
      },
    ],
    faqs: [
      {
        q: "क्या एक या दो पशुओं से डेयरी शुरू कर सकते हैं?",
        a: "हाँ, छोटे स्तर से शुरुआत संभव है। पहले चारे, देखभाल, दूध के खरीदार और कुल लागत की योजना बनाएं।",
      },
      {
        q: "डेयरी में मुनाफा कितना होता है?",
        a: "मुनाफा दूध की बिक्री, उत्पादन, पशु की कीमत, चारा, स्वास्थ्य और अन्य खर्चों पर निर्भर करता है। निश्चित मुनाफे की गारंटी नहीं होती।",
      },
      {
        q: "पशु खरीदने से पहले क्या देखना चाहिए?",
        a: "स्वास्थ्य, उम्र, दूध रिकॉर्ड, ब्याने का इतिहास और टीकाकरण की जानकारी जांचें। पशु चिकित्सक की मदद लेना बेहतर है।",
      },
      {
        q: "सरकारी योजना की जानकारी कहां मिलेगी?",
        a: "जिले के पशुपालन विभाग, संबंधित सरकारी कार्यालय और आधिकारिक सरकारी पोर्टल पर वर्तमान पात्रता व आवेदन प्रक्रिया जांचें।",
      },
    ],
  },

  "bakri-palan": {
    title: "बकरी पालन व्यवसाय: शुरुआत से बिक्री तक",
    subtitle:
      "बकरी की नस्ल, शेड, आहार, स्वास्थ्य और बाजार की योजना बनाकर व्यवसाय की तैयारी करें।",
    category: "बकरी पालन",
    readTime: "10 मिनट",
    image:
      "https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&w=1400&q=85",
    updated: "अक्टूबर 2026",
    intro:
      "बकरी पालन में स्थानीय जलवायु, चारे, पशु स्वास्थ्य और खरीदारों की मांग का बड़ा महत्व है। पशुओं की संख्या बढ़ाने से पहले प्रबंधन और बाजार की व्यवस्था समझना जरूरी है।",
    facts: [
      ["शुरुआत", "सीमित पशुओं से"],
      ["मुख्य खर्च", "पशु, शेड, आहार"],
      ["बाजार", "स्थानीय खरीदार"],
      ["जरूरी बात", "स्वास्थ्य और प्रजनन"],
    ],
    sections: [
      {
        id: "planning",
        title: "1. बकरी पालन की योजना",
        content:
          "स्थानीय बाजार में बकरी और बकरे की मांग, बिक्री के मौसम और वजन के आधार पर खरीद की व्यवस्था समझें। अपने पास उपलब्ध जमीन, चारा और दैनिक देखभाल के समय के अनुसार संख्या तय करें।",
        points: [
          "स्थानीय खरीदारों से बाजार की जानकारी लें।",
          "शुरुआत में छोटा और संभालने योग्य झुंड रखें।",
          "आपातकालीन पशु चिकित्सा खर्च के लिए बजट रखें।",
        ],
      },
      {
        id: "shed",
        title: "2. शेड और जगह",
        content:
          "बकरियों को सूखी, हवादार और सुरक्षित जगह चाहिए। बारिश का पानी, गीलापन, भीड़ और गंदगी बीमारी का जोखिम बढ़ा सकते हैं। शेड का आकार पशुओं की संख्या और स्थानीय सलाह के अनुसार तय करें।",
        points: [
          "सूखा बिछावन और नियमित सफाई रखें।",
          "बच्चों और बीमार पशुओं के लिए अलग व्यवस्था रखें।",
          "सुरक्षित बाड़ और साफ पानी उपलब्ध रखें।",
        ],
      },
      {
        id: "breed",
        title: "3. नस्ल और पशु चयन",
        content:
          "नस्ल का चुनाव स्थानीय मौसम, उपलब्ध चारा और व्यवसाय के उद्देश्य के अनुसार करें। केवल बड़े आकार या सुनी-सुनाई कीमत के आधार पर खरीदारी न करें। स्वस्थ पशु और विश्वसनीय स्रोत को प्राथमिकता दें।",
        points: [
          "स्वास्थ्य और उम्र की जांच कराएं।",
          "टीकाकरण और बीमारी का इतिहास पूछें।",
          "स्थानीय परिस्थितियों में अनुकूल पशु चुनें।",
        ],
      },
      {
        id: "feed",
        title: "4. चारा और पानी",
        content:
          "बकरियों के लिए उपयुक्त हरा चारा, पत्तियां, सूखा चारा और जरूरत के अनुसार संतुलित पूरक आहार दें। आहार उम्र, गर्भावस्था, वजन और उत्पादन के अनुसार बदलता है।",
        points: [
          "खराब या फफूंद लगा चारा न दें।",
          "साफ पानी नियमित उपलब्ध रखें।",
          "आहार में बदलाव धीरे-धीरे करें।",
        ],
      },
      {
        id: "health",
        title: "5. स्वास्थ्य देखभाल",
        content:
          "नियमित निरीक्षण, स्वच्छता और पशु चिकित्सक द्वारा सुझाया गया टीकाकरण जरूरी है। बीमारी के लक्षण दिखने पर देरी न करें और खुद से दवाइयों की खुराक तय न करें।",
        points: [
          "नए पशुओं की जांच कराएं।",
          "बीमार पशुओं को अलग रखें।",
          "इलाज और टीकाकरण का रिकॉर्ड रखें।",
        ],
      },
      {
        id: "income",
        title: "6. लागत और बिक्री",
        content:
          "पशु खरीद, शेड, चारा, दवा, मजदूरी और परिवहन को लागत में जोड़ें। बिक्री की आय का अनुमान वास्तविक वजन और स्थानीय खरीदारों के भाव से लगाएं। कीमतों और मुनाफे में बदलाव संभव है।",
        points: [
          "खरीद और बिक्री का रिकॉर्ड बनाएं।",
          "स्थानीय बाजार में मांग पहले समझें।",
          "सभी नियमित खर्चों को शामिल करें।",
        ],
      },
    ],
    faqs: [
      {
        q: "क्या कम जगह में बकरी पालन संभव है?",
        a: "सीमित संख्या से शुरुआत संभव है, लेकिन सूखी जगह, साफ पानी, उचित चारा और पशु कल्याण की जरूरतें पूरी करनी होंगी।",
      },
      {
        q: "बकरी पालन में कमाई कैसे होती है?",
        a: "आय पशुओं की बिक्री, प्रजनन और कुछ परिस्थितियों में दूध जैसे उत्पादों से हो सकती है। वास्तविक परिणाम बाजार और खर्च पर निर्भर करते हैं।",
      },
      {
        q: "बकरी खरीदते समय क्या जांचें?",
        a: "स्वास्थ्य, उम्र, शरीर की स्थिति और उपलब्ध टीकाकरण रिकॉर्ड जांचें। पशु चिकित्सक की सलाह लें।",
      },
    ],
  },

  "murgi-palan": {
    title: "मुर्गी पालन कैसे शुरू करें? शुरुआती गाइड",
    subtitle:
      "पोल्ट्री शेड, चूजों की देखभाल, आहार, स्वच्छता, बाजार और लागत का व्यावहारिक परिचय।",
    category: "मुर्गी पालन",
    readTime: "9 मिनट",
    image:
      "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=1400&q=85",
    updated: "अक्टूबर 2026",
    intro:
      "मुर्गी पालन शुरू करने से पहले यह तय करें कि आप अंडा उत्पादन करेंगे या मांस के लिए ब्रॉयलर पालन। दोनों में नस्ल, समय, आहार, बाजार और प्रबंधन की जरूरतें अलग होती हैं।",
    facts: [
      ["शुरुआत", "छोटे बैच से"],
      ["मुख्य खर्च", "चूजे, आहार, शेड"],
      ["बाजार", "अंडे या पोल्ट्री"],
      ["जरूरी बात", "जैव सुरक्षा"],
    ],
    sections: [
      {
        id: "planning",
        title: "1. सही मॉडल चुनें",
        content:
          "अंडा उत्पादन और ब्रॉयलर पालन के लिए अलग-अलग योजना बनाएं। स्थानीय दुकानदारों, अंडा विक्रेताओं और पोल्ट्री खरीदारों से मांग तथा भुगतान की जानकारी लें।",
        points: [
          "बाजार और बिक्री का रास्ता पहले तय करें।",
          "आहार और बिजली की लागत समझें।",
          "अनुभवी पोल्ट्री विशेषज्ञ से मार्गदर्शन लें।",
        ],
      },
      {
        id: "shed",
        title: "2. शेड और तापमान",
        content:
          "शेड में वेंटिलेशन, सफाई, सुरक्षित पानी और उचित तापमान की व्यवस्था होनी चाहिए। चूजों को शुरुआती समय में विशेष देखभाल की जरूरत होती है।",
        points: [
          "भीड़ और नमी से बचाव करें।",
          "पानी और फीडर साफ रखें।",
          "स्थानीय विशेषज्ञ के अनुसार तापमान प्रबंधन करें।",
        ],
      },
      {
        id: "chicks",
        title: "3. चूजों का चयन",
        content:
          "विश्वसनीय हैचरी या सप्लायर से स्वस्थ चूजे लें। चूजों की गुणवत्ता, टीकाकरण की जानकारी और परिवहन व्यवस्था की पुष्टि करें।",
        points: [
          "खरीद का रिकॉर्ड सुरक्षित रखें।",
          "कमजोर या बीमार चूजों पर नजर रखें।",
          "प्रजाति के अनुरूप देखभाल करें।",
        ],
      },
      {
        id: "feed",
        title: "4. फीड और पानी",
        content:
          "मुर्गियों को उनकी उम्र और उद्देश्य के अनुरूप संतुलित फीड देना जरूरी है। साफ पानी लगातार उपलब्ध रहे और फीड को नमी तथा कीटों से सुरक्षित रखें।",
        points: [
          "उम्र के अनुसार फीड का चुनाव करें।",
          "फीड में अचानक बदलाव से बचें।",
          "पानी के बर्तनों की नियमित सफाई करें।",
        ],
      },
      {
        id: "health",
        title: "5. जैव सुरक्षा और स्वास्थ्य",
        content:
          "पोल्ट्री में बीमारी तेजी से फैल सकती है। बाहरी लोगों की आवाजाही नियंत्रित रखें, उपकरण साफ करें और टीकाकरण कार्यक्रम विशेषज्ञ से बनवाएं।",
        points: [
          "नए पक्षियों की व्यवस्था अलग रखें।",
          "असामान्य मृत्यु या बीमारी पर तुरंत सलाह लें।",
          "स्थानीय पशु चिकित्सा विभाग के निर्देश मानें।",
        ],
      },
      {
        id: "income",
        title: "6. लागत और बिक्री",
        content:
          "चूजों, फीड, बिजली, दवा, श्रम, परिवहन और शेड की लागत जोड़ें। बिक्री के लिए स्थानीय खरीदार और भुगतान की शर्तें पहले तय करें। बाजार दर बदलने से लाभ भी बदल सकता है।",
        points: [
          "प्रति बैच की लागत दर्ज करें।",
          "मृत्यु दर और बिक्री योग्य उत्पादन का हिसाब रखें।",
          "बाजार की मांग देखकर बैच का आकार तय करें।",
        ],
      },
    ],
    faqs: [
      {
        q: "मुर्गी पालन के कौन से प्रकार हैं?",
        a: "प्रमुख विकल्पों में अंडा उत्पादन, ब्रॉयलर और स्थानीय परिस्थितियों के अनुसार देशी मुर्गी पालन शामिल हैं।",
      },
      {
        q: "क्या मुर्गी पालन में निश्चित मुनाफा होता है?",
        a: "नहीं। फीड की कीमत, बीमारी, उत्पादन, बाजार भाव और बिक्री की व्यवस्था से परिणाम बदलते हैं।",
      },
      {
        q: "टीकाकरण कैसे तय करें?",
        a: "चूजों के स्रोत और स्थानीय रोग जोखिम के आधार पर पशु चिकित्सक से टीकाकरण कार्यक्रम बनवाएं।",
      },
    ],
  },
};

const defaultSections = [
  {
    id: "planning",
    title: "1. व्यवसाय की योजना",
    content:
      "शुरू करने से पहले स्थानीय मांग, उपलब्ध जगह, दैनिक देखभाल, जरूरी संसाधन और बिक्री के विकल्प समझें। छोटे स्तर से शुरुआत कर अनुभव के अनुसार विस्तार करें।",
    points: [
      "बाजार और खरीदारों की जानकारी लें।",
      "शुरुआती और नियमित खर्चों का बजट बनाएं।",
      "स्थानीय विशेषज्ञ से सलाह लें।",
    ],
  },
  {
    id: "setup",
    title: "2. जगह और जरूरी संसाधन",
    content:
      "स्वच्छता, सुरक्षा, पानी, उचित वेंटिलेशन और मौसम से बचाव का इंतजाम करें। वास्तविक जरूरतों के अनुसार जगह और संसाधन तय करें।",
    points: [
      "नियमित सफाई की व्यवस्था रखें।",
      "पानी और जरूरी संसाधन उपलब्ध रखें।",
      "बीमारी से बचाव की योजना बनाएं।",
    ],
  },
  {
    id: "feed",
    title: "3. आहार और देखभाल",
    content:
      "आहार और देखभाल का तरीका पशु या पक्षी की उम्र, स्वास्थ्य और उत्पादन के उद्देश्य के अनुसार बदलता है। उचित पोषण के लिए स्थानीय विशेषज्ञ की सलाह लें।",
    points: [
      "साफ पानी उपलब्ध रखें।",
      "खराब या फफूंद लगा आहार न दें।",
      "नियमित निरीक्षण करें।",
    ],
  },
  {
    id: "health",
    title: "4. स्वास्थ्य प्रबंधन",
    content:
      "बीमारी के लक्षणों को नजरअंदाज न करें। टीकाकरण, उपचार और रोकथाम की योजना पशु चिकित्सक या संबंधित विशेषज्ञ से बनवाएं।",
    points: [
      "स्वास्थ्य रिकॉर्ड बनाएं।",
      "बीमार पशु या पक्षी के लिए उचित अलग व्यवस्था करें।",
      "समय पर विशेषज्ञ से संपर्क करें।",
    ],
  },
  {
    id: "income",
    title: "5. लागत और आय का अनुमान",
    content:
      "संभावित आय से सभी खर्च घटाकर अनुमान बनाएं। बाजार भाव, उत्पादन, बीमारी और अन्य खर्चों के कारण वास्तविक परिणाम अनुमान से अलग हो सकते हैं।",
    points: [
      "सभी शुरुआती खर्च जोड़ें।",
      "दैनिक और मासिक खर्च लिखें।",
      "आपातकालीन खर्च के लिए राशि रखें।",
    ],
  },
];

const defaultFaqs = [
  {
    q: "शुरुआत करने से पहले क्या तैयारी करें?",
    a: "स्थानीय मांग, उपलब्ध संसाधन, लागत, बिक्री का रास्ता और विशेषज्ञ सलाह को समझकर योजना बनाएं।",
  },
  {
    q: "इस व्यवसाय में कितना मुनाफा होगा?",
    a: "मुनाफा स्थानीय बाजार, उत्पादन, खर्च और प्रबंधन पर निर्भर करता है। कोई निश्चित आय की गारंटी नहीं है।",
  },
  {
    q: "सरकारी सहायता कैसे पता करें?",
    a: "जिला स्तर के संबंधित विभाग और आधिकारिक सरकारी पोर्टल से वर्तमान योजना, पात्रता और आवेदन की पुष्टि करें।",
  },
];

function InfoCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-green-100 bg-white p-4 shadow-sm">
      <div className="mb-3 inline-flex rounded-xl bg-green-50 p-2 text-green-700">
        <Icon size={20} />
      </div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 font-bold text-gray-900">{value}</p>
    </div>
  );
}

export default function PashupalanArticlePage() {
  const params = useParams();
  const slug = params?.slug;
  const article = articles[slug] || {
    title: "पशुपालन की पूरी जानकारी",
    subtitle:
      "पशुपालन व्यवसाय की योजना, देखभाल, लागत और बाजार को समझने के लिए शुरुआती गाइड।",
    category: "पशुपालन",
    readTime: "8 मिनट",
    image:
      "https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=1400&q=85",
    updated: "अक्टूबर 2026",
    intro:
      "पशुपालन से जुड़े किसी भी व्यवसाय में सही योजना, पशु स्वास्थ्य, पोषण और बाजार की जानकारी महत्वपूर्ण है। स्थानीय जरूरतों के अनुसार कदम उठाएं।",
    facts: [
      ["शुरुआत", "योजना के साथ"],
      ["मुख्य खर्च", "संसाधन और आहार"],
      ["बाजार", "स्थानीय मांग"],
      ["जरूरी बात", "स्वास्थ्य और प्रबंधन"],
    ],
    sections: defaultSections,
    faqs: defaultFaqs,
  };

  const sections = article.sections || defaultSections;
  const faqs = article.faqs || defaultFaqs;

  const [openFaq, setOpenFaq] = useState(0);
  const [tocOpen, setTocOpen] = useState(true);
  const [saved, setSaved] = useState(false);
  const [animalCount, setAnimalCount] = useState(2);
  const [dailyMilk, setDailyMilk] = useState(8);
  const [milkPrice, setMilkPrice] = useState(50);
  const [monthlyCost, setMonthlyCost] = useState(12000);
  const [copied, setCopied] = useState(false);

  const estimate = useMemo(() => {
    const revenue = animalCount * dailyMilk * milkPrice * 30;
    const profit = revenue - monthlyCost;

    return {
      revenue,
      profit,
      yearly: profit * 12,
    };
  }, [animalCount, dailyMilk, milkPrice, monthlyCost]);

  const money = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number.isFinite(amount) ? amount : 0);

  async function shareArticle() {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.subtitle,
          url,
        });
      } catch {
        // User may close the share sheet.
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("इस लिंक को कॉपी करें:", url);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7faf7] text-gray-800">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-green-700">
            होम
          </Link>
          <ChevronRight size={15} />
          <Link href="/pashupalan" className="hover:text-green-700">
            पशुपालन
          </Link>
          <ChevronRight size={15} />
          <span className="font-medium text-green-800">
            {article.category}
          </span>
        </div>
      </div>

      {/* Hero */}
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8 lg:py-14">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-semibold text-green-800">
            <Sprout size={16} />
            {article.category}
          </span>

          <h1 className="mt-5 text-3xl font-black leading-tight tracking-tight text-gray-950 sm:text-4xl lg:text-5xl">
            {article.title}
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-gray-600 sm:text-lg">
            {article.subtitle}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <Clock3 size={17} />
              {article.readTime} पढ़ने का समय
            </span>
            <span>•</span>
            <span>अपडेट: {article.updated}</span>
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="#article-content"
              className="inline-flex items-center gap-2 rounded-xl bg-green-700 px-5 py-3 font-bold text-white shadow-sm transition hover:bg-green-800"
            >
              जानकारी पढ़ें <ArrowRight size={18} />
            </a>

            <button
              onClick={shareArticle}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 font-semibold transition hover:border-green-300 hover:text-green-800"
            >
              <Share2 size={18} />
              {copied ? "लिंक कॉपी हो गया" : "शेयर करें"}
            </button>

            <button
              onClick={() => setSaved(!saved)}
              aria-pressed={saved}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-3 font-semibold transition ${
                saved
                  ? "border-green-300 bg-green-50 text-green-800"
                  : "border-gray-200 bg-white hover:border-green-300"
              }`}
            >
              <Bookmark size={18} fill={saved ? "currentColor" : "none"} />
              {saved ? "सेव किया" : "सेव करें"}
            </button>
          </div>

          {saved && (
            <p className="mt-3 text-sm text-green-700">
              यह चयन अभी इसी पेज की स्थिति में सेव है। स्थायी बुकमार्क के लिए
              ब्राउज़र का Bookmark विकल्प इस्तेमाल करें।
            </p>
          )}
        </div>

        <div className="relative">
          <img
            src={article.image}
            alt={article.title}
            className="h-[300px] w-full rounded-3xl object-cover shadow-lg sm:h-[420px]"
          />
          <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/50 bg-white/95 p-4 shadow-lg backdrop-blur">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-green-100 p-3 text-green-800">
                <Lightbulb size={22} />
              </div>
              <div>
                <p className="font-bold text-gray-900">शुरुआती सलाह</p>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  निवेश से पहले स्थानीय बाजार, वास्तविक लागत और विशेषज्ञ की
                  सलाह जरूर जांचें।
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick facts */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {article.facts.map((fact, index) => {
            const icons = [Sprout, Wallet, TrendingUp, ShieldCheck];
            const Icon = icons[index % icons.length];

            return (
              <InfoCard
                key={fact[0]}
                icon={Icon}
                label={fact[0]}
                value={fact[1]}
              />
            );
          })}
        </div>
      </section>

      {/* Article and sidebar */}
      <section
        id="article-content"
        className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8"
      >
        <article className="min-w-0">
          {/* Intro */}
          <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm sm:p-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-xl bg-green-100 p-3 text-green-800">
                <BookOpen size={23} />
              </div>
              <h2 className="text-xl font-extrabold text-gray-950">
                इस लेख में क्या जानेंगे?
              </h2>
            </div>
            <p className="text-base leading-8 text-gray-600">{article.intro}</p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                "शुरुआत और सही योजना",
                "जगह, चारा और देखभाल",
                "स्वास्थ्य और सुरक्षा",
                "लागत, आय और बाजार",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm">
                  <CheckCircle2
                    size={18}
                    className="shrink-0 text-green-700"
                  />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Interactive table of contents */}
          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <button
              onClick={() => setTocOpen(!tocOpen)}
              aria-expanded={tocOpen}
              className="flex w-full items-center justify-between gap-4 text-left"
            >
              <span className="flex items-center gap-3 text-lg font-extrabold text-gray-950">
                <List size={22} className="text-green-700" />
                विषय सूची
              </span>
              <ChevronDown
                className={`transition-transform ${
                  tocOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {tocOpen && (
              <nav className="mt-4 space-y-1">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium text-gray-600 transition hover:bg-green-50 hover:text-green-800"
                  >
                    {section.title}
                    <ChevronRight size={16} />
                  </a>
                ))}
                <a
                  href="#income-calculator"
                  className="flex items-center justify-between rounded-xl bg-green-50 px-3 py-3 text-sm font-bold text-green-800 hover:bg-green-100"
                >
                  आय का अनुमान कैलकुलेटर
                  <Calculator size={17} />
                </a>
                <a
                  href="#faq"
                  className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium text-gray-600 hover:bg-green-50 hover:text-green-800"
                >
                  सामान्य सवाल
                  <ChevronRight size={16} />
                </a>
              </nav>
            )}
          </div>

          {/* Detailed sections */}
          <div className="mt-8 space-y-6">
            {sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-24 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8"
              >
                <h2 className="text-xl font-extrabold leading-snug text-gray-950 sm:text-2xl">
                  {section.title}
                </h2>

                <p className="mt-4 text-base leading-8 text-gray-600">
                  {section.content}
                </p>

                <div className="mt-5 rounded-xl bg-green-50 p-4 sm:p-5">
                  <p className="mb-3 flex items-center gap-2 font-bold text-green-900">
                    <CheckCircle2 size={19} />
                    ध्यान रखने योग्य बातें
                  </p>
                  <ul className="space-y-3">
                    {section.points.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-3 text-sm leading-7 text-gray-700"
                      >
                        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-green-600" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            ))}
          </div>

          {/* Interactive income calculator */}
          <section
            id="income-calculator"
            className="mt-8 scroll-mt-24 overflow-hidden rounded-3xl border border-green-200 bg-white shadow-sm"
          >
            <div className="bg-green-800 p-6 text-white sm:p-8">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-white/15 p-3">
                  <Calculator size={26} />
                </div>
                <div>
                  <h2 className="text-2xl font-black">
                    आय का अनुमान कैलकुलेटर
                  </h2>
                  <p className="mt-1 text-sm text-green-100">
                    अपनी जानकारी बदलें और अनुमान देखें।
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-7 p-5 sm:p-8 lg:grid-cols-2">
              <div className="space-y-6">
                <div>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <label
                      htmlFor="animalCount"
                      className="font-semibold text-gray-800"
                    >
                      पशुओं की संख्या
                    </label>
                    <span className="rounded-lg bg-green-50 px-3 py-1 font-bold text-green-800">
                      {animalCount}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        setAnimalCount((value) => Math.max(1, value - 1))
                      }
                      aria-label="पशुओं की संख्या कम करें"
                      className="rounded-lg border p-2 hover:bg-gray-50"
                    >
                      <Minus size={18} />
                    </button>
                    <input
                      id="animalCount"
                      type="range"
                      min="1"
                      max="50"
                      value={animalCount}
                      onChange={(event) =>
                        setAnimalCount(Number(event.target.value))
                      }
                      className="w-full accent-green-700"
                    />
                    <button
                      onClick={() =>
                        setAnimalCount((value) => Math.min(50, value + 1))
                      }
                      aria-label="पशुओं की संख्या बढ़ाएं"
                      className="rounded-lg border p-2 hover:bg-gray-50"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="dailyMilk"
                    className="mb-2 block font-semibold text-gray-800"
                  >
                    प्रति पशु प्रतिदिन बिकने वाला दूध (लीटर)
                  </label>
                  <input
                    id="dailyMilk"
                    type="number"
                    min="0"
                    max="100"
                    value={dailyMilk}
                    onChange={(event) =>
                      setDailyMilk(
                        Math.max(
                          0,
                          Math.min(100, Number(event.target.value) || 0)
                        )
                      )
                    }
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="milkPrice"
                    className="mb-2 block font-semibold text-gray-800"
                  >
                    दूध का बिक्री भाव (₹ प्रति लीटर)
                  </label>
                  <input
                    id="milkPrice"
                    type="number"
                    min="0"
                    max="500"
                    value={milkPrice}
                    onChange={(event) =>
                      setMilkPrice(
                        Math.max(
                          0,
                          Math.min(500, Number(event.target.value) || 0)
                        )
                      )
                    }
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="monthlyCost"
                    className="mb-2 block font-semibold text-gray-800"
                  >
                    कुल मासिक खर्च (₹)
                  </label>
                  <input
                    id="monthlyCost"
                    type="number"
                    min="0"
                    max="100000000"
                    value={monthlyCost}
                    onChange={(event) =>
                      setMonthlyCost(
                        Math.max(
                          0,
                          Math.min(
                            100000000,
                            Number(event.target.value) || 0
                          )
                        )
                      )
                    }
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  />
                  <p className="mt-2 text-xs leading-5 text-gray-500">
                    चारा, मजदूरी, दवा, बिजली, परिवहन और अन्य खर्च जोड़ें।
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-gray-50 p-5 sm:p-6">
                <p className="font-bold text-gray-700">आपका अनुमान</p>

                <div className="mt-4 rounded-xl border border-green-100 bg-white p-4">
                  <p className="text-sm text-gray-500">
                    अनुमानित मासिक बिक्री
                  </p>
                  <p className="mt-2 text-2xl font-black text-gray-950">
                    {money(estimate.revenue)}
                  </p>
                </div>

                <div className="mt-3 rounded-xl border border-green-100 bg-white p-4">
                  <p className="text-sm text-gray-500">
                    अनुमानित मासिक बचत / घाटा
                  </p>
                  <p
                    className={`mt-2 text-2xl font-black ${
                      estimate.profit >= 0
                        ? "text-green-700"
                        : "text-red-600"
                    }`}
                  >
                    {money(estimate.profit)}
                  </p>
                </div>

                <div className="mt-3 rounded-xl border border-green-100 bg-white p-4">
                  <p className="text-sm text-gray-500">
                    12 महीने का सरल अनुमान
                  </p>
                  <p
                    className={`mt-2 text-xl font-black ${
                      estimate.yearly >= 0
                        ? "text-green-700"
                        : "text-red-600"
                    }`}
                  >
                    {money(estimate.yearly)}
                  </p>
                </div>

                <div className="mt-5 flex items-start gap-3 rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                  <Lightbulb className="mt-0.5 shrink-0" size={19} />
                  <p>
                    यह केवल गणितीय अनुमान है, वास्तविक लाभ नहीं। इसमें दूध
                    उत्पादन में बदलाव, सूखा काल, पशु खरीद की लागत, ब्याज,
                    बीमारी और अन्य अप्रत्याशित खर्च शामिल नहीं हैं, जब तक आप
                    उन्हें मासिक खर्च में न जोड़ें।
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Helpful tips */}
          <section className="mt-8 rounded-2xl border border-amber-100 bg-amber-50 p-5 sm:p-7">
            <h2 className="flex items-center gap-2 text-xl font-extrabold text-gray-950">
              <ShieldCheck className="text-amber-700" />
              जरूरी सावधानियां
            </h2>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-gray-700">
              <li>
                • पशु खरीदने या बड़ा निवेश करने से पहले विशेषज्ञ की सलाह लें।
              </li>
              <li>
                • सरकारी योजना, सब्सिडी या लोन की पात्रता आधिकारिक स्रोत से
                जांचें।
              </li>
              <li>
                • बीमारी के लक्षण दिखने पर पशु चिकित्सक से संपर्क करें।
              </li>
              <li>
                • आय के अनुमान को गारंटी न मानें; स्थानीय बाजार और खर्च बदल
                सकते हैं।
              </li>
            </ul>
          </section>

          {/* FAQs */}
          <section id="faq" className="mt-8 scroll-mt-24">
            <div className="mb-5">
              <p className="text-sm font-bold uppercase tracking-wider text-green-700">
                FAQs
              </p>
              <h2 className="mt-2 text-2xl font-black text-gray-950">
                अक्सर पूछे जाने वाले सवाल
              </h2>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;

                return (
                  <div
                    key={faq.q}
                    className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? -1 : index)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-4 p-5 text-left font-bold text-gray-900 hover:bg-gray-50"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`shrink-0 text-green-700 transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="border-t border-gray-100 px-5 py-4 text-sm leading-7 text-gray-600">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Back */}
          <div className="mt-8">
            <Link
              href="/pashupalan"
              className="inline-flex items-center gap-2 font-bold text-green-800 hover:text-green-950"
            >
              <ArrowLeft size={18} />
              सभी पशुपालन लेख देखें
            </Link>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
            <p className="flex items-center gap-2 font-extrabold text-gray-950">
              <BookOpen size={19} className="text-green-700" />
              इस लेख में
            </p>

            <nav className="mt-4 space-y-1">
              {sections.map((section, index) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="flex items-start gap-3 rounded-lg px-2 py-2 text-sm leading-6 text-gray-600 hover:bg-green-50 hover:text-green-800"
                >
                  <span className="font-bold text-green-700">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {section.title.replace(/^\d+\.\s*/, "")}
                </a>
              ))}
            </nav>
          </div>

          <div className="rounded-2xl bg-green-800 p-6 text-white shadow-sm">
            <div className="mb-4 inline-flex rounded-xl bg-white/15 p-3">
              <Wheat size={25} />
            </div>
            <h3 className="text-xl font-black">
              खेती और पशुपालन की जानकारी
            </h3>
            <p className="mt-3 text-sm leading-7 text-green-100">
              कृषि, पशुपालन और ग्रामीण व्यवसाय से जुड़े दूसरे लेख भी पढ़ें।
            </p>
            <Link
              href="/pashupalan"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 font-bold text-green-900 hover:bg-green-50"
            >
              और लेख पढ़ें <ArrowRight size={17} />
            </Link>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h3 className="font-extrabold text-gray-950">
              उपयोगी बातें
            </h3>
            <div className="mt-4 space-y-4 text-sm leading-6 text-gray-600">
              <p className="flex items-start gap-2">
                <CheckCircle2
                  size={18}
                  className="mt-0.5 shrink-0 text-green-700"
                />
                रोजाना खर्च और बिक्री का रिकॉर्ड रखें।
              </p>
              <p className="flex items-start gap-2">
                <Heart
                  size={18}
                  className="mt-0.5 shrink-0 text-green-700"
                />
                पशु कल्याण और उचित देखभाल को प्राथमिकता दें।
              </p>
              <p className="flex items-start gap-2">
                <Milk
                  size={18}
                  className="mt-0.5 shrink-0 text-green-700"
                />
                बाजार की मांग और वास्तविक उत्पादन के आधार पर योजना बनाएं।
              </p>
            </div>
          </div>
        </aside>
      </section>

      {/* Bottom CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 rounded-3xl border border-green-100 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="text-sm font-bold text-green-700">
              KRISHI MITRA
            </p>
            <h2 className="mt-2 text-2xl font-black text-gray-950">
              अगला लेख भी पढ़ें
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              पशुपालन से जुड़ी और जानकारी के लिए सभी लेख देखें।
            </p>
          </div>
          <Link
            href="/pashupalan"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-green-700 px-6 py-3 font-bold text-white hover:bg-green-800"
          >
            पशुपालन सेक्शन खोलें <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
