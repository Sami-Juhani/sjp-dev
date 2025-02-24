import ContentMainView from '@/_components/content/editor-content-main-view'

export default async function AdminLandingPage(
  props: {
    params: Promise<{ lang: SupportedLangs }>
  }
) {
  const params = await props.params;

  const {
    lang
  } = params;

  return <ContentMainView lang={lang} />
}
