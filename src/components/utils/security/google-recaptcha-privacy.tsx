import { IDictionary } from '@/dictionaries/dictionaries'
import Link from 'next/link'

export default function GoogleRecaptchaPrivacy({
  dict
}: {
  dict: IDictionary
}) {
  return (
    <div>
      <p className='text-muted-foreground mt-4 mb-0 text-xs'>
        {dict.privacy.google.title}
      </p>
      <p className='text-muted-foreground mt-0 text-xs'>
        <Link
          className='font-bold text-inherit'
          href='https://policies.google.com/privacy'
        >
          {dict.privacy.google.privacyPolicy}
        </Link>{' '}
        {dict.privacy.google.and}{' '}
        <Link
          className='font-bold text-inherit'
          href='https://policies.google.com/terms'
        >
          {dict.privacy.google.termsOfService}
        </Link>{' '}
        {dict.privacy.google.apply}.
      </p>
    </div>
  )
}
