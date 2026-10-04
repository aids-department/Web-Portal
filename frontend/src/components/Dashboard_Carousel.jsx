import { useState, useEffect } from "react";

export default function Carousel({ slides: propSlides = [], onSelect }) {
  // If no slides passed, fallback to sample placeholders
  const defaultSlides = [
    { id: 1, img: "/img1.jpg" },
    { id: 2, img: "/img2.jpg" },
    { id: 3, img: "/img3.jpg" },
  ];

  // Normalize slides: allow either string (img) or object {img, page}
  const slides =
    propSlides && propSlides.length > 0
      ? propSlides.map((s, i) =>
          typeof s === "string" ? { id: i, img: s } : { id: i, ...s }
        )
      : defaultSlides;

  const [current, setCurrent] = useState(0);

  // optional auto-play
  useEffect(() => {
    const t = setInterval(() => {
      setCurrent((c) => (c === slides.length - 1 ? 0 : c + 1));
    }, 5000);
    return () => clearInterval(t);
  }, [slides.length]);

  const prevSlide = () => setCurrent((c) => (c === 0 ? slides.length - 1 : c - 1));
  const nextSlide = () => setCurrent((c) => (c === slides.length - 1 ? 0 : c + 1));

  return (
    <div className="relative h-64 w-full overflow-hidden rounded-2xl border border-line bg-canvas-elevated shadow-card">

      {/* Slides */}
      <div
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="w-full flex-shrink-0 h-64 relative">
            <img
              src={slide.img}
              className="w-full object-cover h-64 cursor-pointer"
              alt="carousel slide"
              onClick={() => onSelect && slide.page && onSelect(slide.page)}
            />
            {/* Invisible overlay button for accessibility when slide has page */}
            {slide.page ? (
              <button
                onClick={() => onSelect && onSelect(slide.page)}
                aria-label={`Open ${slide.page}`}
                className="absolute inset-0"
                style={{ background: 'transparent', border: 0 }}
              />
            ) : null}
          </div>
        ))}
      </div>

      {/* Prev Button */}
      <button
        onClick={prevSlide}
        aria-label="Previous"
        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-canvas/60 p-3 text-fg backdrop-blur-xl transition-colors hover:bg-canvas/80"
      >
        ‹
      </button>

      {/* Next Button */}
      <button
        onClick={nextSlide}
        aria-label="Next"
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-canvas/60 p-3 text-fg backdrop-blur-xl transition-colors hover:bg-canvas/80"
      >
        ›
      </button>

      {/* Indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === current ? "w-6 bg-accent-bright" : "w-1.5 bg-white/30"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
