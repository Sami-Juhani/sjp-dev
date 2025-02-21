import Sidebar from '@/_components/layout/sidebar'

import './prosemirror.css'

export const metadata = {
  title: 'SjP - Admin Dashboard',
  description: 'Admin dashboard to manage the application'
}

export default async function AdminRootLayout({
  params: { lang },
  children
}: {
  params: { lang: SupportedLangs }
  children: React.ReactNode
}) {
  return <Sidebar lang={lang}>{children}</Sidebar>
}
