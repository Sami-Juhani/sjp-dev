'use client'

import Image from 'next/image'
import Link from 'next/link'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import ShinyText from '@/components/ui/TextAnimations/ShinyText/ShinyText'

import { IDictionary } from '@/dictionaries/dictionaries'
import { cn } from '@/lib/utils'
import WhatsAppIcon from '@/public/images/icons/whatsapp-brands-solid.svg'
import LaptopWithCoffee from '@/public/images/sjpdev/laptop_w_coffee.png'

import { useTheme } from 'next-themes'

import { HighlightText } from '../utils/text/highlight-text'

export default function Hero({
  dict,
  lang
}: {
  dict: IDictionary
  lang: SupportedLangs
}) {
  const { theme } = useTheme()
  const skills = getSkills(lang)

  return (
    <div className='relative pb-12 md:pb-20'>
      <Image
        src={LaptopWithCoffee}
        alt='Laptop with Coffee'
        fill
        priority
        className='-z-10 mr-auto ml-auto max-w-[1080px] object-cover opacity-50 md:mr-[5%] 2xl:opacity-70'
      />
      <div className='bg-secondary-neon absolute top-0 left-0 -z-10 hidden h-64 w-64 rounded-full opacity-50 blur-[180px] md:block'></div>
      <div className='bg-secondary-neon absolute top-0 right-0 -z-10 mt-40 h-80 w-80 rounded-full opacity-50 blur-[180px]'></div>
      <div className='mt-12 flex flex-col items-center justify-center gap-8 px-4'>
        <div className='flex gap-4 p-4'>
          <div className='w-full md:w-1/2'>
            <p className='title text-secondary-neon text-xl font-light md:text-2xl'>
              {dict.home.hero.greetings}
            </p>
            <h1 className='title mt-3 ml-3 text-2xl leading-10 font-medium md:text-3xl md:leading-12 lg:text-4xl'>
              {dict.home.hero.greetingsSub}
            </h1>

            <Button
              className='bg-tertiary-neon/60 text-foreground hover:bg-tertiary-neon mx-auto mt-6 flex w-fit items-center justify-center gap-2 rounded-full pr-2 pl-4 tracking-wider'
              asChild
            >
              <Link
                href={`whatsapp://send?phone=${process.env.NEXT_PUBLIC_AUTHOR_NUMBER}`}
                target='_blank'
                rel='noopener noreferrer'
              >
                {dict.home.hero.getInTouch}{' '}
                <Image
                  src={WhatsAppIcon}
                  alt='WhatsApp Icon'
                  className='size-6'
                />
              </Link>
            </Button>
          </div>
        </div>

        {/* Services */}
        <Accordion
          type='single'
          collapsible
          className='border-muted/50 bg-background hover:border-secondary-neon/80 transition-color mt-4 h-fit w-full max-w-2xl rounded-lg border px-4 pt-4 opacity-100 shadow-lg duration-300 ease-in-out sm:opacity-95 md:w-1/2'
        >
          <h2 className='title text-secondary-neon text-2xl'>
            {dict.home.hero.services.title}
          </h2>
          <AccordionItem value='item-1'>
            <AccordionTrigger className='cursor-pointer'>
              <ShinyText
                className={cn(
                  'shiny-text',
                  theme === 'light' && 'text-foreground'
                )}
                text={dict.home.hero.services.webDevelopment}
                speed={3}
              />
            </AccordionTrigger>
            <AccordionContent className='leading-6'>
              {skills.webDevelopment}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value='item-2'>
            <AccordionTrigger className='cursor-pointer'>
              <ShinyText
                className={cn(
                  'shiny-text',
                  theme === 'light' && 'text-foreground'
                )}
                text={dict.home.hero.services.backendDevelopment}
                speed={4}
              />
            </AccordionTrigger>
            <AccordionContent className='leading-6'>
              {skills.backendDevelopment}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value='item-3'>
            <AccordionTrigger className='cursor-pointer'>
              <ShinyText
                className={cn(
                  'shiny-text',
                  theme === 'light' && 'text-foreground'
                )}
                text={dict.home.hero.services.cloudServices}
                speed={5}
              />
            </AccordionTrigger>
            <AccordionContent className='leading-6'>
              {skills.cloudServices}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}

function getSkills(lang: SupportedLangs) {
  const skillsInEnglish = {
    webDevelopment: (
      <HighlightText
        content='I specialize in building modern and scalable web applications using React and Next.js, combined with TypeScript for type safety and maintainability. My approach to frontend development emphasizes clean, reusable components and optimized rendering performance. I leverage modern styling techniques using CSS and libraries like Tailwind CSS, ensuring responsive and aesthetically pleasing user interfaces.'
        highlights={[
          { text: 'React', style: 'text-secondary-neon font-bold' },
          { text: 'Next.js', style: 'text-secondary-neon font-bold' },
          { text: 'TypeScript', style: 'text-secondary-neon font-bold' },
          {
            text: 'clean, reusable components',
            style: 'italic underline underline-offset-3'
          },
          { text: 'CSS', style: 'text-secondary-neon font-bold' },
          { text: 'Tailwind CSS', style: 'text-secondary-neon font-bold' }
        ]}
      />
    ),
    backendDevelopment: (
      <HighlightText
        content='I develop robust backend solutions using Python, with expertise in frameworks like Django and Flask. My backend work includes designing RESTful APIs , Authentication using JWT, Password hashing and integrating Databases such as PostgreSQL, MongoDB, and SQL. I have implemented secure and scalable authentication mechanisms, ensuring data integrity and user privacy. I can also handle backend logic for Machine Learning applications.'
        highlights={[
          { text: 'Python', style: 'text-secondary-neon font-bold' },
          { text: 'Django', style: 'text-secondary-neon font-bold' },
          { text: 'Flask', style: 'text-secondary-neon font-bold' },
          {
            text: 'RESTful APIs , Authentication using JWT, Password hashing and integrating Databases such as PostgreSQL, MongoDB, and SQL',
            style: 'italic underline underline-offset-3'
          },
          { text: 'Machine Learning', style: 'text-secondary-neon font-bold' }
        ]}
      />
    ),
    cloudServices: (
      <HighlightText
        content='I deploy and manage applications on AWS, Vercel, and Google Cloud, choosing the best hosting strategy based on scalability and cost-efficiency. My expertise covers serverless computing (e.g., AWS Lambda) and persistent infrastructure (e.g., EC2, Docker containers) . I set up CI/CD pipelines for automated deployments and configure domain management with SSL certificates to ensure secure web services.'
        highlights={[
          { text: 'AWS', style: 'text-secondary-neon font-bold' },
          { text: 'Vercel', style: 'text-secondary-neon font-bold' },
          { text: 'Google Cloud', style: 'text-secondary-neon font-bold' },
          { text: 'AWS Lambda', style: 'italic underline underline-offset-3' },
          {
            text: 'EC2, Docker containers',
            style: 'italic underline underline-offset-3'
          }
        ]}
      />
    )
  }
  const skillsInFinnish = {
    webDevelopment: (
      <HighlightText
        content='Olen erikoistunut modernien ja skaalautuvien verkkosovelluksien kehittämiseen käyttäen Reactia ja Next.js:ää, yhdessä TypeScriptin kanssa, joka takaa vahvan tyyppi turvallisuuden ja ylläpidettävyyden. Lähestymistapani frontend-kehitykseen on luoda selkeitä, uudelleenkäytettäviä komponentteja, sekä tuottaa optimoituja ja suorituskykyisiä sovelluksia. Hyödynnän kehitystyössäni ulkoasun moderneja tyylityksiä CSS:n ja Tailwind CSS:n kaltaisten kirjastojen avulla, varmistaen responsiiviset ja esteettisesti miellyttävät käyttöliittymät.'
        highlights={[
          { text: 'Reactia', style: 'text-secondary-neon font-bold' },
          { text: 'Next.js:ää', style: 'text-secondary-neon font-bold' },
          { text: 'TypeScriptin', style: 'text-secondary-neon font-bold' },
          {
            text: 'selkeitä, uudelleenkäytettäviä komponentteja',
            style: 'italic underline underline-offset-3'
          },
          { text: 'CSS:n', style: 'text-secondary-neon font-bold' },
          { text: 'Tailwind CSS:n', style: 'text-secondary-neon font-bold' }
        ]}
      />
    ),
    backendDevelopment: (
      <HighlightText
        content='Backend kehitystyö osaamiseni on Pythonin parissa, käyttäen sovelluskehyksiä kuten Django ja Flask. Olen työskennellyt projekteissa joihin on kuulunut esim, RESTful API -rajapintojen suunnittelua, JWT-todennusta, Salasanojen hashausta sekä tietokantojen kuten PostgreSQL:n, MongoDB:n ja SQL:n integrointia. Olen toteuttanut turvallisia ja skaalautuvia sovelluksia, jotka varmistavat käyttäjien yksityisyyden. Minulla on myös perustason osaaminen Koneoppimiseen liittyvästä kehitystyöstä.'
        highlights={[
          { text: 'Pythonin', style: 'text-secondary-neon font-bold' },
          { text: 'Django', style: 'text-secondary-neon font-bold' },
          { text: 'Flask', style: 'text-secondary-neon font-bold' },
          {
            text: 'RESTful API -rajapintojen suunnittelua, JWT-todennusta, Salasanojen hashausta sekä tietokantojen kuten PostgreSQL:n, MongoDB:n ja SQL:n integrointia',
            style: 'italic underline underline-offset-3'
          },
          { text: 'Koneoppimiseen', style: 'text-secondary-neon font-bold' }
        ]}
      />
    ),
    cloudServices: (
      <HighlightText
        content='Julkaisen ja ylläpidän sovelluksia AWS:ssä, Vercelissä ja Google Cloudissa. Valitsen parhaan ylläpitostrategian skaalautuvuuden ja kustannustehokkuuden perusteella. Asiantuntemukseni kattaa serverless-laskennan (esim. AWS Lambda) ja pysyvän infrastruktuurin (esim. EC2, Docker-kontit). Rakennan CI/CD-putkia automatisoituja käyttöönottoja varten ja määritän verkkotunnusten hallinnan SSL-sertifikaateilla varmistaakseni verkkopalveluiden turvallisuuden.'
        highlights={[
          { text: 'AWS:ssä', style: 'text-secondary-neon font-bold' },
          { text: 'Vercelissä', style: 'text-secondary-neon font-bold' },
          { text: 'Google Cloudissa', style: 'text-secondary-neon font-bold' },
          { text: 'AWS Lambda', style: 'italic underline underline-offset-3' },
          {
            text: 'EC2, Docker-kontit',
            style: 'italic underline underline-offset-3'
          }
        ]}
      />
    )
  }
  return lang === 'en' ? skillsInEnglish : skillsInFinnish
}
