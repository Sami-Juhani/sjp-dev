'use client'

import { useEffect, useState, useTransition } from 'react'

import { MDXContentClient } from '@/components/mdx/mdx-content-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import GoogleRecaptchaPrivacy from '@/components/utils/security/google-recaptcha-privacy'

import ContentPreviewHeader from '@/_components/content/editor-content-preview-header'
import ContentTypeDropdown from '@/_components/content/editor-content-type-dropdown'
import Editor from '@/_components/editor/editor'
import ImageUpload from '@/_components/upload/image-upload'

import { aiTranslateText } from '@/_lib/services/ai'
import { createContent } from '@/_lib/services/content'
import { useRecaptcha } from '@/hooks/useRecaptcha'
import { ContentFormSchema } from '@/lib/db/schemas'

import { zodResolver } from '@hookform/resolvers/zod'
import { NodeHtmlMarkdown } from 'node-html-markdown'
import { JSONContent } from 'novel'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

export const defaultValue = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: []
    }
  ]
}

type Inputs = z.infer<typeof ContentFormSchema>

export default function ContentForm({
  lang,
  dict,
  contentFi,
  contentEn,
  contentType
}: ContentFormProps) {
  const [isPending, startTransition] = useTransition()

  const { title, slug, description, keywords, image } =
    // Get metadata from either content
    contentEn !== null
      ? (contentEn?.metadata ?? {})
      : (contentFi?.metadata ?? {})
  const contentBodyEn = contentEn?.content
  const contentBodyFi = contentFi?.content

  const [fiEditorUUID, setFiEditorUUID] = useState(crypto.randomUUID())
  const [enEditorUUID, setEnEditorUUID] = useState(crypto.randomUUID())

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<Inputs>({
    resolver: zodResolver(ContentFormSchema),
    defaultValues: {
      title: title || '',
      slug: slug || '',
      image: image || '',
      description: description || '',
      keywords: keywords || '',
      contentType: contentType || '',
      contentEn: contentBodyEn || '',
      contentFi: contentBodyFi || ''
    }
  })
  const callRecaptcha = useRecaptcha()

  const formValues = watch()

  useEffect(() => {
    const name = formValues.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')

    setValue('slug', name)
  }, [formValues.title, setValue])

  function setMdx({
    content,
    lang
  }: {
    content: string
    lang: SupportedLangs
  }) {
    if (lang === 'en')
      setValue('contentEn', NodeHtmlMarkdown.translate(content))
    else setValue('contentFi', NodeHtmlMarkdown.translate(content))
  }

  const processForm: SubmitHandler<Inputs> = async data => {
    const { success, response } = await callRecaptcha()

    if (!success) {
      toast.error(`${dict.common.error}.`)
      return
    }

    if (response.success) {
      try {
        const { success, error } = await createContent({
          data
        })

        if (error || success == false) {
          toast.error(`${dict.common.error}.`)
          return
        }

        toast.success('Content created Succesfully: ' + data.title)
        reset()
      } catch (err) {
        toast.error(`${dict.common.error}.`)
      }
    }
  }

  async function translateText({
    text,
    targetLang
  }: {
    text: string
    targetLang: SupportedLangs
  }) {
    const response = await aiTranslateText(text)
    if (!response.success) {
      toast.warning(response.msg)
      return
    }

    if (targetLang === 'en') {
      setValue('contentEn', response.translatedText)
      setEnEditorUUID(crypto.randomUUID())
    } else {
      setValue('contentFi', response.translatedText)
      setFiEditorUUID(crypto.randomUUID())
    }
    toast.success('Translation completed!')
  }

  return (
    <div className='flex h-full flex-col gap-4 lg:flex-row'>
      <div className='w-full p-8 lg:w-1/2 lg:border-r'>
        <form
          onSubmit={handleSubmit(processForm)}
          className='mx-auto flex max-w-2xl flex-col gap-4'
        >
          <h1 className='title no-underline'>Metadata</h1>
          <div className='flex flex-col gap-4 lg:flex-row'>
            <div className='w-full lg:w-1/2'>
              <Label className='mb-2 block' htmlFor='title'>
                Title
              </Label>
              <Input
                type='text'
                id='title'
                placeholder='Title'
                {...register('title')}
              />
              {errors.title?.message && (
                <p className='!mt-2 ml-1 text-sm text-rose-400'>
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className='w-full lg:w-1/2'>
              <Label className='mb-2 block' htmlFor='slug'>
                Slug
              </Label>
              <Input
                type='text'
                id='slug'
                placeholder='Slug'
                {...register('slug')}
              />
              {errors.slug?.message && (
                <p className='!mt-2 ml-1 text-sm text-rose-400'>
                  {errors.slug.message}
                </p>
              )}
            </div>
          </div>

          <div className='flex flex-col gap-4 lg:flex-row'>
            <div className='w-full lg:w-1/2'>
              <Label className='mb-2 block' htmlFor='description'>
                Description
              </Label>
              <Input
                id='description'
                type='text'
                placeholder='Description'
                {...register('description')}
              />
              {errors.description?.message && (
                <p className='!mt-2 ml-1 text-sm text-rose-400'>
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className='w-full lg:w-1/2'>
              <Label className='mb-2 block' htmlFor='keywords'>
                Keywords
              </Label>
              <Input
                type='text'
                id='keywords'
                placeholder='Keywords'
                {...register('keywords')}
              />
              {errors.keywords?.message && (
                <p className='!mt-2 ml-1 text-sm text-rose-400'>
                  {errors.keywords.message}
                </p>
              )}
            </div>
          </div>

          <div className='w-full'>
            <ContentTypeDropdown
              contentType={contentType}
              setValue={setValue}
            />
            {errors.contentType?.message && (
              <p className='!mt-2 ml-1 text-sm text-rose-400'>
                {errors.contentType.message}
              </p>
            )}
          </div>

          {/* Image upload */}
          <ImageUpload setValue={setValue} fileName={formValues.image} />
          {errors.image?.message && (
            <p className='!mt-2 ml-1 text-sm text-rose-400'>
              {errors.image.message}
            </p>
          )}

          <div className='flex justify-between gap-4'>
            {/* English Editor */}
            <div className='w-1/2'>
              <h2 className='title my-8 no-underline'>Content (EN)</h2>
              <Editor
                key={enEditorUUID}
                initialValue={
                  (formValues.contentEn as unknown as JSONContent) ||
                  defaultValue
                }
                onChange={setMdx}
                lang={'en'}
              />

              {errors.contentEn?.message && (
                <p className='!mt-2 ml-1 text-sm text-rose-400'>
                  {errors.contentEn.message}
                </p>
              )}
            </div>

            {/* Finnish Editor */}
            <div className='w-1/2'>
              <h2 className='title my-8 no-underline'>Content (FI)</h2>

              <Editor
                key={fiEditorUUID}
                initialValue={
                  (formValues.contentFi as unknown as JSONContent) ||
                  defaultValue
                }
                onChange={setMdx}
                lang={'fi'}
              />

              {errors.contentFi?.message && (
                <p className='!mt-2 ml-1 text-sm text-rose-400'>
                  {errors.contentFi.message}
                </p>
              )}
            </div>
          </div>

          {/* Translations*/}
          <div className='flex justify-between gap-4'>
            <Button
              className='w-fit'
              disabled={isPending}
              type='button'
              size='sm'
              onClick={() =>
                startTransition(async () =>
                  translateText({
                    text: formValues.contentEn as string,
                    targetLang: 'fi'
                  })
                )
              }
            >
              {isPending ? 'Translating...' : 'Translate to finnish'}
            </Button>
            <Button
              className='w-fit'
              disabled={isPending}
              type='button'
              size='sm'
              onClick={() =>
                startTransition(async () =>
                  translateText({
                    text: formValues.contentFi as string,
                    targetLang: 'en'
                  })
                )
              }
            >
              {isPending ? 'Translating...' : 'Translate to English'}
            </Button>
          </div>

          <Button
            className='mt-4'
            variant='default'
            size='sm'
            type='submit'
            disabled={isSubmitting}
          >
            {!isSubmitting ? 'Create' : 'Creating...'}
          </Button>
          <GoogleRecaptchaPrivacy dict={dict} />
        </form>
      </div>

      {/* Content Previews */}
      <div className='w-full p-8 lg:w-1/2'>
        <ContentPreviewHeader
          image={formValues.image}
          lang={lang}
          title={formValues.title}
          dict={dict}
        />
        <div className='flex justify-between gap-4'>
          <div className='mt-8 w-1/2'>
            <h2 className='title no-underline'>Preview (EN)</h2>
            <div className='prose mt-16 dark:prose-invert'>
              <MDXContentClient source={formValues.contentEn} />
            </div>
          </div>
          <div className='mt-8 w-1/2'>
            <h2 className='title no-underline'>Preview (FI)</h2>
            <div className='prose mt-16 dark:prose-invert'>
              <MDXContentClient source={formValues.contentFi} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
