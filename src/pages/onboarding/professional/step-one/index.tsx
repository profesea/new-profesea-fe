import { useRouter } from 'next/router'

const Onboarding = () => {
  const router = useRouter()
  router.replace('/onboarding/professional/step-one/1')
}

Onboarding.acl = {
  action: 'read',
  subject: 'on-boarding'
}
export default Onboarding