interface FormDataSeafarer {
    jobCategory?: number
    jobTitle?: string
    roleType?: number
    sailRegion?: string
    experience?: number
    city?: number
    contractDuration?: number
    vessel?: number
    dateOnBoard?: string
    rotational?: string
    licenseCOC?: any[]
    licenseCOP?: any[]
    currency?: string
    payment_periode?:string
    minimum?: number
    maximum?: number
}

interface FormDataProfessional {
    jobCategory?: number
    jobTitle?: string
    roleLevel?: number
    employmentType?: string
    workArrangement?: string
    city?: number
    education?: number
    experience?: number
    jobExpired?: string
    currency?: string
    payment_periode?: string
    minimum?: number
    maximum?: number
}

export type { FormDataSeafarer, FormDataProfessional }
