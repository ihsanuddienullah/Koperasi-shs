import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#eaf7ed] via-[#f0fdf4] to-[#fffbeb] px-4 py-16 md:py-24">
      {/* Decorative blobs */}
      <div
        className="pointer-events-none absolute -top-20 -left-20 h-80 w-80 rounded-full opacity-40"
        style={{ background: 'radial-gradient(circle, #d8f3dc 0%, transparent 70%)' }}
      />
      <div
        className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full opacity-30"
        style={{ background: 'radial-gradient(circle, #fef3c7 0%, transparent 70%)' }}
      />

      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-12 md:flex-row md:items-center">
        {/* Text */}
        <div className="flex-1 text-center md:text-left">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#d8f3dc] bg-white/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#d97706] backdrop-blur-sm">
            <span className="text-[#d97706]">✦</span>
            Platform Koperasi Digital
          </div>

          <h1
            className="text-3xl font-extrabold leading-tight tracking-tight text-[#1a4d2e] md:text-5xl"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.02em' }}
          >
            Belanja Produk{' '}
            <span className="relative">
              <span className="relative z-10 text-[#2d6a4f]">Lokal</span>
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
            Terbaik
          </h1>

          <p
            className="mt-5 text-base leading-relaxed text-[#4b5563] md:text-lg"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Temukan produk unggulan dari anggota Koperasi Selaras Harmoni Sejahtera.
            Mendukung ekonomi lokal, satu produk dalam satu waktu.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row md:justify-start">
            <Link
              to="/produk"
              className="flex items-center gap-2 rounded-full bg-[#2d6a4f] px-7 py-3 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(45,106,79,0.30)] transition-all hover:bg-[#40916c] hover:shadow-[0_6px_24px_rgba(45,106,79,0.35)]"
            >
              Lihat Produk
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/tentang"
              className="rounded-full border-[1.5px] border-[#74c69d] bg-white px-7 py-3 text-sm font-semibold text-[#2d6a4f] transition-all hover:bg-[#eaf7ed]"
            >
              Tentang Kami
            </Link>
          </div>
        </div>

        {/* Decorative card grid (hidden on mobile) */}
        <div className="hidden flex-shrink-0 md:block">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Produk Segar', color: '#eaf7ed', accent: '#2d6a4f' },
              { label: 'Kerajinan', color: '#fef3c7', accent: '#d97706' },
              { label: 'Makanan', color: '#d8f3dc', accent: '#40916c' },
              { label: 'Minuman', color: '#fef9c3', accent: '#b45309' },
            ].map(({ label, color, accent }) => (
              <div
                key={label}
                className="flex h-28 w-32 flex-col items-center justify-center gap-2 rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
                style={{ backgroundColor: color }}
              >
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full"
                  style={{ backgroundColor: accent + '22' }}
                >
                  <div
                    className="h-5 w-5 rounded-full"
                    style={{ backgroundColor: accent }}
                  />
                </div>
                <span
                  className="text-xs font-semibold"
                  style={{ color: accent, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
