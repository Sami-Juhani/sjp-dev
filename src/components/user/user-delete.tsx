'use client'

import React, { useState, useTransition } from 'react'

import { useRouter } from 'next/navigation'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'

import { permaDeleteUser } from '@/lib/services/user'

import { UserX } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import { toast } from 'sonner'

import { Button } from '../ui/button'
import { DialogFooter, DialogHeader } from '../ui/dialog'
import { Input } from '../ui/input'
import { Label } from '../ui/label'

export default function UserDelete({
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  dict,
  lang
}: UserDeleteProps) {
  const [confirmDelete, setConfirmDelete] = useState('')
  const [isPending, startTransition] = useTransition()
  const { data: session, update } = useSession()
  const router = useRouter()

  const validDeleteConfirmation = dict.settings.modal.delConfirmation

  async function handleDelete() {
    if (session == null) return

    try {
      const { success } = await permaDeleteUser(session.user.id)

      if (!success) {
        toast.error(dict.common.error)
        return
      }

      await update()
      setIsDeleteDialogOpen(false)
      await signOut({ redirect: false })
      toast.success(dict.settings.modal.profileDeleted)
      router.push(`/${lang}`)
    } catch (err) {
      toast.error(dict.common.error)
    }
  }

  return (
    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <DialogTrigger asChild>
        <Button
          className='w-full text-white'
          aria-label={dict.settings.deleteProfile}
        >
          <UserX className='mr-2 h-4 w-4 text-white' />
          {dict.settings.deleteProfile}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='text-2xl'>
            {dict.settings.modal.title}?
          </DialogTitle>
          <DialogDescription className='!mt-4'>
            {dict.settings.modal.description}.
          </DialogDescription>
        </DialogHeader>
        <div className='mt-6 flex flex-col gap-4'>
          <Label htmlFor='confirm-delete'>
            {dict.settings.modal.confStart}{' '}
            <span className='text-md mx-1 italic text-red-700'>
              {validDeleteConfirmation}
            </span>{' '}
            {dict.settings.modal.confEnd}:
          </Label>
          <Input
            id='confirm-delete'
            value={confirmDelete}
            onChange={e => setConfirmDelete(e.target.value)}
            className='col-span-3'
            autoComplete='off'
          />
        </div>
        <DialogFooter className='mt-4'>
          <Button
            type='submit'
            variant='destructive'
            onClick={() => {
              startTransition(async () => await handleDelete())
            }}
            disabled={confirmDelete !== validDeleteConfirmation || isPending}
          >
            {!isPending
              ? dict.settings.modal.deleteButton
              : dict.settings.modal.deleteButtonSubmitting}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
