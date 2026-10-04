'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Calendar, User, ArrowRight, Search, PlayCircle, Image as ImageIcon, 
  ThumbsUp, MessageSquare, Sparkles, Filter, Eye, Tag, Share2, CheckCircle, BookOpen
} from 'lucide-react';

const categories = [
  { id: 'all', label: 'सभी लेख' },
  { id: 'फसल सुरक्षा', label: '🛡️ फसल सुरक्षा' },
  { id: 'फसल प्रबंधन', label: '🌾 फसल प्रबंधन' },
  { id: 'जैविक खेती', label: '🌱 जैविक खेती' },
  { id: 'कृषि तकनीक', label: '🚜 कृषि तकनीक' },
];

const blogsData = [
  {
    slug: 'garlic-care-masterclass',
    title: 'लहसुन में पीलापन, थ्रिप्स व कंद आकार बढ़ाने की संपूर्ण गाइड (वीडियो व डोज कैलकुलेटर सहित)',
    category: 'फसल सुरक्षा',
    date: '28 सितंबर 2026',
    author: 'डॉ. आर. के. शर्मा',
    authorRole: 'वरिष्ठ कृषि वैज्ञानिक',
    readTime: '6 मिनट',
    views: '12.4K',
    likes: 840,
    comments: 92,
    hasVideo: true,
    hasGallery: true,
    isFeatured: true,
    coverImage: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'नीमच व मंदसौर अंचल के लहसुन उत्पादकों के लिए विशेष रिपोर्ट: जानें मौसम परिवर्तन के दौरान कौन सा फफूंदनाशक और सूक्ष्म पोषक तत्व छिड़कें।',
    tags: ['लहसुन', 'नीमच मंडी', 'थ्रिप्स', 'NPK']
  },
  {
    slug: 'soyabean-harvesting-tips',
    title: 'सोयाबीन कटाई एवं भण्डारण में नमी नियंत्रण: पाएं मंडी में अधिकतम भाव',
    category: 'फसल प्रबंधन',
    date: '25 सितंबर 2026',
    author: 'सुरेश पटेल',
    authorRole: 'उन्नत कृषक',
    readTime: '4 मिनट',
    views: '8.1K',
    likes: 512,
    comments: 34,
    hasVideo: false,
    hasGallery: true,
    isFeatured: false,
    coverImage: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80',
    excerpt: 'कटाई के समय दानों में सही नमी (12-14%) बनाए रखकर अपनी उपज को मंडी में ग्रेड-A श्रेणी में बेचें।',
    tags: ['सोयाबीन', 'भंडारण', 'मंडी भाव']
  },
  {
    slug: 'organic-jeevamrut-production',
    title: '500 रुपये से कम लागत में बनाएं 200 लीटर जीवामृत खाद (स्टेप-बाय-स्टेप गाइड)',
    category: 'जैविक खेती',
    date: '20 सितंबर 2026',
    author: 'राकेश धाकड़',
    authorRole: 'जैविक विशेषज्ञ',
    readTime: '5 मिनट',
    views: '15.3K',
    likes: 1205,
    comments: 145,
    hasVideo: true,
    hasGallery: false,
    isFeatured: false,
    coverImage: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=800&q=80',
    excerpt: 'देसी गाय के गोबर व गौमूत्र से बनाएं मिट्टी की उर्वरा शक्ति और मित्र कीटों को बढ़ाने वाला प्राकृतिक घोल।',
    tags: ['जैविक खाद', 'जीवामृत', 'प्राकृतिक खेती']
  },
  {
    slug: 'drone-spraying-technology',
    title: 'खेती में ड्रोन स्प्रेयर: समय, पानी और रसायनों की भारी बचत कैसे करें?',
    category: 'कृषि तकनीक',
    date: '15 सितंबर 2026',
    author: 'इंजीनियर अजय वर्मा',
    authorRole: 'एग्री-टेक विशेषज्ञ',
    readTime: '4 मिनट',
    views: '6.7K',
    likes: 380,
    comments: 28,
    hasVideo: true,
    hasGallery: true,
    isFeatured: false,
    coverImage: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80',
    excerpt: '1 एकड़ खेत में मात्र 7 मिनट में सटीक दवा छिड़काव की आधुनिक ड्रोन विधि की पूरी जानकारी।',
    tags: ['ड्रोन', 'स्मार्ट फार्मिंग', 'छिड़काव']
  }
];

export default function BlogListingPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const featuredPost = blogsData.find(post => post.isFeatured) || blogsData[0];

  const filteredBlogs = blogsData.filter(blog => {
    const matchesCategory = selectedCategory === 'all' || blog.category === selectedCategory;
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 space-y-10 max-w-7xl mx-auto">
      
      {/* Banner / Hero Section */}
      <div className="relative bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-800 text-white p-8 sm:p-12 rounded-3xl shadow-xl overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <BookOpen className="w-96 h-96" />
        </div>
        <div className="relative z-10 max-w-3xl space-y-4">
          <span className="inline-flex items-center gap-2 bg-amber-400 text-emerald-950 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
            <Sparkles className="w-4 h-4" /> डिजिटल कृषि ज्ञान केंद्र
          </span>
          <h1 className="text-3xl sm:text-5xl font-black leading-tight">
            वैज्ञानिक सलाह, मौसम अपडेट व व्यावहारिक कृषि ज्ञान
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
            कीट प्रबंधन, उन्नत फसल किस्में, मंडी गाइड और जैविक तकनीकों पर प्रमाणित गाइड और विशेषज्ञों के सुझाव।
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                selectedCategory === cat.id
                  ? 'bg-emerald-700 text-white shadow-md scale-105'
                  : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="फसल, बीमारी या विषय खोजें (उदा. लहसुन)..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none transition"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
        </div>
      </div>

      {/* Featured Main Post Card */}
      {selectedCategory === 'all' && !searchTerm && (
        <div className="bg-white border border-emerald-100 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 grid grid-cols-1 lg:grid-cols-12 group">
          <div className="relative lg:col-span-7 h-64 sm:h-96 lg:h-full bg-slate-200 overflow-hidden">
            <img
              src={featuredPost.coverImage}
              alt={featuredPost.title}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-700 ease-out"
            />
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <span className="bg-amber-400 text-emerald-950 font-black text-xs px-3.5 py-1 rounded-full shadow-md">
                मुख्य लेख (Featured)
              </span>
              {featuredPost.hasVideo && (
                <span className="bg-red-600 text-white font-bold text-xs px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                  <PlayCircle className="w-3.5 h-3.5" /> वीडियो उपलब्ध
                </span>
              )}
            </div>
          </div>

          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="text-emerald-800 font-extrabold bg-emerald-100 px-3 py-1 rounded-md">
                  {featuredPost.category}
                </span>
                <span>• {featuredPost.date}</span>
                <span>• {featuredPost.readTime} पढ़ें</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 group-hover:text-emerald-700 transition leading-snug">
                <Link href={`/blog/${featuredPost.slug}`}>{featuredPost.title}</Link>
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {featuredPost.excerpt}
              </p>

              <div className="flex flex-wrap gap-1.5 pt-2">
                {featuredPost.tags.map((tag, idx) => (
                  <span key={idx} className="bg-slate-100 text-slate-600 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-xs">
                  👨‍🌾
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">{featuredPost.author}</p>
                  <p className="text-[10px] text-slate-500">{featuredPost.authorRole}</p>
                </div>
              </div>

              <Link
                href={`/blog/${featuredPost.slug}`}
                className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-md hover:shadow-lg"
              >
                पूरा लेख पढ़ें <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Grid List for All Posts */}
      <div className="space-y-4">
        <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-700" /> नवीनतम कृषि लेख एवं गाइड
        </h3>

        {filteredBlogs.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 space-y-3">
            <p className="text-slate-500 font-bold">कोई लेख नहीं मिला!</p>
            <button 
              onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
              className="text-emerald-700 text-xs font-bold underline"
            >
              फ़िल्टर हटाएं
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((blog) => (
              <div key={blog.slug} className="bg-white border border-slate-200 hover:border-emerald-400 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 flex flex-col justify-between group">
                <div>
                  {/* Thumbnail Image */}
                  <div className="relative h-48 bg-slate-100 overflow-hidden">
                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-md">
                      {blog.category}
                    </span>
                    <div className="absolute bottom-3 right-3 flex gap-1">
                      {blog.hasVideo && (
                        <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow-sm">
                          <PlayCircle className="w-3 h-3" /> वीडियो
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Details */}
                  <div className="p-5 space-y-3">
                    <div className="flex justify-between items-center text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-emerald-600" /> {blog.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3 text-slate-400" /> {blog.views}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition leading-snug line-clamp-2">
                      <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
                    </h4>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {blog.excerpt}
                    </p>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-5 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-[11px] font-medium">
                      <ThumbsUp className="w-3.5 h-3.5 text-slate-400" /> {blog.likes}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-medium">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-400" /> {blog.comments}
                    </span>
                  </div>

                  <Link
                    href={`/blog/${blog.slug}`}
                    className="text-emerald-700 font-bold hover:text-emerald-900 inline-flex items-center gap-1 transition"
                  >
                    पढ़ें <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}