'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Calendar, User, ArrowRight, Search, PlayCircle, Image as ImageIcon, 
  ThumbsUp, MessageSquare, BookOpen, Sparkles, Filter, Volume2 
} from 'lucide-react';

const featuredPosts = [
  {
    slug: 'garlic-care-masterclass',
    title: 'लहसुन में पीलापन, थ्रिप्स व कंद आकार बढ़ाने की संपूर्ण गाइड (वीडियो सहित)',
    category: 'फसल सुरक्षा',
    date: '28 सितंबर 2026',
    author: 'डॉ. आर. के. शर्मा (वरिष्ठ कृषि वैज्ञानिक)',
    readTime: '6 मिनट',
    views: '12.4K',
    likes: 840,
    comments: 92,
    hasVideo: true,
    hasGallery: true,
    coverImage: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
    excerpt: 'नीमच व मंदसौर मंडी क्षेत्र के लहसुन उत्पादकों के लिए विशेष रिपोर्ट: जानें मौसम परिवर्तन के दौरान कौन सा फफूंदनाशक और सूक्ष्म पोषक तत्व छिड़कें।',
  }
];

const allBlogs = [
  ...featuredPosts,
  {
    slug: 'soyabean-harvesting-tips',
    title: 'सोयाबीन कटाई एवं भंडारण में नमी नियंत्रण: पाएं अधिकतम मंडी भाव',
    category: 'फसल प्रबंधन',
    date: '25 सितंबर 2026',
    author: 'सुरेश पटेल (उन्नत कृषक)',
    readTime: '4 मिनट',
    views: '8.1K',
    likes: 512,
    comments: 34,
    hasVideo: false,
    hasGallery: true,
    coverImage: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80',
    excerpt: 'कटाई के समय दानों में सही नमी का प्रतिशत बनाए रखकर अपनी उपज को मंडी में ग्रेड-A श्रेणी में बेचें।',
  },
  {
    slug: 'organic-jeevamrut-production',
    title: '500 रुपये से कम लागत में बनाएं 200 लीटर जीवामृत खाद (स्टेप-बाय-स्टेप वीडियो)',
    category: 'जैविक खेती',
    date: '20 सितंबर 2026',
    author: 'राकेश धाकड़ (जैविक विशेषज्ञ)',
    readTime: '5 मिनट',
    views: '15.3K',
    likes: 1205,
    comments: 145,
    hasVideo: true,
    hasGallery: false,
    coverImage: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=800&q=80',
    excerpt: 'देसी गाय के गोबर व गौमूत्र से बनाएं मिट्टी की उर्वरा शक्ति बढ़ाने वाला प्राकृतिक घोल।',
  },
  {
    slug: 'drone-spraying-technology',
    title: 'खेती में ड्रोन स्प्रेयर: समय, पानी और रसायनों की भारी बचत कैसे करें?',
    category: 'कृषि तकनीक',
    date: '15 सितंबर 2026',
    author: 'इंजीनियर अजय वर्मा',
    readTime: '4 मिनट',
    views: '6.7K',
    likes: 380,
    comments: 28,
    hasVideo: true,
    hasGallery: true,
    coverImage: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80',
    excerpt: '1 एकड़ खेत में मात्र 7 मिनट में सटीक दवा छिड़काव की आधुनिक ड्रोन विधि की पूरी जानकारी।',
  }
];

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredBlogs = allBlogs.filter(blog => {
    const matchesCategory = selectedCategory === 'all' || blog.category === selectedCategory;
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Dynamic Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-700 text-white p-6 sm:p-10 rounded-3xl shadow-lg relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-3 z-10 max-w-2xl">
          <span className="bg-amber-400 text-emerald-950 font-extrabold text-xs px-3.5 py-1.5 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> कृषि ब्लॉग व वीडियो गाइड
          </span>
          <h1 className="text-2xl sm:text-4xl font-black leading-tight">
            कृषि ज्ञान केंद्र: वैज्ञानिक सलाह व व्यावहारिक अनुभव
          </h1>
          <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
            कीट प्रबंधन, मौसम आधारित कृषि सलाह, मंडी गाइड और जैविक खेती पर विशेषज्ञ वीडियो एवं सचित्र लेख।
          </p>
        </div>
      </div>

      {/* Interactive Search & Category Filter Bar */}
      <div className="bg-white border border-emerald-100 rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Categories */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {[
            { id: 'all', label: 'सभी ब्लॉग' },
            { id: 'फसल सुरक्षा', label: 'फसल सुरक्षा' },
            { id: 'फसल प्रबंधन', label: 'फसल प्रबंधन' },
            { id: 'जैविक खेती', label: 'जैविक खेती' },
            { id: 'कृषि तकनीक', label: 'कृषि तकनीक' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="विषय या फसल खोजें (उदा. लहसुन, सोयाबीन)..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 outline-none shadow-xs"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        </div>
      </div>

      {/* Featured Blog Highlight */}
      {filteredBlogs.length > 0 && (
        <div className="bg-white border border-emerald-200 rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition group grid grid-cols-1 md:grid-cols-12">
          <div className="relative md:col-span-7 h-64 sm:h-80 md:h-full bg-slate-200 overflow-hidden">
            <img
              src={featuredPosts[0].coverImage}
              alt={featuredPosts[0].title}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="bg-amber-400 text-slate-950 font-bold text-[11px] px-3 py-1 rounded-full shadow-xs">
                मुख्य लेख (Featured)
              </span>
              {featuredPosts[0].hasVideo && (
                <span className="bg-red-600 text-white font-bold text-[11px] px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs">
                  <PlayCircle className="w-3.5 h-3.5" /> वीडियो उपलब्ध
                </span>
              )}
            </div>
          </div>

          <div className="md:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-md">
                  {featuredPosts[0].category}
                </span>
                <span>• {featuredPosts[0].date}</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-emerald-700 transition leading-snug">
                <Link href={`/blog/${featuredPosts[0].slug}`}>{featuredPosts[0].title}</Link>
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                {featuredPosts[0].excerpt}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1 font-semibold text-slate-800">
                  <User className="w-3.5 h-3.5 text-emerald-600" /> {featuredPosts[0].author}
                </span>
              </div>

              <Link
                href={`/blog/${featuredPosts[0].slug}`}
                className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-xs"
              >
                लेख व वीडियो देखें <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredBlogs.slice(1).map((blog) => (
          <div key={blog.slug} className="bg-white border border-emerald-100 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg hover:border-emerald-300 transition flex flex-col justify-between group">
            <div>
              {/* Card Image */}
              <div className="relative h-48 bg-slate-100 overflow-hidden">
                <img
                  src={blog.coverImage}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="bg-emerald-800/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-md backdrop-blur-xs">
                    {blog.category}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3 flex gap-1">
                  {blog.hasVideo && (
                    <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow-xs">
                      <PlayCircle className="w-3 h-3" /> Video
                    </span>
                  )}
                  {blog.hasGallery && (
                    <span className="bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 backdrop-blur-xs">
                      <ImageIcon className="w-3 h-3" /> Photos
                    </span>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-3">
                <div className="flex justify-between items-center text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-emerald-600" /> {blog.date}
                  </span>
                  <span>{blog.readTime}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition leading-snug line-clamp-2">
                  <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {blog.excerpt}
                </p>
              </div>
            </div>

            {/* Card Footer */}
            <div className="px-5 pb-5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-[11px]">
                  <ThumbsUp className="w-3.5 h-3.5 text-slate-400" /> {blog.likes}
                </span>
                <span className="flex items-center gap-1 text-[11px]">
                  <MessageSquare className="w-3.5 h-3.5 text-slate-400" /> {blog.comments}
                </span>
              </div>

              <Link
                href={`/blog/${blog.slug}`}
                className="text-emerald-800 font-bold hover:underline inline-flex items-center gap-1"
              >
                पढ़ें <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}