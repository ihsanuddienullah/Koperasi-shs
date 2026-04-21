import { createFileRoute, Link } from '@tanstack/react-router'
import { Users, Eye, Lightbulb, Leaf } from 'lucide-react'

export const Route = createFileRoute('/tentang')({
  head: () => ({
    meta: [
      { title: 'Tentang — Koperasi SHS' },
      {
        name: 'description',
        content:
          'Koperasi Selaras Harmoni Sejahtera (SHS) adalah koperasi digital yang menghubungkan para anggota dengan pembeli secara langsung.',
      },
    ],
  }),
  component: TentangPage,
})

const NILAI = [
  {
    icon: Users,
    title: 'Kebersamaan',
    desc: 'Saling mendukung dan bekerja sama untuk kemajuan bersama.',
    bg: '#eaf7ed',
    iconColor: '#2d6a4f',
  },
  {
    icon: Eye,
    title: 'Transparansi',
    desc: 'Keterbukaan dalam setiap proses dan keputusan.',
    bg: '#fef3c7',
    iconColor: '#d97706',
  },
  {
    icon: Lightbulb,
    title: 'Inovasi',
    desc: 'Terus berinovasi menggunakan teknologi untuk memberdayakan anggota.',
    bg: '#d8f3dc',
    iconColor: '#40916c',
  },
  {
    icon: Leaf,
    title: 'Keberlanjutan',
    desc: 'Membangun ekonomi yang berkelanjutan untuk generasi mendatang.',
    bg: '#fef9c3',
    iconColor: '#b45309',
  },
]

function TentangPage() {
  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#eaf7ed] via-[#f0fdf4] to-white px-4 py-16 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#d8f3dc] bg-white/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#d97706]">
            <span>✦</span>
            Tentang Kami
          </div>
          <h1
            className="text-3xl font-extrabold leading-tight text-[#1a4d2e] md:text-4xl"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.02em' }}
          >
            Koperasi{' '}
            <span className="text-[#2d6a4f]">Selaras</span> Harmoni Sejahtera
          </h1>
          <p
            className="mt-5 text-base leading-relaxed text-[#4b5563] md:text-lg"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Koperasi digital yang menghubungkan para anggota dengan pembeli secara langsung
            melalui platform online. Kami percaya teknologi dapat menjadi jembatan untuk
            memajukan ekonomi kerakyatan dan memberdayakan setiap anggota.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-12 md:px-6">
        {/* Visi Misi */}
        <div className="mb-12 grid gap-6 md:grid-cols-2">
          {[
            {
              label: 'Visi',
              content:
                'Menjadi koperasi digital terdepan yang memberdayakan seluruh anggota untuk tumbuh dan sejahtera bersama.',
            },
            {
              label: 'Misi',
              content: null,
              list: [
                'Menyediakan platform digital bagi anggota untuk memasarkan produk',
                'Membangun jaringan ekonomi koperasi yang transparan dan adil',
                'Meningkatkan kesejahteraan anggota melalui teknologi',
              ],
            },
          ].map(({ label, content, list }) => (
            <div
              key={label}
              className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)]"
            >
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#d97706]">
                ✦ {label}
              </p>
              {content && (
                <p
                  className="text-sm leading-relaxed text-[#4b5563]"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {content}
                </p>
              )}
              {list && (
                <ul className="space-y-2">
                  {list.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-[#4b5563]">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2d6a4f]" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Nilai-nilai */}
        <div className="mb-12">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#d97706]">
            ✦ Fondasi Kami
          </p>
          <h2
            className="mb-6 text-xl font-extrabold text-[#1a4d2e]"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Nilai-Nilai Kami
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {NILAI.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)]"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                    style={{ backgroundColor: item.bg }}
                  >
                    <item.icon className="h-5 w-5" style={{ color: item.iconColor }} />
                  </div>
                  <p
                    className="font-semibold text-[#111827]"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    {item.title}
                  </p>
                </div>
                <p
                  className="text-sm leading-relaxed text-[#4b5563]"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <section
          className="overflow-hidden rounded-2xl px-8 py-12 text-center text-white"
          style={{ background: 'linear-gradient(135deg, #2d6a4f 0%, #1a4d2e 100%)' }}
        >
          <h2
            className="text-xl font-extrabold md:text-2xl"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Tertarik bergabung sebagai seller?
          </h2>
          <p
            className="mx-auto mt-2 max-w-md text-sm text-white/70"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Daftarkan toko Anda dan mulai jual produk ke seluruh anggota dan pembeli.
          </p>
          <Link
            to="/seller/register"
            className="mt-6 inline-block rounded-full bg-[#d97706] px-8 py-3 text-sm font-bold text-white shadow-[0_4px_16px_rgba(217,119,6,0.40)] transition-all hover:bg-[#b45309]"
          >
            Daftar Sekarang
          </Link>
        </section>
      </div>
    </div>
  )
}
