import { IUser } from "../models/user";

type CandidateContextType = {
    page: number,
    totalCandidate: number,
    setPage: (page: number) => void,
    onLoading: boolean,
    listCandidates: IUser[],
    hasNextPage: boolean,
    fetchCandidates: (payload: {take: number, search?:any, vesseltype_id?:any, roletype_id?:any, rolelevel_id?:any, include_all_word?:any, include_one_word?:any, exact_phrase?:any, exclude_all_these?:any, spoken?:any}) => Promise<void>,
}

export default CandidateContextType;