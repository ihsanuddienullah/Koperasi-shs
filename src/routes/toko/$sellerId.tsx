import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/toko/$sellerId')({
  component: () => <div>Toko Seller — akan dibangun di Prompt 2</div>,
})
