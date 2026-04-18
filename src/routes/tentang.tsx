import { createFileRoute, Link } from '@tanstack/react-router'
import { Users, Eye, Lightbulb, Leaf } from 'lucide-react'
import { Card, CardContent } from '#/components/ui/card'

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
  },
  {
    icon: Eye,
    title: 'Transparansi',
    desc: 'Keterbukaan dalam setiap proses dan keputusan.',
  },
  {
    icon: Lightbulb,
    title: 'Inovasi',
    desc: 'Terus berinovasi menggunakan teknologi untuk memberdayakan anggota.',
  },
  {
    icon: Leaf,
    title: 'Keberlanjutan',
    desc: 'Membangun ekonomi yang berkelanjutan untuk generasi mendatang.',
  },
]

function TentangPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold">Tentang Koperasi SHS</h1>

      <section className="mt-8">
        <p className="text-muted-foreground leading-relaxed">
          Koperasi Selaras Harmoni Sejahtera (SHS) adalah koperasi digital yang
          menghubungkan para anggota dengan pembeli secara langsung melalui
          platform online. Kami percaya bahwa teknologi dapat menjadi jembatan
          untuk memajukan ekonomi kerakyatan dan memberdayakan setiap anggota.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Visi</h2>
        <p className="mt-2 text-muted-foreground leading-relaxed">
          Menjadi koperasi digital terdepan yang memberdayakan seluruh anggota
          untuk tumbuh dan sejahtera bersama.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Misi</h2>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-muted-foreground">
          <li>
            Menyediakan platform digital bagi anggota untuk memasarkan produk
          </li>
          <li>
            Membangun jaringan ekonomi koperasi yang transparan dan adil
          </li>
          <li>
            Meningkatkan kesejahteraan anggota melalui teknologi
          </li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-semibold">Nilai-Nilai Kami</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {NILAI.map((item) => (
            <Card key={item.title}>
              <CardContent className="flex items-start gap-3 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#e8f5e9]">
                  <item.icon className="h-5 w-5 text-[#1a6b3c]" />
                </div>
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.desc}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-12 rounded-xl bg-[#e8f5e9] p-8 text-center">
        <h2 className="text-xl font-semibold">
          Tertarik bergabung sebagai seller?
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Daftarkan toko Anda dan mulai jual produk ke seluruh anggota dan
          pembeli.
        </p>
        <Link
          to="/seller/login"
          className="mt-4 inline-block rounded-full bg-[#1a6b3c] px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#2d8f5e]"
        >
          Daftar Sekarang
        </Link>
      </section>
    </div>
  )
}
