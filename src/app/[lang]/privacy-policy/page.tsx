import { Metadata } from 'next'
import { getDictionary } from '@/dictionaries/dictionaries'

export default async function PrivacyPolicy({
  params: { lang }
}: {
  params: { lang: string }
}) {
  const dict = await getDictionary(lang)
  const { title, sections } = dict.policy

  return (
    <section className='pb-24 pt-40'>
      <div className='container max-w-3xl'>
        <h1 className='title text-3xl'>{title}</h1>

        {/* General Section */}
        <div className='my-8'>
          <h2 className='title text-xl no-underline'>{sections.general.title}</h2>
          <p className='mt-2'>{sections.general.description}</p>
        </div>

        {/* Information We Collect Section */}
        <div className='mb-8'>
          <h2 className='title text-xl no-underline'>
            {sections.information_we_collect.title}
          </h2>
          <p className='mt-2'>{sections.information_we_collect.description}</p>
          <ul className='mt-2 list-inside list-disc ml-4'>
            {sections.information_we_collect.data.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <p className='mt-2'>{sections.information_we_collect.contact_form}</p>
          <ul className='mt-2 list-inside list-disc ml-4'>
            {sections.information_we_collect.contact_data.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        {/* Purpose of Data Collection */}
        <div className='mb-8'>
          <h2 className='title text-xl no-underline'>
            {sections.purpose_of_data_collection.title}
          </h2>
          <p className='mt-2'>
            {sections.purpose_of_data_collection.description}
          </p>
          <ul className='mt-2 list-inside list-disc ml-4'>
            {sections.purpose_of_data_collection.purposes.map(
              (purpose, index) => (
                <li key={index}>{purpose}</li>
              )
            )}
          </ul>
        </div>

        {/* Data Retention Section */}
        <div className='mb-8'>
          <h2 className='title text-xl no-underline'>
            {sections.data_retention.title}
          </h2>
          <p className='mt-2'>{sections.data_retention.description}</p>
        </div>

        {/* Third Parties Section */}
        <div className='mb-8'>
          <h2 className='title text-xl no-underline'>
            {sections.third_parties.title}
          </h2>
          <p className='mt-2'>{sections.third_parties.description}</p>
        </div>

        {/* User Rights Section */}
        <div className='mb-8'>
          <h2 className='title text-xl no-underline'>
            {sections.user_rights.title}
          </h2>
          <p className='mt-2'>{sections.user_rights.description}</p>
          <ul className='mt-2 list-inside list-disc ml-4'>
            {sections.user_rights.rights.map((right, index) => (
              <li key={index}>{right}</li>
            ))}
          </ul>
        </div>

        {/* Data Security Section */}
        <div className='mb-8'>
          <h2 className='title text-xl no-underline'>
            {sections.data_security.title}
          </h2>
          <p className='mt-2'>{sections.data_security.description}</p>
        </div>

        {/* Cookies Section */}
        <div className='mb-8'>
          <h2 className='title text-xl no-underline'>{sections.cookies.title}</h2>
          <p className='mt-2'>{sections.cookies.description}</p>
        </div>

        {/* Changes to Policy Section */}
        <div className='mb-8'>
          <h2 className='title text-xl no-underline'>
            {sections.changes_to_policy.title}
          </h2>
          <p className='mt-2'>{sections.changes_to_policy.description}</p>
        </div>

        {/* Contact Us Section */}
        <div className='mb-8'>
          <h2 className='title text-xl no-underline'>
            {sections.contact_us.title}
          </h2>
          <p className='mt-2'>{sections.contact_us.description}</p>
        </div>
      </div>
    </section>
  )
}

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'This is a comprehensive privacy policy that outlines how SjP collects, uses, and protects your personal information. We are committed to safeguarding your privacy and complying with applicable data protection laws.',
  keywords:
    'privacy policy, data protection, personal information, SjP, data security, GDPR, CCPA',
};