import { Link } from '@tanstack/react-router'

export function Footer() {
  return (
    <footer className="bg-[#1a6b3c] px-4 py-10 text-white">
      <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-3">
        <div>
          <p className="text-lg font-bold">SHS</p>
          <p className="mt-2 text-sm text-white/70">
            Bersama Tumbuh, Bersama Sejahtera
          </p>
        </div>
        <div>
          <p className="mb-2 font-semibold">Navigasi</p>
          <div className="flex flex-col gap-1 text-sm text-white/70">
            <Link to="/" className="hover:text-white">
              Beranda
            </Link>
            <Link to="/produk" className="hover:text-white">
              Produk
            </Link>
            <Link to="/tentang" className="hover:text-white">
              Tentang
            </Link>
          </div>
        </div>
        <div>
          <p className="mb-2 font-semibold">Seller</p>
          <Link
            to="/seller/login"
            className="text-sm text-white/70 hover:text-white"
          >
            Login sebagai Seller
          </Link>
        </div>
      </div>
      <div className="mx-auto mt-8 max-w-6xl border-t border-white/20 pt-4 text-center text-xs text-white/50">
        © 2026 Koperasi Selaras Harmoni Sejahtera
      </div>
    </footer>
  )
}
