import { AxiosError } from 'axios'
import { AppConfig } from 'src/configs/api'
import ITeam from 'src/contract/models/team'
import { IUser } from 'src/contract/models/user'
import { HttpClient } from 'src/services'
import authConfig from 'src/configs/auth'
import secureLocalStorage from 'react-secure-storage'
import localStorageKeys from 'src/configs/localstorage_keys'
/**
 * we need to sanitize error messages, so that no sensitive data is leaked
 */
const getCleanErrorMessage = (error: any) => {
    let errorMessage = 'Something went wrong!'

    if (error instanceof AxiosError) {
        errorMessage = error?.response?.data?.message ?? errorMessage
    }

    if (typeof error == 'string') {
        errorMessage = error
    }

    return errorMessage
}

const removeFirstZeroChar = (input: string) => {
    if (input.startsWith('0')) {
        return input.substring(1)
    }

    return input
}

function toTitleCase(text: string) {
    // Split the text into an array of words
    const words = text.split(' ')

    // Capitalize the first letter of each word
    const capitalizedWords = words.map(word => {
        const firstLetter = word.charAt(0).toUpperCase()
        const restOfWord = word.slice(1).toLowerCase()

        return firstLetter + restOfWord
    })

    // Join the capitalized words back into a sentence
    const result = capitalizedWords.join(' ')

    return result
}

function toLinkCase(text: string | undefined) {
    if (text) {
        const title = text.replace(/ /g, '-')

        return title
    }

    return null
}

function linkToTitleCase(text: string | undefined) {
    if (text) {
        const title = text.replace(/-/g, ' ')

        return title
    }

    return null
}

function textEllipsis(text: string, number: number) {
    if (text) {
        let words = text.split(' ')
        if (words.length > number) {
            words = words.slice(0, number).concat(words[number] + '...')
        }

        return words.join(' ')
    }

    return null
}

function getUserAvatar(userData: IUser) {
    return userData?.photo ? userData.photo : '/images/avatars/default-user.png'
}

function getUserAvatarByPath(path: string) {
    return path ? path : '/images/avatars/default-user.png'
}

function getUserRoleName(team?: ITeam) {
    const teamName = team?.teamName ?? ''
    const mapRole = [
        { title: 'Seafarer', value: 'Candidate' },
        { title: 'Company', value: 'Recruiter' }
    ]
    const newValue = mapRole.find(e => e.title == teamName)

    return newValue ? newValue.value : teamName
}

function formatIDR(amount: number, isIdr?: boolean) {
    const options: Intl.NumberFormatOptions = {
        style: 'currency',
        currency: 'IDR'
    }
    const price = new Intl.NumberFormat('id-ID', options).format(amount)

    if (isIdr) {
        return price.replace('Rp', 'IDR');
    }

    return price
}

function isDevelopment() {
    return AppConfig.appEnv == 'DEV'
}

function isStaging() {
    return AppConfig.appEnv == 'STAGING'
}

function isProduction() {
    return AppConfig.appEnv == 'PROD'
}

async function refreshsession() {
    await HttpClient.get(authConfig.meEndpoint).then(async response => {
        secureLocalStorage.setItem(localStorageKeys.userData, response.data.user)
        secureLocalStorage.setItem(localStorageKeys.abilities, response.data.abilities)
    })
}

function getUrl(path?: string) {
    let baseUrl = `${window.location.protocol}//${window.location.host}`
    if (path) {
        baseUrl = baseUrl + path
    }

    return baseUrl
}

function getEmployeetype(name?: string) {
    const employee = name ?? ''
    const mapRole = [
        { title: 'onship', value: 'On-ship' },
        { title: 'offship', value: 'Off-Ship' }
    ]
    const newValue = mapRole.find(e => e.title == employee)

    return newValue ? newValue.value : employee
}
function getEmployeetypev2(name?: string) {
    const employee = name ?? ''
    const mapRole = [
        { title: 'onship', value: 'PELAUT' },
        { title: 'offship', value: 'PROFESIONAL' }
    ]
    const newValue = mapRole.find(e => e.title == employee)

    return newValue ? newValue.value : employee
}

const getUserPlanType = (user: IUser | null) => {
    if (!user) {
        return ''
    }

    if (!user.plan_type || user.plan_type == 'basic') {
        return 'basic'
    }

    return user.plan_type
}
function subscribev(id: string[]) {
    const abilities = secureLocalStorage.getItem(localStorageKeys.abilities) as IUser
    let newValue = ''
    for (let i = 0; i < id.length; i++) {
        newValue = abilities?.items.find((e: any) => e.code == id[i])
        if (newValue != undefined) break
    }
    console.log('here 1', newValue)

    return newValue ? true : false
}

const translateTrxStatus = (s: string) => {
    const map = new Map<string, string>([
        ['canceled', 'Dibatalkan'],
        ['paid', 'Pembayaran diterima'],
        ['unpaid', 'Menunggu pembayaran']
    ])

    return map.get(s) ?? 'Undefined'
}

const toMegaByte = (size: number, stringify = false) => {
    const n = (size / 1024 / 1024).toFixed(2)
    if (stringify) {
        return `${n}Mb`
    }

    return n
}

const calculateAge = (dob: any) => {
    const today = new Date()
    const birthDate = new Date(dob)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    // If the birthday hasn't occurred yet this year, subtract one year
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
    }

    return age
}

const getMonthYear = (date: string) => {
    const newString = date.split('-')
    const year = newString[0]
    const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ]
    const monthIndex = parseInt(newString[1], 10)
    if (!isNaN(monthIndex) && monthIndex >= 1 && monthIndex <= 12) {
        return `${monthNames[monthIndex - 1]} ${year}`
    } else {
        return date
    }
}

export {
    getCleanErrorMessage,
    removeFirstZeroChar,
    toTitleCase,
    toLinkCase,
    linkToTitleCase,
    textEllipsis,
    getUserAvatar,
    getUserRoleName,
    formatIDR,
    isStaging,
    isDevelopment,
    isProduction,
    refreshsession,
    getUrl,
    getEmployeetype,
    getUserPlanType,
    getEmployeetypev2,
    getUserAvatarByPath,
    subscribev,
    translateTrxStatus,
    toMegaByte,
    calculateAge,
    getMonthYear
}
