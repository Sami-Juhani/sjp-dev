export interface IDictionary {
  common: {
    error: string
  }
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
      dashboard: string
    }
  }
  footer: {
    rights: string
  }
  home: {
    hero: {
      greetings: string
      greetingsSub: string
      getInTouch: string
      downloadButton: string
      services: {
        title: string
        webDevelopment: string
        backendDevelopment: string
        cloudServices: string
      }
      techTitle: string
    }
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
    searchPh: string
    comments: {
      heading: string
      published: string
      replied: string
      addCommentButton: string
      addCommentButtonSubmitting: string
      replyButtonSubmitting: string
      editButton: string
      saveButton: string
      saveButtonSubmitting: string
      deleteButton: string
      deleteButtonSubmitting: string
      submitButton: string
      submitButtonSubmitting: string
      cancelButton: string
      reply: string
      replyFor: string
      title: string
      comment: string
      commentPh: string
      titlePh: string
      commentSuccess: string
      commentDeleted: string
      commentUpdated: string
    }
  }
  projects: {
    title: string
    backButton: string
    recent: string
    readMore: string
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
  policy: {
    title: string
    sections: {
      general: {
        title: string
        description: string
      }
      information_we_collect: {
        title: string
        description: string
        data: string[]
        contact_form: string
        contact_data: string[]
      }
      purpose_of_data_collection: {
        title: string
        description: string
        purposes: string[]
      }
      data_retention: {
        title: string
        description: string
      }
      third_parties: {
        title: string
        description: string
      }
      user_rights: {
        title: string
        description: string
        rights: string[]
      }
      data_security: {
        title: string
        description: string
      }
      cookies: {
        title: string
        description: string
      }
      changes_to_policy: {
        title: string
        description: string
      }
      contact_us: {
        title: string
        description: string
      }
    }
  }
  settings: {
    title: string
    description: string
    showImage: string
    yourComments: string
    noComments: string
    badgeBlog: string
    badgeProject: string
    tooltip: string
    topLevel: string
    reply: string
    deleteProfile: string
    userNoImage: string
    userShowImage: string
    modal: {
      title: string
      description: string
      confStart: string
      confEnd: string
      delConfirmation: string
      deleteButton: string
      deleteButtonSubmitting: string
      profileDeleted: string
    }
  }
  lois: {
    inputPh: string
    responseError: string
  }
}

interface Dictionary {
  [key: string]: () => Promise<IDictionary>
}

const dictionaries: Dictionary = {
  en: () => import('./en.json').then(module => module.default),
  fi: () => import('./fi.json').then(module => module.default)
}

export const getDictionary = async (locale: string): Promise<IDictionary> => {
  if (dictionaries[locale]) {
    return await dictionaries[locale]()
  } else {
    throw new Error(`No dictionary found for locale: ${locale}`)
  }
}
