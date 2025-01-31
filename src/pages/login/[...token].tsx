// ** React Imports
import { ReactNode, useEffect } from 'react'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { useRouter } from 'next/router'
import { useAuth } from 'src/hooks/useAuth'
import Spinner from 'src/@core/components/spinner'

const GoogleLogin = () => {
  const auth = useAuth()
  const router = useRouter()
  const { token } = router.query

  useEffect(() => {
    if (token) {
      const accessToken = decodeURIComponent(token as string)
      auth.socialLogin({ accessToken, namaevent: null })
    }
  }, [token])

  return <Spinner />
}

GoogleLogin.guestGuard = true
GoogleLogin.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default GoogleLogin
