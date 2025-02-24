import Sidebar from '@/_components/layout/sidebar'

import './prosemirror.css'

export const metadata = {
  title: 'SjP - Admin Dashboard',
  description: 'Admin dashboard to manage the application'
}

export default async function AdminRootLayout(
  props: {
    params: Promise<{ lang: SupportedLangs }>
    children: React.ReactNode
  }
) {
  const params = await props.params;

  const {
    lang
  } = params;

  const {
    children
  } = props;

  return <Sidebar lang={lang}>{children}</Sidebar>
}
