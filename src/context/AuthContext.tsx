import { createContext, useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/router'
import authConfig from 'src/configs/auth'
import { AuthValuesType, LoginParams, LoginSilentParams, ErrCallbackType } from './types'
import { HttpClient } from 'src/services'
import secureLocalStorage from 'react-secure-storage'
import localStorageKeys from 'src/configs/localstorage_keys'
import { IUser } from 'src/contract/models/user'
import IAbilities from 'src/contract/models/abilities'
import { getOnboardingLink } from 'src/utils/helpers'

const defaultProvider: AuthValuesType = {
  user: null,
  abilities: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  socialLogin: () => Promise.resolve(),
  login: () => Promise.resolve(),
  loginSilent: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  refreshSession: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<IUser | null>(defaultProvider.user)
  const [abilities, setAbilities] = useState<IAbilities | null>(defaultProvider.abilities)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)
  const router = useRouter()

  const initAuth = async (): Promise<void> => {
    const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)!
    if (storedToken) {
      setLoading(true)
      await HttpClient.get(authConfig.meEndpoint)
        .then(async response => {
          setLoading(false)
          setUser({ ...response.data.user })
          setAbilities(response.data.abilities)
          secureLocalStorage.setItem(localStorageKeys.userData, response.data.user)
          secureLocalStorage.setItem(localStorageKeys.abilities, response.data.abilities)

          handleRedirection(response.data.user)
        })
        .catch(error => {
          localStorage.removeItem('userData')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('accessToken')
          secureLocalStorage.clear()

          setUser(null)
          setLoading(false)

          if (error.response.status == 401) {
            router.replace('/login')
          }
        })
    } else {
      setLoading(false)
    }
  }

  const handleRedirection = async (user: any) => {
    if (!user.email_verified_at) {
      return router.replace(`/verify-email/`)
    }

    if (user.last_step !== 'completed') {
      const onboardingLink = getOnboardingLink(user)
      if (user.last_step === 'role-selection') {
        return router.replace(`/${user.last_step}`)
      }

      return router.replace(`/onboarding/${onboardingLink}/${user.last_step}`)
    }
  }

  useEffect(() => {
    initAuth()
  }, [])

  const handleRefreshSession = async () => {
    await HttpClient.get(authConfig.meEndpoint).then(async response => {
      secureLocalStorage.setItem(localStorageKeys.userData, response.data.user)
      secureLocalStorage.setItem(localStorageKeys.abilities, response.data.abilities)
      setUser({ ...response.data.user })
      setAbilities(response.data.abilities)
    })
  }

  const handleLogin = (params: LoginParams, errorCallback?: ErrCallbackType, isReturn?: boolean) => {
    setLoading(true)

    HttpClient.post(authConfig.loginEndpoint, params)
      .then(async response => {
        setLoading(false)
        setUser({ ...response.data.user })

        localStorage.setItem(authConfig.storageTokenKeyName, response.data.accessToken)
        secureLocalStorage.setItem(localStorageKeys.userData, response.data.user)
        secureLocalStorage.setItem(localStorageKeys.abilities, response.data.abilities)

        await initAuth()

        if (isReturn) {
          const returnUrl = router.query.returnUrl
          if (params.namaevent != null) {
            await router.replace('/home/?event=true' as string)
          } else {
            router.replace(returnUrl as string)
          }
        } else {
          router.push('/home')
        }
      })
      .catch(err => {
        setLoading(false)
        if (errorCallback) errorCallback(err)
      })
  }

  const handleSocialiteLogin = async (params: { accessToken: string; namaevent: any }) => {
    try {
      setLoading(true)
      try {
        await localStorage.setItem(authConfig.storageTokenKeyName, params.accessToken)
      } catch (storageError) {
        console.error('Failed to save token to localStorage:', storageError)
      }

      const response = await HttpClient.get(authConfig.meEndpoint)
      const { user, abilities } = response.data

      setUser({ ...user })
      setAbilities(abilities)
      secureLocalStorage.setItem(localStorageKeys.userData, user)
      secureLocalStorage.setItem(localStorageKeys.abilities, abilities)

      await initAuth()

      const returnUrl = router.query.returnUrl as string
      const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/home'

      if (params.namaevent) {
        await router.replace('/home/?event=true')
      } else {
        await router.replace(redirectURL)
      }
    } catch (error) {
      setLoading(false)
      console.log('Google Login Failed:', { error, params })
    } finally {
      setLoading(false)
    }
  }

  const handleLoginSilent = async (params: LoginSilentParams, errorCallback?: ErrCallbackType) => {
    HttpClient.post(authConfig.loginSilentEndpoint, params)
      .then(async response => {
        setLoading(false)
        setUser({ ...response.data.user })
        localStorage.setItem(authConfig.storageTokenKeyName, response.data.accessToken)
        secureLocalStorage.setItem(localStorageKeys.userData, response.data.user)
        secureLocalStorage.setItem(localStorageKeys.abilities, response.data.abilities)
        initAuth()
        router.replace('/home' as string)
      })
      .catch(err => {
        setLoading(false)
        if (errorCallback) errorCallback(err)
      })
  }

  const handleLogout = async () => {
    setUser(null)
    secureLocalStorage.clear()
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    await router.push('/login')
  }

  const values = {
    user,
    abilities,
    loading,
    setUser,
    setLoading,
    socialLogin: handleSocialiteLogin,
    login: handleLogin,
    logout: handleLogout,
    loginSilent: handleLoginSilent,
    refreshSession: handleRefreshSession
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
