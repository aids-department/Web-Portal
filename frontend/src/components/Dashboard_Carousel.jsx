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
    <div className="relative w-full h-64 overflow-hidden rounded-2xl shadow-lg bg-gray-50">

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
        className="absolute top-1/2 left-3 -translate-y-1/2 bg-transparent hover:bg-white/10 text-white p-3 rounded-full"
      >
        ‹
      </button>

      {/* Next Button */}
      <button
        onClick={nextSlide}
        aria-label="Next"
        className="absolute top-1/2 right-3 -translate-y-1/2 bg-transparent hover:bg-white/10 text-white p-3 rounded-full"
      >
        ›
      </button>

      {/* Indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full ${
              index === current ? "bg-white" : "bg-white/40"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
