import IAbilities from "src/contract/models/abilities"
import { IUser } from "src/contract/models/user"

export type ErrCallbackType = (err: { [key: string]: string }) => void

export type LoginParams = {
    email: string
    password: string
    rememberMe?: boolean
    namaevent?: any
}

export type LoginSilentParams = {
    email: string
}

export type UserDataType = {
    id: number
    role: string
    email: string
    fullName: string
    username: string
    password: string
    avatar?: string | null
    build_profile_at?: string | null
}

export type AuthValuesType = {
    loading: boolean
    logout: () => void
    user: IUser | null
    abilities: IAbilities | null
    setLoading: (value: boolean) => void
    setUser: (value: IUser | null) => void
    socialLogin: (params: { accessToken: string, namaevent: any }, errorCallback?: ErrCallbackType) => void
    login: (params: LoginParams, errorCallback?: ErrCallbackType, isReturn?: boolean) => void
    loginSilent: (params: LoginSilentParams) => void
    refreshSession: () => void
}
