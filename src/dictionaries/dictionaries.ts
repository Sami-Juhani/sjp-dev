export interface DictionaryResult {
  common: {
    error: string
  },
  notfound: {
    title: string
    check: string
    backButton: string
  }
  header: {
    blogs: string
    projects: string
    contact: string
    dropdownmenu: {
      menu: string
      userSettings: string
      logIn: string
      logOut: string
      language: string
      finnish: string
      english: string
      theme: string
      dark: string
      light: string
    }
  }
  footer: {
    rights: string
  }
  home: {
    authorTitle: string
    authorIntro: string
  }
  blog: {
    backButton: string
    title: string
    recent: string
    allPosts: string
    signatureTitle: string
    signature: string
    likeAdded: string
    likeRemoved: string
    noUser: string
    likes: string
  }
  projects: {
    title: string
    backButton: string
    recent: string
    allProjects: string
  }
  contact: {
    title: string
    name: string
    namePh: string
    email: string
    emailPh: string
    phone: string
    message: string
    messagePh: string
    contactButton: string
    contactButtonSubmitting: string
    privacy: string
    privacyLink: string
    formSuccess: string
    formError: string
  }
  privacy: {
    google: {
      title: string
      privacyPolicy: string
      and: string
      termsOfService: string
      apply: string
    }
  }
  auth: {
    login: string
    loginTitle: string
    loginSuccess: string
    loginError: string
    logOutMsg: string
    googleLoginButton: string
  }
}

interface Dictionary {
  [key: string]: () => Promise<DictionaryResult>
}

const dictionaries: Dictionary = {
  en: () => import('./en.json').then(module => module.default),
  fi: () => import('./fi.json').then(module => module.default)
}

export const getDictionary = async (
  locale: string
): Promise<DictionaryResult> => {
  if (dictionaries[locale]) {
    return await dictionaries[locale]()
  } else {
    throw new Error(`No dictionary found for locale: ${locale}`)
  }
}
