import { Fragment, ReactNode } from 'react'

export default function SkeletonList({
  amount,
  children
}: {
  amount: number
  children: ReactNode
}) {
  return (
    <>
      {Array.from({ length: amount }).map((_, i) => (
        <Fragment key={i}>{children}</Fragment>
      ))}
    </>
  )
}
