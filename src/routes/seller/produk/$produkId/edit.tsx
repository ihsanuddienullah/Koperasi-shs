import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/seller/produk/$produkId/edit')({
  component: () => <div>Edit Produk — akan dibangun di Prompt 2</div>,
})
