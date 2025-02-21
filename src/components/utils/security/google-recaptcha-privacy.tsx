import { IDictionary } from '@/dictionaries/dictionaries'
import Link from 'next/link'

export default function GoogleRecaptchaPrivacy({
  dict
}: {
  dict: IDictionary
}) {
  return (
    <div>
      <p className='mb-0 mt-4 text-xs text-muted-foreground'>
        {dict.privacy.google.title}
      </p>
      <p className='mt-0 text-xs text-muted-foreground'>
        <Link
          className='font-bold text-inherit no-underline'
          href='https://policies.google.com/privacy'
        >
          {dict.privacy.google.privacyPolicy}
        </Link>{' '}
        {dict.privacy.google.and}{' '}
        <Link
          className='font-bold text-inherit no-underline'
          href='https://policies.google.com/terms'
        >
          {dict.privacy.google.termsOfService}
        </Link>{' '}
        {dict.privacy.google.apply}.
      </p>
    </div>
  )
}
