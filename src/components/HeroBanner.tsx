import { Link } from '@tanstack/react-router'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

const PROMOS = [
  {
    id: 1,
    badge: '✦ PRODUK TERLARIS',
    title: 'Madu Hutan Asli 500ml',
    subtitle: 'Madu hutan murni dari lebah liar, dipanen langsung dari hutan Kalimantan. Tanpa campuran, tanpa pengawet. Khasiat terjamin untuk kesehatan.',
    ctaText: 'Detail Produk',
    ctaLink: '/produk/madu-hutan-asli-500ml',
    gradient: 'from-[#eaf7ed] via-[#f0fdf4] to-[#fffbeb]',
    badgeBg: 'border-[#d8f3dc] bg-white/70 text-[#d97706]',
    buttonBg: 'bg-[#2d6a4f] text-white hover:bg-[#40916c] shadow-[0_4px_16px_rgba(45,106,79,0.30)] hover:shadow-[0_6px_24px_rgba(45,106,79,0.35)]',
    secButtonBorder: 'border-[#74c69d] text-[#2d6a4f] hover:bg-[#eaf7ed]',
    imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80',
    price: 'Rp 85.000'
  },
  {
    id: 2,
    badge: '✦ KERAJINAN TANGAN',
    title: 'Tas Anyaman Rotan Premium',
    subtitle: 'Tas anyaman rotan handmade, desain modern minimalis. Cocok untuk gaya kasual maupun formal. Tali kulit sintetis premium.',
    ctaText: 'Lihat Detail',
    ctaLink: '/produk/tas-anyaman-rotan-premium',
    gradient: 'from-[#fff7ed] via-[#fffbeb] to-[#fafaf9]',
    badgeBg: 'border-[#fed7aa] bg-white/70 text-[#c2410c]',
    buttonBg: 'bg-[#c2410c] text-white hover:bg-[#ea580c] shadow-[0_4px_16px_rgba(194,65,12,0.30)] hover:shadow-[0_6px_24px_rgba(194,65,12,0.35)]',
    secButtonBorder: 'border-[#fdba74] text-[#c2410c] hover:bg-[#fff7ed]',
    imageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=600&q=80',
    price: 'Rp 175.000'
  },
  {
    id: 3,
    badge: '✦ PERTANIAN ORGANIK',
    title: 'Beras Organik 5kg',
    subtitle: 'Beras organik putih varietas Mentik Wangi. Ditanam tanpa pestisida kimia. Tekstur pulen, aroma harum alami. Sertifikasi organik Indonesia.',
    ctaText: 'Detail Produk',
    ctaLink: '/produk/beras-organik-5kg',
    gradient: 'from-[#ecfeff] via-[#f0fdf4] to-[#fffbeb]',
    badgeBg: 'border-[#c5f6fa] bg-white/70 text-[#0891b2]',
    buttonBg: 'bg-[#0891b2] text-white hover:bg-[#06b6d4] shadow-[0_4px_16px_rgba(8,145,178,0.30)] hover:shadow-[0_6px_24px_rgba(8,145,178,0.35)]',
    secButtonBorder: 'border-[#67e8f9] text-[#0891b2] hover:bg-[#ecfeff]',
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
    price: 'Rp 95.000'
  }
]

export function HeroBanner() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % PROMOS.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + PROMOS.length) % PROMOS.length)
  }

  useEffect(() => {
    if (!isPaused) {
      autoplayTimerRef.current = setInterval(() => {
        nextSlide()
      }, 5000)
    }

    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current)
      }
    }
  }, [isPaused])

  return (
    <section 
      className="relative overflow-hidden transition-all duration-700 ease-in-out px-4 py-16 md:py-24"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Dynamic Background Gradients */}
      {PROMOS.map((promo, idx) => (
        <div
          key={promo.id}
          className={`absolute inset-0 bg-gradient-to-br ${promo.gradient} transition-opacity duration-1000 ease-in-out`}
          style={{ opacity: idx === currentIndex ? 1 : 0 }}
        />
      ))}

      {/* Decorative blobs */}
      <div
        className="pointer-events-none absolute -top-20 -left-20 h-80 w-80 rounded-full opacity-40 transition-all duration-700"
        style={{ 
          background: currentIndex === 0 
            ? 'radial-gradient(circle, #d8f3dc 0%, transparent 70%)' 
            : currentIndex === 1
            ? 'radial-gradient(circle, #fed7aa 0%, transparent 70%)'
            : 'radial-gradient(circle, #c5f6fa 0%, transparent 70%)'
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full opacity-30 transition-all duration-700"
        style={{ 
          background: currentIndex === 0 
            ? 'radial-gradient(circle, #fef3c7 0%, transparent 70%)' 
            : currentIndex === 1
            ? 'radial-gradient(circle, #fee2e2 0%, transparent 70%)'
            : 'radial-gradient(circle, #fef9c3 0%, transparent 70%)'
        }}
      />

      {/* Slider Container */}
      <div className="relative mx-auto max-w-6xl overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {PROMOS.map((promo) => (
            <div key={promo.id} className="w-full flex-shrink-0 flex flex-col items-center gap-12 md:flex-row md:items-center">
              {/* Text */}
              <div className="flex-1 text-center md:text-left min-h-[320px] flex flex-col justify-center">
                <div>
                  <div className={`mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm ${promo.badgeBg}`}>
                    <span>✦</span>
                    {promo.badge}
                  </div>
                </div>

                <h1
                  className="text-3xl font-extrabold leading-tight tracking-tight text-[#1a4d2e] md:text-5xl"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.02em' }}
                >
                  {promo.id === 1 ? (
                    <>
                      Madu Hutan{' '}
                      <span className="relative">
                        <span className="relative z-10 text-[#2d6a4f]">Asli</span>
                        <svg
                          className="absolute -bottom-1 left-0 w-full"
                          viewBox="0 0 200 8"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M1 5.5C40 1 80 7 120 3.5C160 0 190 6 199 4"
                            stroke="#d97706"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </span>{' '}
                      Kalimantan
                    </>
                  ) : promo.title}
                </h1>

                <p
                  className="mt-5 text-base leading-relaxed text-[#4b5563] md:text-lg max-w-xl mx-auto md:mx-0"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {promo.subtitle}
                </p>

                <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row md:justify-start">
                  <Link
                    to={promo.ctaLink}
                    className={`flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold transition-all duration-300 ${promo.buttonBg}`}
                  >
                    {promo.ctaText}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    to="/tentang"
                    className={`rounded-full border-[1.5px] bg-white px-7 py-3 text-sm font-semibold transition-all duration-300 ${promo.secButtonBorder}`}
                  >
                    Tentang Kami
                  </Link>
                </div>
              </div>

              {/* Product Image Card (hidden on mobile) */}
              <div className="relative hidden md:block w-[300px] h-[300px] flex-shrink-0">
                {/* Background soft glow */}
                <div 
                  className="absolute inset-0 rounded-[2.5rem] opacity-35 blur-2xl transition-all duration-700"
                  style={{ 
                    background: `radial-gradient(circle, ${promo.id === 1 ? '#2d6a4f' : promo.id === 2 ? '#c2410c' : '#0891b2'} 0%, transparent 70%)` 
                  }}
                />
                
                {/* Main Glassmorphic Photo Card */}
                <Link
                  to={promo.ctaLink}
                  className="relative block w-full h-full rounded-[2rem] overflow-hidden border border-white/60 bg-white/20 backdrop-blur-md shadow-[0_12px_32px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_48px_rgba(0,0,0,0.12)] hover:scale-[1.03] transition-all duration-500 group cursor-pointer"
                >
                  <img
                    src={promo.imageUrl}
                    alt={promo.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="eager"
                  />
                  
                  {/* Glassmorphic Price Tag overlay */}
                  <div className="absolute bottom-4 right-4 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2 text-sm font-bold text-white shadow-md">
                    {promo.price}
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 hidden md:flex h-12 w-12 items-center justify-center rounded-full border border-gray-200/50 bg-white/40 text-gray-800 backdrop-blur-md transition-all hover:bg-white/80 hover:scale-110 active:scale-95 shadow-sm cursor-pointer z-20 group"
      >
        <ChevronLeft className="h-6 w-6 transition-transform group-hover:-translate-x-0.5" />
      </button>
      <button
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex h-12 w-12 items-center justify-center rounded-full border border-gray-200/50 bg-white/40 text-gray-800 backdrop-blur-md transition-all hover:bg-white/80 hover:scale-110 active:scale-95 shadow-sm cursor-pointer z-20 group"
      >
        <ChevronRight className="h-6 w-6 transition-transform group-hover:translate-x-0.5" />
      </button>

      {/* Indicator Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {PROMOS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
              idx === currentIndex 
                ? 'w-8 bg-[#2d6a4f]' 
                : 'w-2.5 bg-gray-400/50 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
