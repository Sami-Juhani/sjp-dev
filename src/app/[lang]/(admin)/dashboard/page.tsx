import ContentMainView from '@/_components/content/editor-content-main-view'

export default function AdminLandingPage({
  params: { lang }
}: {
  params: { lang: SupportedLangs }
}) {
  return <ContentMainView lang={lang} />
}
