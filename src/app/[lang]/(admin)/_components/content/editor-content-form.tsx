'use client'

import { useEffect, useState, useTransition } from 'react'

import { usePathname } from 'next/navigation'

import { MDXContentClient } from '@/components/mdx/mdx-content-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import ContentTypeDropdown from '@/_components/content/editor-content-type-dropdown'
import Editor from '@/_components/editor/editor'
import ImageUpload from '@/_components/upload/image-upload'

import { aiTranslateText } from '@/_lib/services/ai'
import { createOrUpdateContent } from '@/_lib/services/content'
import { ContentFormSchema } from '@/lib/db/schemas'

import { zodResolver } from '@hookform/resolvers/zod'
import { NodeHtmlMarkdown } from 'node-html-markdown'
import { JSONContent } from 'novel'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import EditorContentHeader from './editor-content-header'

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

export default function EditorContentForm({
  dict,
  contentFi,
  contentEn,
  contentType
}: ContentFormProps) {
  const [isPending, startTransition] = useTransition()
  const [fiEditorUUID, setFiEditorUUID] = useState(crypto.randomUUID())
  const [enEditorUUID, setEnEditorUUID] = useState(crypto.randomUUID())
  const [isUpdating, setIsUpdating] = useState(false)
  const pathname = usePathname()

  const { title, slug, description, keywords, image } =
    // Get metadata from either content
    contentEn !== null
      ? (contentEn?.metadata ?? {})
      : (contentFi?.metadata ?? {})
  const contentBodyEn = contentEn?.content
  const contentBodyFi = contentFi?.content

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
      titleEn: title || '',
      titleFi: title || '',
      slug: slug || '',
      image: image || '',
      descriptionEn: description || '',
      descriptionFi: description || '',
      keywords: keywords || '',
      contentType: contentType || '',
      contentEn: contentBodyEn || '',
      contentFi: contentBodyFi || ''
    }
  })

  const formValues = watch()

  useEffect(() => {
    if (pathname.includes('edit')) {
      setIsUpdating(true)
    }
  }, [pathname])

  useEffect(() => {
    const name = formValues.titleEn
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')

    setValue('slug', name)
  }, [formValues.titleEn, setValue])

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
    try {
      const { success, error } = await createOrUpdateContent({
        data,
        isUpdating
      })
      console.log(success, error)

      if (error || success == false) {
        toast.error(`${dict.common.error}.`)
        return
      }

      toast.success(
        'Content created Succesfully: ' + data.titleEn + ' / ' + data.titleFi
      )
      reset()
    } catch (err) {
      toast.error(`${dict.common.error}.`)
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
    <div className='flex h-full flex-col gap-4 2xl:flex-row'>
      <div className='w-full px-8 pt-8 2xl:w-1/2 2xl:border-r 2xl:pb-8'>
        <form
          onSubmit={handleSubmit(processForm)}
          className='mx-auto flex max-w-2xl flex-col gap-4'
        >
          <h1 className='title'>Metadata</h1>
          <div className='flex flex-col gap-4 lg:flex-row'>
            {/* English Title */}
            <div className='w-full lg:w-1/2'>
              <Label className='mb-2 block' htmlFor='title'>
                English Title
              </Label>
              <Input
                type='text'
                id='title'
                placeholder='Title'
                {...register('titleEn')}
              />
              {errors.titleEn?.message && (
                <p className='mt-2! ml-1 text-sm text-rose-400'>
                  {errors.titleEn.message}
                </p>
              )}
            </div>

            {/* Finnish Title */}
            <div className='w-full lg:w-1/2'>
              <Label className='mb-2 block' htmlFor='title'>
                Finnish Title
              </Label>
              <Input
                type='text'
                id='title'
                placeholder='Title'
                {...register('titleFi')}
              />
              {errors.titleFi?.message && (
                <p className='mt-2! ml-1 text-sm text-rose-400'>
                  {errors.titleFi.message}
                </p>
              )}
            </div>
          </div>
          <div className='flex flex-col gap-4 lg:flex-row'>
            {/* Description English*/}
            <div className='w-full lg:w-1/2'>
              <Label className='mb-2 block' htmlFor='description'>
                English Description
              </Label>
              <Input
                id='description'
                type='text'
                placeholder='Description'
                {...register('descriptionEn')}
              />
              {errors.descriptionEn?.message && (
                <p className='mt-2! ml-1 text-sm text-rose-400'>
                  {errors.descriptionEn.message}
                </p>
              )}
            </div>

            {/* Description Finnish*/}
            <div className='w-full lg:w-1/2'>
              <Label className='mb-2 block' htmlFor='description'>
                Finnish Description
              </Label>
              <Input
                id='description'
                type='text'
                placeholder='Description'
                {...register('descriptionFi')}
              />
              {errors.descriptionFi?.message && (
                <p className='mt-2! ml-1 text-sm text-rose-400'>
                  {errors.descriptionFi.message}
                </p>
              )}
            </div>
          </div>

          <div className='flex flex-col gap-4 lg:flex-row'>
            {/* Keywords */}
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
                <p className='mt-2! ml-1 text-sm text-rose-400'>
                  {errors.keywords.message}
                </p>
              )}
            </div>

            {/* Slug */}
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
                <p className='mt-2! ml-1 text-sm text-rose-400'>
                  {errors.slug.message}
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
              <p className='mt-2! ml-1 text-sm text-rose-400'>
                {errors.contentType.message}
              </p>
            )}
          </div>

          {/* Image upload */}
          <ImageUpload
            className='mt-4 flex flex-col items-center gap-2'
            setValue={setValue}
            fileName={formValues.image}
          />
          {errors.image?.message && (
            <p className='mt-2! ml-1 text-sm text-rose-400'>
              {errors.image.message}
            </p>
          )}

          <div className='flex w-full flex-col flex-wrap gap-4 p-4 xl:flex-row'>
            {/* English Editor */}
            <div className='w-full'>
              <h2 className='title my-8'>Content (EN)</h2>
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
                <p className='mt-2! ml-1 text-sm text-rose-400'>
                  {errors.contentEn.message}
                </p>
              )}
              <Button
                className='mt-4 w-full'
                disabled={isPending}
                variant={'secondary'}
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
                {isPending ? 'Translating...' : 'Translate To Finnish'}
              </Button>
            </div>

            {/* Finnish Editor */}
            <div className='w-full'>
              <h2 className='title my-8'>Content (FI)</h2>

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
                <p className='mt-2! ml-1 text-sm text-rose-400'>
                  {errors.contentFi.message}
                </p>
              )}
            </div>
            <Button
              className='mt-4 w-full'
              disabled={isPending}
              variant={'secondary'}
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

          {!isUpdating && (
            <Button
              className='m-4'
              variant='default'
              size='sm'
              type='submit'
              disabled={isSubmitting}
            >
              {!isSubmitting ? 'Create' : 'Creating...'}
            </Button>
          )}
          {isUpdating && (
            <Button
              className='m-4'
              variant='default'
              size='sm'
              type='submit'
              disabled={isSubmitting}
            >
              {!isSubmitting ? 'Update' : 'Updating...'}
            </Button>
          )}
        </form>
      </div>

      {/* Content Previews */}

      <div className='mx-auto w-full max-w-2xl p-4'>
        <EditorContentHeader
          className='w-full'
          title={formValues.titleEn}
          image={formValues.image}
          dict={dict}
        />
        <div className='mt-4 flex w-full flex-col gap-4 2xl:flex-row'>
          <div className='mt-4 w-full 2xl:w-1/2'>
            <h2 className='title'>Preview (EN)</h2>
            <div className='prose dark:prose-invert mt-4'>
              <MDXContentClient source={formValues.contentEn} />
            </div>
          </div>
          <div className='mt-4 w-full 2xl:w-1/2'>
            <h2 className='title'>Preview (FI)</h2>
            <div className='prose dark:prose-invert mt-4'>
              <MDXContentClient source={formValues.contentFi} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
