import { AxiosError } from 'axios'
import { AppConfig } from 'src/configs/api'
import ITeam from 'src/contract/models/team'
import { IUser } from 'src/contract/models/user'
import { HttpClient } from 'src/services'
import authConfig from 'src/configs/auth'
import secureLocalStorage from 'react-secure-storage'
import localStorageKeys from 'src/configs/localstorage_keys'
import moment from 'moment'
import badwords from './badwords.json'
import { formatDistanceToNow } from 'date-fns'

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
    if (!text) return ''

    const words = text.split(' ')
    const capitalizedWords = words.map(word => {
        const firstLetter = word.charAt(0).toUpperCase()
        const restOfWord = word.slice(1).toLowerCase()

        return firstLetter + restOfWord
    })
    const result = capitalizedWords.join(' ')

    return result
}

function toLinkCase(text: string | undefined) {
    if (text) {
        const title = text.toString().replace(/ /g, '-')

        return title
    }

    return null
}

function linkToTitleCase(text: string | null) {
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

function getOnboardingLink(user: IUser) {
    if (user.team_id === 2) {
        if (user.employee_type === 'onship') {
            return 'seafarer'
        } else return 'professional'
    } else if (user.team_id === 3) {
        return 'employer'
    }

    return null
}

function formatIDR(amount: number, isIdr?: boolean) {
    const options: Intl.NumberFormatOptions = {
        style: 'currency',
        currency: 'IDR'
    }
    const price = new Intl.NumberFormat('id-ID', options).format(amount)

    if (isIdr) {
        return price.replace('Rp', 'IDR')
    }

    return price
}
function formatUSD(amount: number, isUsd?: boolean) {
    const options: Intl.NumberFormatOptions = {
        style: 'currency',
        currency: 'USD'
    }
    const price = new Intl.NumberFormat('en-US', options).format(amount)

    if (isUsd) {
        return price.replace('$', 'USD ')
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
        { title: 'onship', value: 'Pelaut' },
        { title: 'offship', value: 'Profesional' }
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
    if (!dob) return null

    const today = new Date()
    const birthDate = new Date(dob)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
    }

    return age
}

const MONTH_NAMES = [
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

const shortMonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const getMonthYear = (date: string | null, shortMonths?: boolean) => {
    if (!date) return null

    const newString = date.split('-')
    const year = newString[0]
    const monthIndex = parseInt(newString[1], 10)
    if (!isNaN(monthIndex) && monthIndex >= 1 && monthIndex <= 12) {
        return `${shortMonths ? shortMonthNames[monthIndex - 1] : MONTH_NAMES[monthIndex - 1]} ${year}`
    } else {
        return date
    }
}

const getDateMonth = (date: Date | null, shortMonths?: boolean, withYear?: boolean) => {
    if (!date) return null

    const today = date.getDate()
    const month = date.getMonth()
    const year = date.getFullYear()

    return `${today} ${shortMonths ? shortMonthNames[month] : MONTH_NAMES[month]} ${withYear ? year : ''}`
}

function getFormattedDate(date: any, prefomattedDate: any = false, hideYear: any = false) {
    const day = date.getDate()
    const month = MONTH_NAMES[date.getMonth()]
    const year = date.getFullYear()
    const hours = date.getHours()
    let minutes = date.getMinutes()

    if (minutes < 10) {
        minutes = `0${minutes}`
    }

    if (prefomattedDate) {
        return `${prefomattedDate} at ${hours}:${minutes}`
    }

    if (hideYear) {
        return `${day}. ${month} at ${hours}:${minutes}`
    }

    return `${day}. ${month} ${year}. at ${hours}:${minutes}`
}

function timeAgo(dateParam: any) {
    if (!dateParam) {
        return null
    }

    const date = typeof dateParam === 'object' ? dateParam : new Date(dateParam)
    const DAY_IN_MS = 86400000 // 24 * 60 * 60 * 1000
    const today = new Date()
    const yesterday = new Date((today as any) - DAY_IN_MS)
    const seconds = Math.round(((today as any) - date) / 1000)
    const minutes = Math.round(seconds / 60)
    const isToday = today.toDateString() === date.toDateString()
    const isYesterday = yesterday.toDateString() === date.toDateString()
    const isThisYear = today.getFullYear() === date.getFullYear()

    if (seconds < 5) {
        return 'now'
    } else if (seconds < 60) {
        return `${seconds} seconds ago`
    } else if (seconds < 90) {
        return 'about a minute ago'
    } else if (minutes < 60) {
        return `${minutes} minutes ago`
    } else if (isToday) {
        return getFormattedDate(date, 'Today')
    } else if (isYesterday) {
        return getFormattedDate(date, 'Yesterday')
    } else if (isThisYear) {
        return getFormattedDate(date, false, true)
    }

    return getFormattedDate(date)
}

function timeCreated(createdAt: any, type?: string) {
    if (!createdAt) return null

    const createdTime = moment(createdAt)
    const now = moment()
    const secondDifferent = now.diff(createdTime, 'seconds')
    const monthsDifferent = now.diff(createdTime, 'months')

    const secondsInMinute = 60
    const secondsInHour = 3600
    const secondsInDay = 86400
    const secondsInWeek = 604800

    if (type === 'feed') {
        if (secondDifferent < secondsInMinute) {
            return `${secondDifferent} s`
        } else if (secondDifferent < secondsInHour) {
            return `${Math.floor(secondDifferent / secondsInMinute)} m`
        } else if (secondDifferent < secondsInDay) {
            return `${Math.floor(secondDifferent / secondsInHour)} h`
        } else if (secondDifferent < secondsInWeek) {
            return `${Math.floor(secondDifferent / secondsInDay)} d`
        } else {
            return `${Math.floor(secondDifferent / secondsInWeek)} w`
        }
    }

    if (monthsDifferent >= 3) {
        return 'several months ago'
    } else {
        return createdTime.fromNow()
    }
}

const normalizeContent = (content: string) => {
    return (
        content
            .replace(/[@]/g, 'a') // Ganti @ dengan a
            // .replace(/[!]/g, 'i') // Ganti ! dengan i
            .replace(/[$]/g, 's') // Ganti $ dengan s
            .replace(/[#]/g, 'h') // Ganti # dengan h
        //   .replace(/\s+/g, '') // Hilangkan semua spasi antar huruf
    )
}

// Fungsi untuk menyensor kata buruk dengan *
// const censorBadWords = (content: string) => {
//   let censoredContent = content

//   for (let badWord of badwords['badwords']) {
//     const regex = new RegExp(badWord, 'gi') // Cari kata buruk secara case-insensitive
//     censoredContent = censoredContent.replace(regex, '*'.repeat(badWord.length)) // Ganti dengan *
//   }

//   return censoredContent
// }

const censorBadWords = (content: string) => {
    let censoredContent = content

    for (const badWord of badwords['badwords']) {
        // Regex untuk mencocokkan kata lengkap, menggunakan \b sebagai batas kata
        const regex = new RegExp(`\\b${badWord}\\b`, 'gi') // Cari kata lengkap secara case-insensitive
        censoredContent = censoredContent.replace(regex, '*'.repeat(badWord.length)) // Ganti dengan *
    }

    return censoredContent
}

const validateAutomatedContentModeration = (content: string) => {
    const normalizedContent = normalizeContent(content) // Normalisasi konten

    let errorMessage = null
    // Jika ada kata buruk yang terdeteksi
    for (const badWord of badwords['badwords']) {
        if (normalizedContent.toLowerCase().includes(badWord.toLowerCase())) {
            errorMessage =
                'Your post contains language that may not align with our community guidelines. For a positive community experience, please review and remove any offensive content before submitting.'
            break
        }
    }

    const censoredContent = censorBadWords(normalizedContent) // Ganti kata buruk dengan *

    return { errorMessage, censoredContent }
}

const calculateDaysDifference = (start: any, end: any) => {
    if (!start || !end) return null

    if (start > end) return 'Expired'

    const diffInMs = end - start
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInDays < 30) {
        return `${diffInDays} Day${diffInDays > 1 ? 's' : ''}`
    } else if (diffInDays < 365) {
        const diffInMonths = Math.ceil(diffInDays / 30)

        return `${diffInMonths} Month${diffInMonths > 1 ? 's' : ''}`
    } else {
        const diffInYears = Math.ceil(diffInDays / 365)

        return `${diffInYears} Year${diffInYears > 1 ? 's' : ''}`
    }
}

const dateProgress = (start: Date, end: Date) => {
    if (!start || !end) return null

    const current = Date.now()

    const totalDuration = end.getTime() - start.getTime()
    const elapsedDuration = Math.max(0, current - start.getTime())

    const progress = (elapsedDuration / totalDuration) * 100

    return Math.min(100, progress)
}

const renderSalary = (salaryStart: any, salaryEnd: any, currency: string) => {
    if (salaryStart == 0) {
        return '-'
    }

    if (salaryStart) {
        return `${salaryStart.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} ${salaryEnd !== null && salaryEnd !== salaryStart && salaryEnd != 0
                ? `- ${salaryEnd.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} ${currency}`
                : currency
            }`
    } else {
        return 'Undisclosed'
    }
}

function renderTimeAgo(dateString: string): string {
    const date = new Date(dateString) // Parse the date string

    return `${formatDistanceToNow(date)} ago`
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
    getOnboardingLink,
    formatIDR,
    formatUSD,
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
    getMonthYear,
    getDateMonth,
    timeAgo,
    timeCreated,
    validateAutomatedContentModeration,
    calculateDaysDifference,
    dateProgress,
    renderSalary,
    renderTimeAgo
}
