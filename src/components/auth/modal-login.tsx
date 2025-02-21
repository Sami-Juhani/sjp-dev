'use client'

import { usePathname } from 'next/navigation'

import GoogleLogin from '@/components/auth/google-login'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'

import { getLocale } from '@/lib/utils'

export default function ModalLogin({
  isOpen,
  setIsOpen,
  dict
}: ModalLoginProps) {
  const pathname = usePathname()
  const locale = getLocale(pathname)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>{dict.auth.login}</DialogTitle>
          <DialogDescription>{dict.auth.loginTitle}</DialogDescription>
        </DialogHeader>
        <Card className='border-0 shadow-none'>
          <CardContent className='flex justify-center pt-4'>
            <GoogleLogin dict={dict} callbackUrl={`/${locale}`} />
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
