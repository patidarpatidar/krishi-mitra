"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
} from "lucide-react";

export default function HomeCarousel({ slides = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const safeIndex = Math.min(activeIndex, slides.length - 1);
  const activeSlide = slides[safeIndex];

  const nextSlide = () => {
    setActiveIndex((current) =>
      current >= slides.length - 1 ? 0 : current + 1
    );
  };

  const previousSlide = () => {
    setActiveIndex((current) =>
      current === 0 ? slides.length - 1 : current - 1
    );
  };

  useEffect(() => {
    setActiveIndex((current) => Math.min(current, slides.length - 1));
  }, [slides.length]);

  useEffect(() => {
    if (paused || slides.length <= 1) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [paused, slides.length]);

  if (!slides.length) return null;

  return (
    <section
      className="
        relative
        overflow-hidden
        rounded-[2rem]
        shadow-2xl
        min-h-[440px]
        sm:min-h-[500px]
      "
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        {activeSlide.image ? (
          <img
            src={activeSlide.image}
            alt=""
            className="w-full h-full object-cover transition-all duration-700"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-emerald-900 via-teal-800 to-slate-900" />
        )}

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-emerald-900/70 to-slate-950/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-[440px] sm:min-h-[500px] flex items-center">
        <div className="max-w-7xl w-full mx-auto px-6 sm:px-10 lg:px-14 py-12">

          <div className="max-w-2xl text-white">

            {/* Badge */}
            <div
              className="
                inline-flex
                items-center
                bg-amber-400
                text-slate-950
                px-4 py-2
                rounded-full
                text-xs
                sm:text-sm
                font-extrabold
                shadow-lg
                mb-5
              "
            >
              {activeSlide.badge}
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight">
              {activeSlide.title}
              {activeSlide.highlight && (
                <span className="block text-amber-300 mt-2">
                  {activeSlide.highlight}
                </span>
              )}
            </h1>

            {/* Description */}
            <p className="mt-5 text-sm sm:text-base text-emerald-50/90 leading-relaxed max-w-xl">
              {activeSlide.description}
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-3 mt-7">

              <Link
                href={activeSlide.primaryButton.href}
                className="
                  inline-flex
                  items-center
                  gap-2
                  bg-amber-400
                  hover:bg-amber-300
                  text-slate-950
                  px-5 py-3
                  rounded-xl
                  text-sm
                  font-black
                  shadow-xl
                  hover:-translate-y-0.5
                  transition
                "
              >
                {activeSlide.primaryButton.text}
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href={activeSlide.secondaryButton.href}
                className="
                  inline-flex
                  items-center
                  gap-2
                  bg-white/10
                  hover:bg-white/20
                  backdrop-blur-md
                  border border-white/30
                  text-white
                  px-5 py-3
                  rounded-xl
                  text-sm
                  font-bold
                  transition
                "
              >
                {activeSlide.secondaryButton.text}
              </Link>

            </div>
          </div>
        </div>
      </div>

      {/* Previous */}
      {slides.length > 1 && <button
        onClick={previousSlide}
        className="
          absolute
          left-4
          top-1/2
          -translate-y-1/2
          z-20
          w-10 h-10
          rounded-full
          bg-white/15
          hover:bg-white/30
          backdrop-blur-md
          border border-white/20
          text-white
          flex items-center justify-center
          transition
        "
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>}

      {/* Next */}
      {slides.length > 1 && <button
        onClick={nextSlide}
        className="
          absolute
          right-4
          top-1/2
          -translate-y-1/2
          z-20
          w-10 h-10
          rounded-full
          bg-white/15
          hover:bg-white/30
          backdrop-blur-md
          border border-white/20
          text-white
          flex items-center justify-center
          transition
        "
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>}

      {/* Bottom Controls */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">

        {/* Dots */}
        {slides.length > 1 && <div className="flex items-center gap-1.5 bg-black/20 backdrop-blur-md px-3 py-2 rounded-full">
          {slides.map((slide, index) => (
            <button
              key={slide.id || index}
              onClick={() => setActiveIndex(index)}
              className={`
                h-2 rounded-full transition-all
                ${
                  index === safeIndex
                    ? "w-7 bg-amber-400"
                    : "w-2 bg-white/60 hover:bg-white"
                }
              `}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>}

        {/* Pause */}
        {slides.length > 1 && <button
          onClick={() => setPaused(!paused)}
          className="
            w-8 h-8
            rounded-full
            bg-black/20
            backdrop-blur-md
            border border-white/20
            text-white
            flex items-center justify-center
          "
        >
          {paused ? (
            <Play className="w-3.5 h-3.5" />
          ) : (
            <Pause className="w-3.5 h-3.5" />
          )}
        </button>}
      </div>

      {/* Slide counter */}
      <div className="absolute right-5 bottom-5 z-20 hidden sm:block">
        <span className="text-xs font-bold text-white/80 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full">
          {safeIndex + 1} / {slides.length}
        </span>
      </div>
    </section>
  );
}