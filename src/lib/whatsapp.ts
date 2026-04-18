export function buildWhatsAppUrl(nomorWa: string, namaProduk: string, harga: number): string {
  const cleaned = nomorWa.replace(/\D/g, '')
  const formatted = cleaned.startsWith('0') ? '62' + cleaned.slice(1) : cleaned
  const hargaFormatted = harga.toLocaleString('id-ID')
  const text = encodeURIComponent(
    `Halo kak, saya tertarik dengan produk *${namaProduk}* (Rp${hargaFormatted}). Apakah masih tersedia? Terima kasih 🙏`
  )
  return `https://wa.me/${formatted}?text=${text}`
}
