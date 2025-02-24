declare type EditableContent = Record<SupportedLangs, Post | Project | null>

declare type ContentType = 'blog' | 'projects'

declare type SupportedLangs = 'fi' | 'en'

interface ContentFormProps {
  dict: IDictionary
  contentFi?: Post | Project | null
  contentEn?: Post | Project | null
  contentType?: ContentType
}

interface ImageUploadProps extends React.HTMLDivElementAttributes<HTMLElement> {
  className?: string
  setValue: React.Dispatch<React.SetStateAction<string>> | UseFormSetValue<T>
  fileName: string
}

interface ContentTypeDropdownProps {
  setValue: React.Dispatch<React.SetStateAction<string>> | UseFormSetValue<T>
  contentType: ContentType | undefined
}

interface EditorProps {
  initialValue?: JSONContent
  lang: SupportedLangs
  onChange: ({
    content,
    lang
  }: {
    content: string
    lang: SupportedLangs
  }) => void
}

interface FrontMatter {
  title?: string
  description?: string
  image?: string
  author?: string
  publishedAt?: string
  keywords?: string
  slug: string
}

interface ContentMetadata extends FrontMatter {
  likeCount: number
  blobUrl: string
  commentCount: number
}

interface Content {
  metadata: ContentMetadata
  content: string
}

interface getContentBySlugProps {
  contentType: ContentType
  lang: SupportedLangs
  slug: string
}

interface ContentResponse {
  metadata: ContentMetadata
  content: string
}

interface GetAllContentProps {
  slug: string
  contentType: ContentType
}

interface GetContentProps {
  limit?: number
  contentType: ContentType
  lang: SupportedLangs
}

interface CommentProps {
  title: string
  body: string
  userId: string | undefined
  slug: string
  contentType: ContentType
}

interface Reply extends Omit<CommentProps, 'title'> {}

interface AddReplyProps extends Reply {
  parentId: string
}

interface UpdateCommentProps extends Omit<CommentProps, 'userId' | 'title'> {
  id: string
}

interface IBlog {
  blogs: BlogMetadata[]
  lang: SupportedLangs
}

interface BlogsProps extends IBlog {
  isLandingPage?: boolean
}

interface IProject {
  projects: ProjectMetadata[]
  lang: SupportedLangs
}

interface ProjectProps extends IProject {
  isLandingPage?: boolean
}

interface BlogWithSearchProps extends IBlog {
  dict: IDictionary
}

interface BlogLikesProps {
  fetchedLikes: number
  blogSlug: string
  dict: IDictionary
}

interface User {
  id: string
  email: string
  name: string
  image: string | null
  emailVerified: Date | null
  role: string
  createdAt: Date
  active: Date
  showImage: boolean
  emailVerified?: Date
  createdAt: Date
  active: Date
}

// TODO: Is this needed?
declare type ActiveUser = Omit<
  User,
  | 'emailVerified'
  | 'createdAt'
  | ('active' & { likes: Likes[]; comments: Comment[] })
>

interface UserUpdateProps {
  id: string
  name?: string
  image?: string
  showImage: boolean
}

interface UserCommentProps {
  id: string
  body: string
  parentId: string | null
  blogSlug?: string | null
  projectSlug?: string | null
  dict: IDictionary
  lang: SupportedLangs
}

interface UserDeleteProps {
  isDeleteDialogOpen: boolean
  setIsDeleteDialogOpen: Dispatch<SetStateAction<boolean>>
  dict: IDictionary
  lang: SupportedLangs
}

interface ModalLoginProps {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  dict: IDictionary
}

interface FormatDateProps {
  locale: string
  date?: Date
  options?: Intl.DateTimeFormatOptions
}

interface EditorContentPreviewProps
  extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  title: string
  image: string
  dict: IDictionary
}

interface BackupBlobFolderProps {
  sourcePrefix: string
  destPrefix: string
  copyCount: { count: number }
}
