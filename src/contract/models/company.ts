import Address from './address'
import ITeam from './team'

interface IIndustry {
  id: number
  name: string
  created_at: string
  updated_at: string
}

export default interface Company {
  id: number
  team_id: number
  country_id: number
  industry_id?: number
  employee_type: string
  name: string
  username: string
  email: string
  phone: string
  email_verified_at: string
  website?: string
  plan_type?: string
  created_at: string
  updated_at: string
  about?: string
  photo: string
  banner?: string
  role: string
  team: ITeam
  address: Address
  industry?: IIndustry
}
