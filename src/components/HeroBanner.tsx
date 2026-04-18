import { Link } from '@tanstack/react-router'

export function HeroBanner() {
  return (
    <section className="bg-gradient-to-br from-[#1a6b3c] to-[#2d8f5e] px-4 py-16 text-center md:py-24">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-white md:text-5xl">
          Koperasi Selaras Harmoni Sejahtera
        </h1>
        <p className="mt-4 text-lg text-white/80">
          Bersama Tumbuh, Bersama Sejahtera
        </p>
        <Link
          to="/produk"
          className="mt-8 inline-block rounded-full bg-white px-8 py-3 font-semibold text-[#1a6b3c] transition-colors hover:bg-white/90"
        >
          Lihat Produk
        </Link>
      </div>
    </section>
  )
}
