import { FC, useEffect, useState } from 'react'

import { evaluate, EvaluateOptions } from '@mdx-js/mdx'
import { MDXProps } from 'mdx/types'
import { jsx, jsxs, Fragment } from 'react/jsx-runtime'
import { highlight } from 'sugar-high'

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

function Code({ children, ...props }: any) {
  if (children == null) return

  const codeHTML = highlight(children)
  return (
    <pre tabIndex={0} {...props}>
      <code dangerouslySetInnerHTML={{ __html: codeHTML }} />
    </pre>
  )
}

const components = {
  a: Anchor,
  code: Code
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
