'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Calendar, User, Clock, Share2, ThumbsUp, MessageSquare, 
  Volume2, VolumeX, PlayCircle, ShieldCheck, CheckCircle2, Bookmark, Send, Sparkles 
} from 'lucide-react';

const postData = {
  title: 'लहसुन में पीलापन, थ्रिप्स व कंद आकार बढ़ाने की संपूर्ण गाइड (वीडियो सहित)',
  category: 'फसल सुरक्षा',
  date: '28 सितंबर 2026',
  author: 'डॉ. आर. के. शर्मा (वरिष्ठ कृषि वैज्ञानिक)',
  authorTitle: 'कृषि विज्ञान केंद्र, नीमच',
  readTime: '6 मिनट',
  likesCount: 840,
  viewsCount: '12,450',
  youtubeVideoId: 'dQw4w9WgXcQ', // Replace with real agricultural guidance video ID
  audioText: 'लहसुन की फसल में पीलापन दूर करने और कंद का आकार बढ़ाने की संपूर्ण गाइड।',
  heroImage: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1200&q=80',
  galleryImages: [
    'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=600&q=80',
  ]
};

export default function BlogDetailPage({ params }) {
  const [likes, setLikes] = useState(postData.likesCount);
  const [hasLiked, setHasLiked] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [saved, setSaved] = useState(false);
  
  // Comments state
  const [comments, setComments] = useState([
    { name: 'रामेश्वर धाकड़ (नीमच)', text: 'डॉक्टर साहब, 0:52 पर बताई गई दवा से मेरी फसल में बहुत फायदा हुआ!', date: '28 सितंबर' },
    { name: 'विक्रम सिंह (मंदसौर)', text: 'क्या हम इसके साथ बोरॉन भी मिला सकते हैं?', date: '29 सितंबर' }
  ]);
  const [newComment, setNewComment] = useState({ name: '', text: '' });

  const handleLike = () => {
    if (!hasLiked) {
      setLikes(likes + 1);
      setHasLiked(true);
    } else {
      setLikes(likes - 1);
      setHasLiked(false);
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (newComment.name && newComment.text) {
      setComments([...comments, { ...newComment, date: 'अभी' }]);
      setNewComment({ name: '', text: '' });
    }
  };

  const toggleAudio = () => {
    if ('speechSynthesis' in window) {
      if (isPlayingAudio) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(postData.audioText);
        utterance.lang = 'hi-IN';
        utterance.onend = () => setIsPlayingAudio(false);
        window.speechSynthesis.speak(utterance);
        setIsPlayingAudio(true);
      }
    } else {
      alert('आपके ब्राउज़र में ऑडियो सपोर्ट उपलब्ध नहीं है।');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Navigation Top Bar */}
      <div className="flex justify-between items-center border-b border-slate-200 pb-4">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition"
        >
          <ArrowLeft className="w-4 h-4" /> सभी कृषि ब्लॉग पर लौटें
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSaved(!saved)}
            className={`p-2 rounded-xl border text-xs font-bold transition flex items-center gap-1 ${
              saved ? 'bg-amber-100 border-amber-300 text-amber-900' : 'bg-white border-slate-200 text-slate-700'
            }`}
          >
            <Bookmark className="w-4 h-4" /> {saved ? 'सहेजा गया' : 'सेव करें'}
          </button>
        </div>
      </div>

      {/* Main Blog Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="bg-emerald-100 text-emerald-900 font-bold text-xs px-3 py-1 rounded-full uppercase">
            {postData.category}
          </span>
          <span className="text-xs text-slate-500">• {postData.viewsCount} बार पढ़ा गया</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
          {postData.title}
        </h1>

        {/* Author Details & Audio Listen Button */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 border border-slate-200 p-4 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-700 text-white font-bold rounded-full flex items-center justify-center text-sm shrink-0">
              👨‍🌾
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-900">{postData.author}</p>
              <p className="text-[11px] text-slate-500">{postData.authorTitle}</p>
            </div>
          </div>

          <button
            onClick={toggleAudio}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-xs ${
              isPlayingAudio ? 'bg-red-600 text-white' : 'bg-emerald-700 text-white hover:bg-emerald-800'
            }`}
          >
            {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            {isPlayingAudio ? 'आवाज़ बंद करें' : 'बोलकर सुनें (Listen)'}
          </button>
        </div>
      </div>

      {/* Embedded Video Section */}
      <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-lg border border-slate-800">
        <div className="p-3 bg-slate-800 text-white text-xs font-bold flex items-center justify-between">
          <span className="flex items-center gap-2">
            <PlayCircle className="w-4 h-4 text-red-500" /> विशेषज्ञ परामर्श वीडियो मास्टरक्लास
          </span>
          <span className="text-slate-400 text-[11px]">अवधि: 8:45 मिनट</span>
        </div>
        <div className="relative aspect-video w-full">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube-nocookie.com/embed/${postData.youtubeVideoId}`}
            title="Agri Guidance Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      {/* Structured Article Body */}
      <div className="bg-white border border-emerald-100 rounded-3xl p-6 sm:p-10 shadow-xs space-y-6 text-slate-800 leading-relaxed text-xs sm:text-base">
        
        <p className="text-base sm:text-lg font-medium text-slate-900 border-l-4 border-emerald-600 pl-4 py-1 italic bg-emerald-50/50 rounded-r-xl">
          नीमच और मंदसौर अंचल में लहसुन की फसल में पीलापन और कंद न बनने की शिकायत पर कृषि वैज्ञानिकों का विशेष समाधान।
        </p>

        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 pt-2">
          <ShieldCheck className="w-6 h-6 text-emerald-600" /> 1. फसल में पीलापन के मुख्य कारण
        </h2>
        <ul className="list-disc list-inside space-y-2 text-slate-700">
          <li><strong>रस चूसक कीट (Thrips):</strong> पत्तियों का मुड़ना और पत्तियों के ऊपर सफेद धब्बे बनना।</li>
          <li><strong>फफूंद रोग (Purple Blotch):</strong> पत्तियों के सिरों से पीला पड़कर सूखना।</li>
          <li><strong>सल्फर व जिंक की कमी:</strong> पौधों की वृद्धि रुकना और जड़ों का कमज़ोर होना।</li>
        </ul>

        {/* In-Article Image Gallery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
          {postData.galleryImages.map((img, idx) => (
            <div key={idx} className="rounded-2xl overflow-hidden border border-slate-200">
              <img src={img} alt="Crop Disease Sample" className="w-full h-48 object-cover" />
              <p className="p-2 text-[11px] text-center bg-slate-50 text-slate-600 font-medium">
                चित्र {idx + 1}: लहसुन की पत्तियों में थ्रिप्स कीट के लक्षण
              </p>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <CheckCircle2 className="w-6 h-6 text-emerald-600" /> 2. प्रमाणित छिड़काव स्प्रे कॉम्बिनेशन (प्रति 15 लीटर पंप)
        </h2>
        
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-3">
          <h3 className="font-bold text-amber-950 text-sm">स्प्रे की सही मात्रा:</h3>
          <ul className="space-y-1.5 text-xs sm:text-sm text-amber-900">
            <li>✓ <strong>थ्रिप्स हेतु:</strong> इमिडाक्लोप्रिड 17.8% SL — 10 ml</li>
            <li>✓ <strong>फफूंदनाशक:</strong> मैन्कोज़ेब 75% WP — 30 gram</li>
            <li>✓ <strong>कंद बढ़वार हेतु:</strong> NPK 00:52:34 — 70 gram</li>
            <li>✓ <strong>चिपको (Silicon Sticker):</strong> 5 ml (दवा को पत्तियों पर फैलाने हेतु)</li>
          </ul>
        </div>
      </div>

      {/* Social Engagement Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex justify-between items-center shadow-xs">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            hasLiked ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <ThumbsUp className="w-4 h-4" /> {likes} किसानों को उपयोगी लगा
        </button>

        <span className="text-xs font-medium text-slate-500">
          {comments.length} विचार एवं सवाल
        </span>
      </div>

      {/* Interactive Comments & Farmer Discussion */}
      <div className="bg-white border border-emerald-100 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-emerald-600" /> किसान चर्चा एवं सवाल-जवाब
        </h3>

        {/* Comment Form */}
        <form onSubmit={handleAddComment} className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              required
              placeholder="आपका नाम व गांव..."
              value={newComment.name}
              onChange={(e) => setNewComment({ ...newComment, name: e.target.value })}
              className="bg-white border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <textarea
            rows={3}
            required
            placeholder="अपनी फसल की समस्या या सवाल पूछें..."
            value={newComment.text}
            onChange={(e) => setNewComment({ ...newComment, text: e.target.value })}
            className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:ring-2 focus:ring-emerald-500"
          ></textarea>
          <button
            type="submit"
            className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition flex items-center gap-2"
          >
            सवाल पूछें <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Comments List */}
        <div className="space-y-3 divide-y divide-slate-100">
          {comments.map((c, idx) => (
            <div key={idx} className="pt-3 space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-900">{c.name}</span>
                <span className="text-[10px] text-slate-400">{c.date}</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">{c.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}