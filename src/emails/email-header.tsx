import {
  Column,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text
} from '@react-email/components'
import React from 'react'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

export default function EmailHeader({ headerText }: { headerText: string }) {
  return (
    <Section className='rounded-tl-lg rounded-tr-lg px-4 py-2'>
      <Preview>You have submitted contact form at sjpdev.io</Preview>
      <Row>
        <Column>
          <Link href={baseUrl}>
            <Img
              className='rounded-[9999px]'
              src={`${baseUrl}/images/author/sjp_dev.png`}
              width={75}
              height={75}
              alt='SjP Software Development'
            />
          </Link>
        </Column>
        <Column>
          <Text className='text-xl font-bold'>{headerText}</Text>
        </Column>
      </Row>
    </Section>
  )
}
