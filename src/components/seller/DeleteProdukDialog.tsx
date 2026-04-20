import { useState } from 'react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import { Button } from '#/components/ui/button'
import { softDeleteProduk } from '#/server/produk'

type DeleteProdukDialogProps = {
  produkId: string
  namaProduk: string
  onDeleted: () => void
  children: React.ReactNode
}

export function DeleteProdukDialog({
  produkId,
  namaProduk,
  onDeleted,
  children,
}: DeleteProdukDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    try {
      await softDeleteProduk({ data: { id: produkId } })
      toast.success(`"${namaProduk}" berhasil dihapus`)
      setOpen(false)
      onDeleted()
    } catch {
      toast.error('Gagal menghapus produk')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <span onClick={() => setOpen(true)}>{children}</span>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hapus Produk</DialogTitle>
          <DialogDescription>
            Yakin ingin menghapus <strong>"{namaProduk}"</strong>? Produk tidak akan tampil di
            publik, tetapi data klik WhatsApp tetap tersimpan.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Batal
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? 'Menghapus...' : 'Hapus'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
