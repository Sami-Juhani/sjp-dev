import { DictionaryResult } from '@/dictionaries/dictionaries'
import Link from 'next/link'

export default function GoogleRecaptchaPrivacy({
  dict
}: {
  dict: DictionaryResult
}) {

  return (
    <div>
      <p className='mt-4 mb-0 text-xs text-muted-foreground'>
        {dict.privacy.google.title}
      </p>
      <p className='mt-0 text-xs text-muted-foreground'>
        <Link className='font-bold no-underline text-inherit' href='https://policies.google.com/privacy'>
          {dict.privacy.google.privacyPolicy}
        </Link>{' '}
        {dict.privacy.google.and}{' '}
        <Link className='font-bold no-underline text-inherit' href='https://policies.google.com/terms'>
          {dict.privacy.google.termsOfService}
        </Link>{' '}
        {dict.privacy.google.apply}.
      </p>
    </div>
  )
}
