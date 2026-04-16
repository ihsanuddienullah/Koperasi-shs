import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/produk/$produkId')({
  component: () => <div>Detail Produk — akan dibangun di Prompt 2</div>,
})
