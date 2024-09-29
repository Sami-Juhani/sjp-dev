import {
  Column,
  Hr,
  Link,
  Row,
  Section,
  Text
} from '@react-email/components'


export default function EmailSignature() {
  return (
    <>
      <Hr className="my-4" />
      <Section>
        <Row>
          <Column>
            <Text className='m-0 text-l'>Best regards,</Text>
            <Text className='m-0 ml-4 italic'>Sami Paananen</Text>
            <Text className='m-0 ml-4'>Software Developer</Text>
            <Text className='m-0 ml-4'>sami.paananen@sjpdev.io</Text>
          </Column>
        </Row>
      </Section>
    </>
  )
}
