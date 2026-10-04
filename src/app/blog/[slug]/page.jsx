'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Calendar, User, Clock, Share2, ThumbsUp, MessageSquare, 
  Volume2, VolumeX, PlayCircle, ShieldCheck, CheckCircle2, Bookmark, Send, 
  Calculator, AlertTriangle, Eye, Check, Copy
} from 'lucide-react';

const postData = {
  title: 'लहसुन में पीलापन, थ्रिप्स व कंद आकार बढ़ाने की संपूर्ण गाइड (वीडियो व डोज कैलकुलेटर सहित)',
  category: 'फसल सुरक्षा',
  date: '28 सितंबर 2026',
  author: 'डॉ. आर. के. शर्मा',
  authorRole: 'वरिष्ठ कृषि वैज्ञानिक (कृषि विज्ञान केंद्र, नीमच)',
  readTime: '6 मिनट पाठ',
  likesCount: 840,
  viewsCount: '12,450',
  youtubeVideoId: 'dQw4w9WgXcQ',
  audioText: 'लहसुन की फसल में पीलापन दूर करने, थ्रिप्स कीट से बचाव और कंद का आकार बढ़ाने की वैज्ञानिक गाइड में आपका स्वागत है।',
  heroImage: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1200&q=80',
  galleryImages: [
    { url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80', title: 'थ्रिप्स का प्रकोप (पत्तियों पर सफेद धब्बे)' },
    { url: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=600&q=80', title: 'स्वस्थ कंद विकास हेतु सही सिंचाई व्यवस्था' }
  ]
};

export default function BlogDetailPage() {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'calculator', 'spray'
  const [likes, setLikes] = useState(postData.likesCount);
  const [hasLiked, setHasLiked] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  // Interactive Calculator State
  const [landArea, setLandArea] = useState(1); // Default 1 Acre
  const [unit, setUnit] = useState('acre'); // 'acre' or 'bigha'

  // Comments state
  const [comments, setComments] = useState([
    { name: 'रामेश्वर धाकड़ (नीमच)', text: 'डॉक्टर साहब, 00:52:34 का छिड़काव करने से मेरी फसल में कंद का आकार काफी अच्छा बना!', date: '28 सितंबर' },
    { name: 'विक्रम सिंह (मंदसौर)', text: 'क्या हम इमिडाक्लोप्रिड के साथ सल्फर मिला सकते हैं?', date: '29 सितंबर' }
  ]);
  const [newComment, setNewComment] = useState({ name: '', text: '' });

  const handleLike = () => {
    setLikes(prev => hasLiked ? prev - 1 : prev + 1);
    setHasLiked(!hasLiked);
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
      alert('आपके डिवाइस पर ऑडियो सपोर्ट उपलब्ध नहीं है।');
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Dosage Calculation Factor (Base: 1 Acre)
  const multiplier = unit === 'acre' ? landArea : landArea * 0.625; // 1 Bigha ~ 0.625 Acre approx.

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      
      {/* Top Navigation */}
      <div className="flex justify-between items-center border-b border-slate-200 pb-4">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition"
        >
          <ArrowLeft className="w-4 h-4" /> सभी कृषि ब्लॉग पर लौटें
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={copyLink}
            className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-bold transition flex items-center gap-1.5"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            {copied ? 'लिंक कॉपी हुआ' : 'शेयर'}
          </button>

          <button
            onClick={() => setSaved(!saved)}
            className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
              saved ? 'bg-amber-100 border-amber-300 text-amber-900' : 'bg-white border-slate-200 text-slate-700'
            }`}
          >
            <Bookmark className="w-4 h-4" /> {saved ? 'सहेजा गया' : 'सेव करें'}
          </button>
        </div>
      </div>

      {/* Main Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="bg-emerald-100 text-emerald-900 font-extrabold text-xs px-3 py-1 rounded-full">
            {postData.category}
          </span>
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" /> {postData.viewsCount} बार देखा गया
          </span>
          <span className="text-xs text-slate-500">• {postData.date}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight">
          {postData.title}
        </h1>

        {/* Author Box & Voice Assistant */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-emerald-800 text-white font-bold rounded-full flex items-center justify-center text-base shrink-0 shadow-sm">
              👨‍🌾
            </div>
            <div>
              <p className="text-xs sm:text-sm font-black text-slate-900">{postData.author}</p>
              <p className="text-[11px] text-slate-500 font-medium">{postData.authorRole}</p>
            </div>
          </div>

          <button
            onClick={toggleAudio}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm ${
              isPlayingAudio ? 'bg-red-600 text-white animate-pulse' : 'bg-emerald-700 text-white hover:bg-emerald-800'
            }`}
          >
            {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            {isPlayingAudio ? 'बोलना बंद करें' : 'बोलकर सुनें (Voice Assist)'}
          </button>
        </div>
      </div>

      {/* Embedded Video Section */}
      <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-lg border border-slate-800">
        <div className="p-3 bg-slate-800/90 text-white text-xs font-bold flex items-center justify-between">
          <span className="flex items-center gap-2">
            <PlayCircle className="w-4 h-4 text-red-500" /> कृषि विशेषज्ञ मास्टरक्लास वीडियो
          </span>
          <span className="text-slate-400 text-[11px]">अवधि: 8 मिनट 45 सेकंड</span>
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

      {/* Interactive Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-2 bg-slate-100 p-1.5 rounded-2xl">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
            activeTab === 'overview' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          📖 विस्तृत जानकारी
        </button>
        <button
          onClick={() => setActiveTab('calculator')}
          className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
            activeTab === 'calculator' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          🧮 डोज कैलकुलेटर (Spray Dose)
        </button>
      </div>

      {/* Tab 1: Detailed Content & Symptoms */}
      {activeTab === 'overview' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6 text-slate-800">
          
          <p className="text-base sm:text-lg font-medium text-slate-900 border-l-4 border-emerald-600 pl-4 py-1 italic bg-emerald-50/50 rounded-r-xl">
            नीमच व मंदसौर मंडी क्षेत्र के लहसुन उत्पादकों के लिए विशेष रिपोर्ट: मौसम में उतार-चढ़ाव के समय सही दवाओं का चयन फसल को सुरक्षित रखता है।
          </p>

          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 pt-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" /> 1. लहसुन में पीलापन व बीमारी के मुख्य लक्षण
          </h3>
          <ul className="list-disc list-inside space-y-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <li><strong>रस चूसक थ्रिप्स (Thrips):</strong> पत्तियों पर छोटी-छोटी सफेद धारियाँ बनना एवं पत्तियों की नोक मुड़ना।</li>
            <li><strong>फफूंदजन्य रोग (Purple Blotch):</strong> पत्तियों पर बैंगनी-भूरे रंग के धब्बे बनना, जिससे पत्तियाँ सूखने लगती हैं।</li>
            <li><strong>पोषक तत्वों की कमी:</strong> सल्फर या जिंक की कमी से नए कंदों का विकास रुकना।</li>
          </ul>

          {/* Image Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
            {postData.galleryImages.map((img, idx) => (
              <div key={idx} className="rounded-2xl overflow-hidden border border-slate-200">
                <img src={img.url} alt={img.title} className="w-full h-48 object-cover" />
                <p className="p-2.5 text-[11px] text-center bg-slate-50 text-slate-600 font-semibold">
                  {img.title}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-2">
            <h4 className="font-bold text-amber-950 text-xs sm:text-sm flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" /> सावधानियां:
            </h4>
            <p className="text-xs text-amber-900 leading-relaxed">
              छिड़काव हमेशा सुबह ओस सूखने के बाद या शाम 4 बजे के बाद करें। सिलिकॉन चिपको (Sticker) मिलाना अनिवार्य है।
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: Interactive Dose Calculator */}
      {activeTab === 'calculator' && (
        <div className="bg-white border border-emerald-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-emerald-700" /> स्वचालित छिड़काव डोज कैलकुलेटर
            </h3>
            <p className="text-xs text-slate-500">
              अपने खेत का क्षेत्रफल दर्ज करें और जानें कि आपको कितनी दवा और कितना पानी चाहिए।
            </p>
          </div>

          {/* Calculator Input Bar */}
          <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex-1 w-full">
              <label className="block text-xs font-bold text-slate-700 mb-1">खेत का क्षेत्रफल:</label>
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={landArea}
                onChange={(e) => setLandArea(Math.max(0.1, parseFloat(e.target.value) || 0))}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-emerald-600 outline-none"
              />
            </div>

            <div className="w-full sm:w-48">
              <label className="block text-xs font-bold text-slate-700 mb-1">इकाई (Unit):</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-emerald-600 outline-none"
              >
                <option value="acre">एकड़ (Acre)</option>
                <option value="bigha">बीघा (Bigha)</option>
              </select>
            </div>
          </div>

          {/* Calculated Output Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">रसायन/उर्वरक</th>
                  <th className="p-3">प्रकार</th>
                  <th className="p-3">अनुशंसित मात्रा</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                <tr>
                  <td className="p-3 font-bold text-slate-900">इमिडाक्लोप्रिड 17.8% SL</td>
                  <td className="p-3">कीटनाशक (थ्रिप्स)</td>
                  <td className="p-3 text-emerald-800 font-bold">{(100 * multiplier).toFixed(0)} ml</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-900">मैन्कोज़ेब 75% WP</td>
                  <td className="p-3">फफूंदनाशक</td>
                  <td className="p-3 text-emerald-800 font-bold">{(300 * multiplier).toFixed(0)} gram</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-900">NPK 00:52:34</td>
                  <td className="p-3">कंद बढ़वार पोषक तत्व</td>
                  <td className="p-3 text-emerald-800 font-bold">{(750 * multiplier).toFixed(0)} gram</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-900">आवश्यक पानी (Water Volume)</td>
                  <td className="p-3">छिड़काव हेतु</td>
                  <td className="p-3 text-blue-700 font-bold">{(150 * multiplier).toFixed(0)} लीटर (लगभग {(10 * multiplier).toFixed(0)} पंप)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Engagement & Like Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex justify-between items-center shadow-sm">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition ${
            hasLiked ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <ThumbsUp className="w-4 h-4" /> {likes} किसानों को यह उपयोगी लगा
        </button>

        <span className="text-xs font-medium text-slate-500">
          {comments.length} किसान प्रतिक्रियाएं
        </span>
      </div>

      {/* Interactive Comment & Discussion Section */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-emerald-700" /> किसान चर्चा एवं सवाल-जवाब
        </h3>

        {/* Form */}
        <form onSubmit={handleAddComment} className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <input
            type="text"
            required
            placeholder="आपका नाम एवं गांव (उदा. रमेश, नीमच)..."
            value={newComment.name}
            onChange={(e) => setNewComment({ ...newComment, name: e.target.value })}
            className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-emerald-600 outline-none"
          />
          <textarea
            rows={3}
            required
            placeholder="अपनी समस्या या अनुभव यहाँ लिखें..."
            value={newComment.text}
            onChange={(e) => setNewComment({ ...newComment, text: e.target.value })}
            className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-emerald-600 outline-none"
          ></textarea>
          <button
            type="submit"
            className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition flex items-center gap-2"
          >
            टिप्पणी भेजें <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Comment Feed */}
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