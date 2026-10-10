'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Calculator,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Copy,
  Eye,
  Heart,
  MessageSquare,
  PlayCircle,
  Send,
  Share2,
  ShieldCheck,
  ThumbsDown,
  ThumbsUp,
  User,
  Volume2,
  VolumeX,
} from 'lucide-react';

import {
  getOrCreateVisitorId,
  publicApiRequest,
  unwrapApiList,
} from '@/lib/publicApi';

export default function BlogDetailPage({ params }) {
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [relatedError, setRelatedError] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('');
  const [activeTab, setActiveTab] = useState('article');

  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likes, setLikes] = useState(0);
  const likeBaseCount = useRef(0);
  const [likeSubmitting, setLikeSubmitting] = useState(false);
  const [engagementError, setEngagementError] = useState('');

  const [copied, setCopied] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const [landArea, setLandArea] = useState(1);
  const [landUnit, setLandUnit] = useState('acre');

  const [openFaq, setOpenFaq] = useState(null);

  const [helpful, setHelpful] = useState(null);
  const [visitorId, setVisitorId] = useState('');
  const [feedbackCounts, setFeedbackCounts] = useState({ helpful: 0, 'needs-improvement': 0 });
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [feedbackError, setFeedbackError] = useState('');

  const [comments, setComments] = useState([]);
  const [commentCount, setCommentCount] = useState(0);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [commentsError, setCommentsError] = useState('');
  const [commentNotice, setCommentNotice] = useState('');

  const [commentForm, setCommentForm] = useState({
    name: '',
    location: '',
    text: '',
  });

  useEffect(() => {
    let cancelled = false;
    async function loadBlog() {
      try {
        const result = await publicApiRequest(
          `/blogs/slug/${encodeURIComponent(params?.slug || '')}`,
        );
        const record = result.data;
        const dateValue = record.date || record.publishedAt;
        const apiBlog = {
          ...record,
          dateLabel: dateValue
            ? new Intl.DateTimeFormat('hi-IN', { dateStyle: 'medium' }).format(new Date(dateValue))
            : '',
        };
        if (cancelled) return;
        const storedLikeValue =
          typeof window !== 'undefined'
            ? window.localStorage.getItem(`krishi-blog-like-${apiBlog.slug}`)
            : null;
        const isLikedStored = storedLikeValue === 'true';
        likeBaseCount.current = Number(apiBlog.likes || 0);
        setBlog(apiBlog);
        setLiked(isLikedStored);
        setLikes(likeBaseCount.current + (isLikedStored ? 1 : 0));
      } catch (error) {
        if (!cancelled) setLoadError(error.message || 'लेख लोड नहीं हो सका।');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadBlog();
    return () => {
      cancelled = true;
    };
  }, [params?.slug]);

  useEffect(() => {
    if (!blog?.slug) return undefined;

    let cancelled = false;
    const id = getOrCreateVisitorId('krishi-blog-visitor-id');
    setVisitorId(id);
    setFeedbackLoading(true);
    setCommentsLoading(true);
    setFeedbackError('');
    setCommentsError('');

    publicApiRequest(
      `/blogs/slug/${encodeURIComponent(blog.slug)}/feedback?visitorId=${encodeURIComponent(id)}`,
    )
      .then((result) => {
        if (cancelled) return;
        setFeedbackCounts(result.data || { helpful: 0, 'needs-improvement': 0 });
        setHelpful(
          result.data?.visitorRating === 'helpful'
            ? 'yes'
            : result.data?.visitorRating === 'needs-improvement'
              ? 'no'
              : null,
        );
      })
      .catch((error) => {
        if (!cancelled) setFeedbackError(error.message || 'प्रतिक्रिया लोड नहीं हो सकी।');
      })
      .finally(() => {
        if (!cancelled) setFeedbackLoading(false);
      });

    publicApiRequest(`/blogs/slug/${encodeURIComponent(blog.slug)}/comments`)
      .then((result) => {
        if (cancelled) return;
        setComments(
          unwrapApiList(result).map((item) => ({
            ...item,
            id: item._id || item.id,
            date: item.createdAt
              ? new Intl.DateTimeFormat('hi-IN', { dateStyle: 'medium' }).format(new Date(item.createdAt))
              : '',
          })),
        );
        setCommentCount(Number(result.count) || 0);
      })
      .catch((error) => {
        if (!cancelled) setCommentsError(error.message || 'टिप्पणियां लोड नहीं हो सकीं।');
      })
      .finally(() => {
        if (!cancelled) setCommentsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [blog?.slug]);

  useEffect(() => {
    if (!blog?._id || loading || !visitorId) return undefined;

    let cancelled = false;
    setEngagementError('');
    publicApiRequest(`/blogs/${encodeURIComponent(blog._id)}/view`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visitorId }),
    })
      .then((result) => {
        if (cancelled) return;
        const counts = result.data || {};
        setBlog((current) =>
          current ? { ...current, views: Number(counts.views) || 0 } : current,
        );
        setLikes(Number(counts.likes) || 0);
        setLiked(Boolean(counts.liked));
        window.localStorage.setItem(
          `krishi-blog-like-${blog.slug}`,
          String(Boolean(counts.liked)),
        );
      })
      .catch((error) => {
        if (!cancelled) {
          setEngagementError(error.message || 'आंकड़े अपडेट नहीं हो सके।');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [blog?._id, blog?.slug, loading, visitorId]);

  useEffect(() => {
    const categoryId = blog?.categoryId?._id || blog?.categoryId;
    if (!categoryId) return;
    let cancelled = false;
    publicApiRequest(`/blogs?category=${encodeURIComponent(categoryId)}&limit=4`)
      .then((result) => {
        if (!cancelled) {
          setRelatedBlogs(
            unwrapApiList(result).filter((item) => item.slug !== blog.slug),
          );
        }
      })
      .catch((error) => {
        if (!cancelled) setRelatedError(error.message || 'संबंधित लेख लोड नहीं हो सके।');
      });
    return () => {
      cancelled = true;
    };
  }, [blog]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

      setProgress(height > 0 ? (scrollTop / height) * 100 : 0);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!blog) return;

    const sections =
      blog.content?.sections?.map((section) => section.id) || [];

    const observers = [];

    sections.forEach((id) => {
      const element = document.getElementById(id);

      if (!element) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(id);
            }
          });
        },
        {
          rootMargin: '-20% 0px -65% 0px',
        }
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [blog]);

  const calculatorData = useMemo(() => {
    const acres =
      landUnit === 'acre'
        ? Number(landArea) || 0
        : (Number(landArea) || 0) * 0.625;

    const water = (blog?.calculator?.waterPerAcre || 0) * acres;
    const recommendations =
      blog?.calculator?.recommendations?.map((item) => ({
        ...item,
        calculated: item.quantity * acres,
      })) || [];

    return { acres, water, recommendations };
  }, [landArea, landUnit, blog]);

  if (loading) {
    return <main className="mx-auto max-w-4xl px-4 py-16 text-center text-slate-500">लेख लोड हो रहा है...</main>;
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center max-w-lg">
          <h1 className="text-2xl font-black text-slate-900">
            {loadError ? 'लेख लोड नहीं हो सका' : 'लेख नहीं मिला'}
          </h1>

          <p className="text-sm text-slate-500 mt-2">
            {loadError || 'यह लेख उपलब्ध नहीं है या प्रकाशित नहीं किया गया है।'}
          </p>

          <Link
            href="/blog"
            className="inline-flex mt-6 bg-emerald-700 text-white px-5 py-3 rounded-xl text-sm font-bold"
          >
            सभी ब्लॉग देखें
          </Link>
        </div>
      </div>
    );
  }

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const handleLike = async () => {
    if (!blog?._id || !visitorId || likeSubmitting) return;

    const nextLikedState = !liked;
    setLikeSubmitting(true);
    setEngagementError('');
    try {
      const result = await publicApiRequest(
        `/blogs/${encodeURIComponent(blog._id)}/like`,
        {
          method: nextLikedState ? 'PUT' : 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ visitorId }),
        },
      );
      const counts = result.data || {};
      setLiked(Boolean(counts.liked));
      setLikes(Number(counts.likes) || 0);
      window.localStorage.setItem(
        `krishi-blog-like-${blog.slug}`,
        String(Boolean(counts.liked)),
      );
    } catch (error) {
      setEngagementError(error.message || 'लाइक अपडेट नहीं हो सका।');
    } finally {
      setLikeSubmitting(false);
    }
  };

  const handleBookmark = () => {
    setSaved((previous) => !previous);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: blog.title,
          text: blog.excerpt,
          url: window.location.href,
        });
        return;
      }

      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  const handleVoice = () => {
    if (!('speechSynthesis' in window)) {
      alert('आपके browser में voice support उपलब्ध नहीं है।');
      return;
    }

    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    const text = [
      blog.title,
      blog.content?.introduction,
      ...(blog.content?.sections || []).flatMap((section) => [
        section.title,
        ...(section.paragraphs || []),
        ...(section.bullets || []),
      ]),
    ].join('. ');

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = 'hi-IN';
    utterance.rate = 0.9;

    utterance.onend = () => {
      setSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  };

  const handleFeedbackSubmit = async (rating) => {
    if (!blog?.slug || !visitorId || feedbackSubmitting) return;
    setFeedbackSubmitting(true);
    setFeedbackError('');
    try {
      const result = await publicApiRequest(
        `/blogs/slug/${encodeURIComponent(blog.slug)}/feedback`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            visitorId,
            rating: rating === 'yes' ? 'helpful' : 'needs-improvement',
          }),
        },
      );
      setHelpful(rating);
      setFeedbackCounts(result.data || feedbackCounts);
    } catch (error) {
      setFeedbackError(error.message || 'प्रतिक्रिया भेजी नहीं जा सकी।');
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();

    if (!blog?.slug || commentSubmitting || !commentForm.name.trim() || !commentForm.text.trim()) {
      return;
    }

    setCommentSubmitting(true);
    setCommentsError('');
    setCommentNotice('');
    try {
      const result = await publicApiRequest(
        `/blogs/slug/${encodeURIComponent(blog.slug)}/comments`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(commentForm),
        },
      );
      const item = result.data;
      setComments((previous) => [
        {
          ...item,
          id: item._id || item.id,
          date: 'अभी',
        },
        ...previous,
      ]);
      setCommentCount((previous) => previous + 1);
      setCommentForm({ name: '', location: '', text: '' });
      setCommentNotice('आपकी टिप्पणी भेज दी गई है।');
    } catch (error) {
      setCommentsError(error.message || 'टिप्पणी भेजी नहीं जा सकी।');
    } finally {
      setCommentSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* READING PROGRESS */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-1 bg-slate-200">
        <div
          className="h-full bg-emerald-600 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* TOP BAR */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">

          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800"
          >
            <ArrowLeft className="w-4 h-4" />
            सभी कृषि ब्लॉग
          </Link>

          <div className="flex items-center gap-2">

            <button
              onClick={handleVoice}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 ${
                speaking
                  ? 'bg-red-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-700'
              }`}
            >
              {speaking ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}

              {speaking ? 'बंद करें' : 'सुनें'}
            </button>

            <button
              onClick={handleBookmark}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border ${
                saved
                  ? 'bg-amber-100 border-amber-300 text-amber-900'
                  : 'bg-white border-slate-200 text-slate-700'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              {saved ? 'Saved' : 'Save'}
            </button>

            <button
              onClick={handleShare}
              className="px-3 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>

        {/* HERO */}
        <section className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm">

          <div className="relative h-64 sm:h-96 lg:h-[500px]">

            <img
              src={blog.heroImage || blog.coverImage}
              alt={blog.title}
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 lg:p-10 text-white">

              <div className="flex flex-wrap gap-2 mb-4">

                <span className="bg-emerald-600 px-3 py-1.5 rounded-full text-xs font-black">
                  {blog.category}
                </span>

                {blog.hasVideo && (
                  <span className="bg-red-600 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1">
                    <PlayCircle className="w-3 h-3" />
                    वीडियो
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black leading-tight max-w-5xl">
                {blog.title}
              </h1>

              <div className="flex flex-wrap gap-4 mt-5 text-xs text-slate-200">

                <span className="flex items-center gap-1">
                  <CalendarIcon />
                  {blog.dateLabel}
                </span>

                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {blog.readTime} मिनट
                </span>

                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  {formatNumber(blog.views)} views
                </span>

              </div>
            </div>
          </div>

          {/* AUTHOR */}
          <div className="p-5 sm:p-7 flex flex-wrap items-center justify-between gap-4">

            <div className="flex items-center gap-3">

              <div className="w-12 h-12 rounded-full bg-emerald-700 text-white flex items-center justify-center">
                {blog.authorAvatar || '👨‍🌾'}
              </div>

              <div>
                <div className="text-sm font-black text-slate-900">
                  {blog.author}
                </div>

                <div className="text-xs text-slate-500">
                  {blog.authorRole}
                </div>
              </div>
            </div>

            <div className="flex gap-2">

              <button
                onClick={handleLike}
                disabled={!visitorId || likeSubmitting}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
                  likeSubmitting
                    ? 'cursor-wait opacity-60'
                    : liked
                    ? 'bg-emerald-700 text-white'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                <Heart
                  className={`w-4 h-4 ${liked ? 'fill-current' : ''}`}
                />
                {formatNumber(likes)}
              </button>

              <button
                onClick={handleCopyLink}
                className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-2"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}

                {copied ? 'Copied' : 'Copy Link'}
              </button>
            </div>
            {engagementError && (
              <p className="mt-2 text-xs text-red-600" role="alert">
                {engagementError}
              </p>
            )}
          </div>
        </section>

        {/* BODY */}
        <div className="grid lg:grid-cols-12 gap-8 mt-8">

          {/* LEFT CONTENT */}
          <article className="lg:col-span-8 space-y-7">

            {/* VIDEO */}
            {blog.youtubeVideoId && (
              <section className="bg-slate-950 rounded-3xl overflow-hidden shadow-lg">

                <div className="p-4 text-white flex items-center gap-2 text-sm font-bold">
                  <PlayCircle className="w-5 h-5 text-red-500" />
                  कृषि विशेषज्ञ वीडियो
                </div>

                <div className="aspect-video">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube-nocookie.com/embed/${blog.youtubeVideoId}`}
                    title={blog.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </section>
            )}

            {/* TABS */}
            <div className="bg-white border border-slate-200 p-1.5 rounded-2xl flex gap-1 sticky top-3 z-30 shadow-sm">

              <button
                onClick={() => setActiveTab('article')}
                className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold ${
                  activeTab === 'article'
                    ? 'bg-emerald-700 text-white'
                    : 'text-slate-600'
                }`}
              >
                📖 लेख
              </button>

              {blog.calculator?.enabled && (
                <button
                  onClick={() => setActiveTab('calculator')}
                  className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold ${
                    activeTab === 'calculator'
                      ? 'bg-emerald-700 text-white'
                      : 'text-slate-600'
                  }`}
                >
                  🧮 Calculator
                </button>
              )}
            </div>

            {/* ARTICLE */}
            {activeTab === 'article' && (
              <ArticleContent
                blog={blog}
                openFaq={openFaq}
                setOpenFaq={setOpenFaq}
              />
            )}

            {/* CALCULATOR */}
            {activeTab === 'calculator' && (
              <CalculatorSection
                blog={blog}
                landArea={landArea}
                setLandArea={setLandArea}
                landUnit={landUnit}
                setLandUnit={setLandUnit}
                calculatorData={calculatorData}
              />
            )}

            {/* FEEDBACK */}
            <section className="bg-white border border-slate-200 rounded-3xl p-6 text-center">

              <h3 className="font-black text-slate-900">
                क्या यह जानकारी उपयोगी लगी?
              </h3>

              <p className="text-xs text-slate-500 mt-1">
                आपकी प्रतिक्रिया से हम बेहतर कृषि सामग्री तैयार कर सकते हैं।
              </p>

              <div className="flex justify-center gap-3 mt-4">

                <button
                  onClick={() => handleFeedbackSubmit('yes')}
                  disabled={feedbackSubmitting || feedbackLoading}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
                    helpful === 'yes'
                      ? 'bg-emerald-700 text-white'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  उपयोगी ({feedbackCounts.helpful || 0})
                </button>

                <button
                  onClick={() => handleFeedbackSubmit('no')}
                  disabled={feedbackSubmitting || feedbackLoading}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
                    helpful === 'no'
                      ? 'bg-red-600 text-white'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  <ThumbsDown className="w-4 h-4" />
                  सुधार चाहिए ({feedbackCounts['needs-improvement'] || 0})
                </button>

              </div>
              {feedbackError && (
                <p role="alert" className="mt-3 text-xs text-red-600">{feedbackError}</p>
              )}
              {feedbackLoading && (
                <p className="mt-3 text-xs text-slate-500">प्रतिक्रिया लोड हो रही है...</p>
              )}
            </section>

            {/* COMMENTS */}
            <CommentsSection
              comments={comments}
              commentCount={commentCount}
              commentsLoading={commentsLoading}
              commentsError={commentsError}
              commentNotice={commentNotice}
              commentSubmitting={commentSubmitting}
              commentForm={commentForm}
              setCommentForm={setCommentForm}
              handleCommentSubmit={handleCommentSubmit}
            />

            {/* RELATED */}
            {relatedBlogs.length > 0 && (
              <section className="space-y-4">

                <h2 className="text-xl font-black text-slate-900">
                  इसी विषय के अन्य लेख
                </h2>

                <div className="grid sm:grid-cols-2 gap-4">

                  {relatedBlogs.map((related) => (
                    <Link
                      key={related.slug}
                      href={`/blog/${related.slug}`}
                      className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-emerald-400 hover:shadow-lg transition"
                    >
                      <div className="h-36 overflow-hidden">
                        <img
                          src={related.coverImage}
                          alt={related.title}
                          className="w-full h-full object-cover hover:scale-105 transition"
                        />
                      </div>

                      <div className="p-4">
                        <span className="text-[10px] text-emerald-700 font-bold">
                          {related.category}
                        </span>

                        <h3 className="font-black text-sm mt-1 line-clamp-2">
                          {related.title}
                        </h3>

                        <div className="text-[10px] text-slate-500 mt-3 flex gap-3">
                          <span>👁️ {formatNumber(related.views)}</span>
                          <span>👍 {formatNumber(related.likes)}</span>
                        </div>
                      </div>
                    </Link>
                  ))}

                </div>
              </section>
            )}

          </article>

          {/* RIGHT SIDEBAR */}
          <aside className="lg:col-span-4">

            <div className="lg:sticky lg:top-5 space-y-5">

              {/* TABLE OF CONTENTS */}
              {blog.content?.sections?.length > 0 && (
                <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

                  <h3 className="font-black text-slate-900 flex items-center gap-2">
                    <BookIcon />
                    इस लेख में
                  </h3>

                  <div className="space-y-1 mt-4">

                    {blog.content.sections.map((section, index) => (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                          activeSection === section.id
                            ? 'bg-emerald-100 text-emerald-900'
                            : 'hover:bg-slate-100 text-slate-600'
                        }`}
                      >
                        {index + 1}. {section.title}
                      </button>
                    ))}

                  </div>
                </section>
              )}

              {/* QUICK STATS */}
              <section className="bg-emerald-900 text-white rounded-2xl p-5">

                <h3 className="font-black">
                  लेख की जानकारी
                </h3>

                <div className="grid grid-cols-2 gap-3 mt-4">

                  <Stat
                    label="Views"
                    value={formatNumber(blog.views)}
                  />

                  <Stat
                    label="Likes"
                    value={formatNumber(likes)}
                  />

                  <Stat
                    label="Comments"
                    value={commentCount}
                  />

                  <Stat
                    label="Read"
                    value={`${blog.readTime} min`}
                  />

                </div>
              </section>

              {/* TAGS */}
              <section className="bg-white border border-slate-200 rounded-2xl p-5">

                <h3 className="font-black text-sm">
                  Related Tags
                </h3>

                <div className="flex flex-wrap gap-2 mt-3">

                  {blog.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full text-[10px] font-bold"
                    >
                      #{tag}
                    </span>
                  ))}

                </div>
              </section>

            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

/* =========================================================
   ARTICLE CONTENT
========================================================= */

function ArticleContent({ blog, openFaq, setOpenFaq }) {
  return (
    <article className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-9 shadow-sm">

      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 mb-7">
        <p className="text-sm sm:text-base text-emerald-950 leading-7 font-medium">
          {blog.content?.introduction}
        </p>
      </div>

      {blog.content?.sections?.map((section, index) => (
        <section
          key={section.id}
          id={section.id}
          className="scroll-mt-24 mb-10"
        >

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-start gap-3">
            <span className="w-8 h-8 shrink-0 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-sm">
              {index + 1}
            </span>

            {section.title}
          </h2>

          <div className="space-y-4 mt-5">

            {section.paragraphs?.map((paragraph, idx) => (
              <p
                key={idx}
                className="text-sm sm:text-base text-slate-700 leading-7"
              >
                {paragraph}
              </p>
            ))}

            {section.bullets?.length > 0 && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">

                <h4 className="font-black text-sm mb-3">
                  मुख्य बातें
                </h4>

                <ul className="space-y-3">
                  {section.bullets.map((bullet, idx) => (
                    <li
                      key={idx}
                      className="flex gap-3 text-sm text-slate-700"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

              </div>
            )}

          </div>
        </section>
      ))}

      {/* GALLERY */}
      {blog.galleryImages?.length > 0 && (
        <section className="mb-10">

          <h2 className="text-xl font-black text-slate-900 mb-4">
            📸 फोटो गैलरी
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">

            {blog.galleryImages.map((image, index) => (
              <div
                key={index}
                className="rounded-2xl overflow-hidden border border-slate-200"
              >
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-52 object-cover hover:scale-105 transition duration-500"
                />

                <p className="p-3 text-xs font-bold text-slate-600">
                  {image.title}
                </p>
              </div>
            ))}

          </div>
        </section>
      )}

      {/* SAFETY */}
      {blog.content?.safetyNote && (
        <section className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-10">

          <h3 className="font-black text-amber-950 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            महत्वपूर्ण सावधानी
          </h3>

          <p className="text-sm text-amber-900 leading-6 mt-2">
            {blog.content.safetyNote}
          </p>

        </section>
      )}

      {/* FAQ */}
      {blog.content?.faqs?.length > 0 && (
        <section>

          <h2 className="text-xl font-black text-slate-900 mb-4">
            अक्सर पूछे जाने वाले सवाल
          </h2>

          <div className="space-y-3">

            {blog.content.faqs.map((faq, index) => {
              const open = openFaq === index;

              return (
                <div
                  key={index}
                  className="border border-slate-200 rounded-2xl overflow-hidden"
                >

                  <button
                    onClick={() =>
                      setOpenFaq(open ? null : index)
                    }
                    className="w-full p-4 text-left flex justify-between gap-4 items-center"
                  >
                    <span className="font-bold text-sm text-slate-900">
                      {faq.question}
                    </span>

                    {open ? (
                      <ChevronUp className="w-4 h-4 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 shrink-0" />
                    )}
                  </button>

                  {open && (
                    <div className="px-4 pb-4 text-sm text-slate-600 leading-6">
                      {faq.answer}
                    </div>
                  )}

                </div>
              );
            })}

          </div>
        </section>
      )}
    </article>
  );
}

/* =========================================================
   CALCULATOR
========================================================= */

function CalculatorSection({
  blog,
  landArea,
  setLandArea,
  landUnit,
  setLandUnit,
  calculatorData,
}) {
  if (!blog.calculator?.enabled) {
    return null;
  }

  return (
    <section className="bg-white border border-emerald-200 rounded-3xl p-6 sm:p-8 shadow-sm">

      <div className="flex items-start gap-3">

        <div className="w-11 h-11 bg-emerald-100 text-emerald-800 rounded-xl flex items-center justify-center">
          <Calculator className="w-5 h-5" />
        </div>

        <div>
          <h2 className="text-xl font-black">
            खेत के क्षेत्रफल के अनुसार Calculator
          </h2>

          <p className="text-xs text-slate-500 mt-1">
            Base recommendation को आपके खेत के क्षेत्रफल के अनुसार scale किया गया है।
          </p>
        </div>
      </div>

      {/* INPUT */}
      <div className="grid sm:grid-cols-2 gap-4 mt-7">

        <div>
          <label className="text-xs font-bold text-slate-700">
            खेत का क्षेत्रफल
          </label>

          <input
            type="number"
            min="0.1"
            step="0.1"
            value={landArea}
            onChange={(e) =>
              setLandArea(
                Math.max(0.1, Number(e.target.value) || 0)
              )
            }
            className="w-full mt-2 px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700">
            क्षेत्रफल की इकाई
          </label>

          <select
            value={landUnit}
            onChange={(e) => setLandUnit(e.target.value)}
            className="w-full mt-2 px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="acre">एकड़</option>
            <option value="bigha">बीघा</option>
          </select>
        </div>

      </div>

      {/* QUICK AREA */}
      <div className="mt-4">

        <p className="text-[11px] font-bold text-slate-500 mb-2">
          Quick Select
        </p>

        <div className="flex flex-wrap gap-2">

          {[0.5, 1, 2, 3, 5, 10].map((value) => (
            <button
              key={value}
              onClick={() => setLandArea(value)}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-emerald-100 text-xs font-bold"
            >
              {value}
            </button>
          ))}

        </div>
      </div>

      {/* AREA SUMMARY */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-7">

        <SummaryCard
          label="Input Area"
          value={`${landArea || 0} ${landUnit === 'acre' ? 'एकड़' : 'बीघा'}`}
        />

        <SummaryCard
          label="लगभग Acre"
          value={`${calculatorData.acres.toFixed(2)} एकड़`}
        />

        <SummaryCard
          label="पानी"
          value={`${calculatorData.water.toFixed(0)} L`}
        />

      </div>

      {/* RESULT */}
      <div className="mt-7 border border-slate-200 rounded-2xl overflow-hidden">

        <div className="bg-slate-100 px-4 py-3 font-black text-sm">
          Calculated Requirement
        </div>

        <div className="divide-y divide-slate-100">

          {calculatorData.recommendations.map((item) => (
            <div
              key={item.name}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >

              <div>
                <h4 className="font-black text-sm">
                  {item.name}
                </h4>

                <p className="text-[11px] text-slate-500">
                  {item.type}
                </p>
              </div>

              <div className="text-emerald-800 font-black text-lg">
                {formatAmount(item.calculated)} {item.unit}
              </div>

            </div>
          ))}

          <div className="p-4 flex items-center justify-between">

            <div>
              <h4 className="font-black text-sm">
                पानी
              </h4>

              <p className="text-[11px] text-slate-500">
                Spray volume
              </p>
            </div>

            <div className="text-blue-700 font-black text-lg">
              {calculatorData.water.toFixed(0)} L
            </div>

          </div>

        </div>
      </div>

      <div className="mt-5 bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 leading-5">
        ⚠️ यह calculator केवल उपलब्ध base data को scale करता है। वास्तविक pesticide
        / fungicide dose हमेशा product label, crop stage और स्थानीय कृषि विशेषज्ञ की
        सलाह के अनुसार तय करें।
      </div>

    </section>
  );
}

/* =========================================================
   COMMENTS
========================================================= */

function CommentsSection({
  comments,
  commentCount,
  commentsLoading,
  commentsError,
  commentNotice,
  commentSubmitting,
  commentForm,
  setCommentForm,
  handleCommentSubmit,
}) {
  return (
    <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8">

      <div className="flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-emerald-700" />

        <h2 className="text-xl font-black">
          किसान चर्चा
        </h2>

        <span className="text-xs text-slate-500">
          ({commentCount})
        </span>
      </div>

      <form
        onSubmit={handleCommentSubmit}
        className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mt-5 space-y-3"
      >

        <div className="grid sm:grid-cols-2 gap-3">

          <input
            required
            value={commentForm.name}
            onChange={(e) =>
              setCommentForm({
                ...commentForm,
                name: e.target.value,
              })
            }
            placeholder="आपका नाम"
            className="bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-xs outline-none"
          />

          <input
            value={commentForm.location}
            onChange={(e) =>
              setCommentForm({
                ...commentForm,
                location: e.target.value,
              })
            }
            placeholder="गांव / जिला"
            className="bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-xs outline-none"
          />

        </div>

        <textarea
          required
          rows={4}
          value={commentForm.text}
          onChange={(e) =>
            setCommentForm({
              ...commentForm,
              text: e.target.value,
            })
          }
          placeholder="अपना सवाल या अनुभव लिखें..."
          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-3 text-xs outline-none"
        />

        <button
          type="submit"
          disabled={commentSubmitting}
          className="bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2"
        >
          {commentSubmitting ? 'भेज रहे हैं...' : 'टिप्पणी भेजें'}
          <Send className="w-4 h-4" />
        </button>
        {commentsError && (
          <p role="alert" className="text-xs text-red-600">{commentsError}</p>
        )}
        {commentNotice && (
          <p role="status" className="text-xs text-emerald-700">{commentNotice}</p>
        )}
      </form>

      <div className="mt-6 space-y-4">

        {commentsLoading && (
          <p className="text-sm text-slate-500">टिप्पणियां लोड हो रही हैं...</p>
        )}
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="border-b border-slate-100 pb-4"
          >

            <div className="flex items-center justify-between gap-3">

              <div className="flex items-center gap-2">

                <div className="w-9 h-9 bg-emerald-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-emerald-700" />
                </div>

                <div>
                  <p className="text-xs font-black">
                    {comment.name}
                  </p>

                  {comment.location && (
                    <p className="text-[10px] text-slate-500">
                      {comment.location}
                    </p>
                  )}
                </div>

              </div>

              <span className="text-[10px] text-slate-400">
                {comment.date}
              </span>

            </div>

            <p className="text-sm text-slate-700 leading-6 mt-3">
              {comment.text}
            </p>
            {comment.answer && (
              <div className="mt-3 rounded-xl border border-emerald-100 bg-emerald-50 p-3">
                <p className="text-xs font-bold text-emerald-800">कृषि मित्र का जवाब</p>
                <p className="mt-1 text-sm leading-6 text-emerald-900">{comment.answer}</p>
              </div>
            )}

          </div>
        ))}
        {!commentsLoading && !commentsError && comments.length === 0 && (
          <p className="text-sm text-slate-500">अभी तक कोई टिप्पणी नहीं है।</p>
        )}

      </div>
    </section>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function Stat({ label, value }) {
  return (
    <div className="bg-white/10 rounded-xl p-3">
      <div className="text-lg font-black">{value}</div>
      <div className="text-[10px] text-emerald-200">
        {label}
      </div>
    </div>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
      <div className="text-[10px] text-slate-500 font-bold">
        {label}
      </div>

      <div className="text-sm font-black text-slate-900 mt-1">
        {value}
      </div>
    </div>
  );
}

function formatNumber(value) {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }

  return value;
}

function formatAmount(value) {
  if (value >= 1000) {
    return value.toFixed(0);
  }

  return value.toFixed(1);
}

function CalendarIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
    </svg>
  );
}