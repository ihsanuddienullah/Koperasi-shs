import { Link } from '@tanstack/react-router'

export function Footer() {
  return (
    <footer className="bg-[#0a2218] px-4 py-12 text-white">
      <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-3">
        <div>
          <p className="text-lg font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Koperasi <span className="text-[#d97706]">SHS</span>
          </p>
          <p className="mt-2 text-sm leading-relaxed text-white/60">
            Bersama Tumbuh, Bersama Sejahtera
          </p>
          <p className="mt-1 text-sm text-white/40">
            Platform Koperasi Digital Indonesia
          </p>
        </div>
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/40">
            Navigasi
          </p>
          <div className="flex flex-col gap-2 text-sm">
            <Link to="/" className="text-white/60 transition-colors hover:text-white">
              Beranda
            </Link>
            <Link to="/produk" className="text-white/60 transition-colors hover:text-white">
              Produk
            </Link>
            <Link to="/tentang" className="text-white/60 transition-colors hover:text-white">
              Tentang Kami
            </Link>
          </div>
        </div>
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/40">
            Seller
          </p>
          <div className="flex flex-col gap-2 text-sm">
            <Link to="/seller/login" className="text-white/60 transition-colors hover:text-white">
              Masuk Seller
            </Link>
            <Link to="/seller/register" className="text-white/60 transition-colors hover:text-white">
              Daftar sebagai Seller
            </Link>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-6xl border-t border-white/10 pt-6 text-center text-xs text-white/30">
        © 2026 Koperasi Selaras Harmoni Sejahtera. Hak cipta dilindungi.
      </div>
    </footer>
  )
}
