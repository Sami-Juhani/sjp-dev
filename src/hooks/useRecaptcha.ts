import { useCallback } from 'react'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

export function useRecaptcha() {
  const { executeRecaptcha } = useGoogleReCaptcha()
  
  const callRecaptcha = useCallback(async () => {
    if (!executeRecaptcha) {
      throw new Error('ReCaptcha not ready')
    }

    const gRecaptchaToken = await executeRecaptcha('registerSubmit')
    try {
      const res = await fetch('/api/recaptcha', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ gRecaptchaToken })
      })

      if (!res.ok) {
        return { success: false }
      }

      const response = await res.json()

      return { success: true, response }
    } catch (err) {
      return { success: false }
    }
  }, [executeRecaptcha])

  return callRecaptcha
}
