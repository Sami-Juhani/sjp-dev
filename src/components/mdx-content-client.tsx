import { FC, useEffect, useState } from 'react'
import { evaluate, EvaluateOptions } from '@mdx-js/mdx'
import { MDXProps } from 'mdx/types'
import { jsx, jsxs, Fragment } from 'react/jsx-runtime'

type ReactMDXContent = (props: MDXProps) => JSX.Element | null
type Runtime = Pick<EvaluateOptions, 'jsx' | 'jsxs' | 'Fragment'>

const runtime = { jsx, jsxs, Fragment } as Runtime

function Anchor({
  href,
  children,
  ...props
}: React.JSX.IntrinsicElements['a']) {
  return (
    <a
      href={href}
      target='_blank'
      rel='noreferer noopener'
      className='text-primary underline underline-offset-4'
      {...props}
    >
      {children}
    </a>
  )
}

const components = {
  a: Anchor
}

export const MDXContentClient: FC<{
  source?: string
}> = ({ source = '' }) => {
  const [MdxClientContent, setMdxClientContent] = useState<ReactMDXContent>(
    () => () => null
  )

  useEffect(() => {
    evaluate(source, runtime).then(r => setMdxClientContent(() => r.default))
  }, [source])

  return <MdxClientContent components={components} />
}
