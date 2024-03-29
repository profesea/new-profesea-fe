import { ReactNode, ReactElement, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from 'src/hooks/useAuth'
import secureLocalStorage from 'react-secure-storage';
import localStorageKeys from 'src/configs/localstorage_keys';

interface AuthGuardProps {
  children: ReactNode;
  fallback: ReactElement | null;
}

const AuthGuard = (props: AuthGuardProps) => {
  const { children, fallback } = props;
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) {
      return
    }

    const noGuardPaths = ["/"];
    if (!noGuardPaths.includes(router.asPath)) {
      if (auth.user === null && !secureLocalStorage.getItem(localStorageKeys.userData)) {
        router.replace({
          pathname: '/login',
          query: { returnUrl: '' }
        });
      }
    }
  }, [router, auth]);

  if (auth.loading || auth.user === null) {
    return fallback
  }

  return <>{children}</>
}

export default AuthGuard
