import { JSX } from 'react'
import { highlight } from 'sugar-high'
import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote/rsc'

function Code({ children, ...props }: any) {
  const codeHTML = highlight(children)
  return (
    <pre tabIndex={0} {...props}>
      <code dangerouslySetInnerHTML={{ __html: codeHTML }} />
    </pre>
  )
}

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
      className='text-xs text-muted-foreground underline-offset-4'
      {...props}
    >
      {children}
    </a>
  )
}

const components = {
  code: Code,
  a: Anchor
}

export default function MDXContent(
  props: JSX.IntrinsicAttributes & MDXRemoteProps
) {
  return (
    <MDXRemote
      {...props}
      components={{ ...components, ...(props.components || {}) }}
    />
  )
}
