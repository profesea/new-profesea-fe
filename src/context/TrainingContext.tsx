import { ReactNode, createContext, useMemo, useState } from 'react'
import { AppConfig } from 'src/configs/api'
import Training from 'src/contract/models/training'
import TrainingContextType from 'src/contract/types/training_context_type'
import { HttpClient } from 'src/services'

type Props = { children: ReactNode }
const defaultValue: TrainingContextType = {
  page: 1,
  totalTraining: 0,
  setPage: () => {},
  listTrainings: [],
  onLoading: false,
  hasNextPage: false,
  fetchTrainings: () => Promise.resolve(),
  joinTraining: () => Promise.resolve(),
  updateScore: () => Promise.resolve()
}

const TrainingContext = createContext(defaultValue)

const TrainingProvider = (props: Props) => {
  const [page, setPage] = useState(1)
  const [listTrainings, setTrainings] = useState<Training[]>([])
  const [onLoading, setOnLoading] = useState(false)
  const [hasNextPage, setHasNextPage] = useState(true)
  const [totalTraining, setTotalTraining] = useState(0)

  // const fetchTrainings = async (
  //   payload: {
  //     take: number
  //     ongoing?: any
  //     instant?: any
  //     category_id?: any
  //     search?: any
  //     username?: any
  //   },
  //   isPublic?: boolean
  // ) => {
  //   if (onLoading) return // Prevent redundant calls

  //   setOnLoading(true)

  //   try {
  //     const response = await HttpClient.get(AppConfig.baseUrl + isPublic ? 'public/data/training' : '/training', {
  //       page: page,
  //       ...payload
  //     })

  //     if (response.status == 200) {
  //       const { trainings } = response.data as {
  //         trainings: { data: Training[]; next_page_url?: string; total: number }
  //       }

  //       // setTrainings(old => {
  //       //   const newTrainings = trainings.data.filter(t => !old.some(o => o.id === t.id))
  //       //   return [...old, ...newTrainings]
  //       // })

  //       setTrainings(old => {
  //         const newItems = page === 1 ? trainings.data : [...old, ...trainings.data]
  //         setTotalTraining(newItems.length)

  //         return newItems
  //       })

  //       // setTotalTraining(trainings.total)

  //       // if (trainings.data.length && trainings.data.length > 0) {
  //       //   setTrainings(old => {
  //       //     const existingTrainingId = new Set(old.map(training => training.id))
  //       //     const newTrainings = trainings.data.filter(job => !existingTrainingId.has(job.id))
  //       //     const newItems = [...old, ...newTrainings]
  //       //     setTotalTraining(newItems.length)

  //       //     return newItems
  //       //   })
  //       //   // if(payload.take > 5){
  //       //   // setPage(page => page + 1)
  //       //   // }
  //       // }
  //       // setTotalTraining(trainings.total)
  //       setHasNextPage(trainings.next_page_url != null)
  //     }
  //   } catch (error) {
  //     console.error(error)
  //   }

  //   setOnLoading(false)
  // }

  const fetchTrainings = async (
    payload: {
      take: number
      ongoing?: any
      instant?: any
      category_id?: any
      search?: any
      username?: any
    },
    isPublic?: boolean
  ) => {
    if (onLoading && !hasNextPage) return // Cegah load kalau lagi loading atau udah habis

    setOnLoading(true)

    try {
      const response = await HttpClient.get(
        isPublic ? AppConfig.baseUrl + '/public/data/training' : AppConfig.baseUrl + '/training',
        {
          page: page,
          ...payload
        }
      )

      if (response.status == 200) {
        const { trainings } = response.data as {
          trainings: { data: Training[]; next_page_url?: string; total: number }
        }

        setTrainings(prevTrainings => {
          const newTrainings = page === 1 ? trainings.data : [...prevTrainings, ...trainings.data]

          return newTrainings
        })
        // setTrainings(trainings?.data)

        setHasNextPage(trainings.next_page_url != null)
        setTotalTraining(trainings.total || 0)

        if (trainings.next_page_url) {
          setPage(prev => prev + 1) // Kalau masih ada next, naikin page
        }
      }
    } catch (error) {
      console.error(error)
    }

    setOnLoading(false)
  }

  const joinTraining = async (id: any) => {
    try {
      const response = await HttpClient.get(`/training/${id}/join`)

      if (response.status == 200) {
        setTrainings([])
        setPage(1)
        setHasNextPage(true)
      }
    } catch (error) {
      console.error(error)
    }

    setOnLoading(false)
  }

  const updateScore = async (id: any, payload: { user_id: number; result_id: number; score?: number }) => {
    if (payload?.score) setOnLoading(true)

    try {
      const response = await HttpClient.post(AppConfig.baseUrl + `/training/${id}/result`, {
        ...payload
      })

      if (response.status == 200) {
        setOnLoading(true)
      }
    } catch (error) {
      console.error(error)
    }

    setOnLoading(false)
  }

  const values = useMemo(
    () => ({
      page,
      setPage,
      listTrainings,
      totalTraining,
      onLoading,
      hasNextPage,
      fetchTrainings,
      joinTraining,
      updateScore
    }),
    [page, setPage, listTrainings, totalTraining, onLoading, hasNextPage, fetchTrainings, joinTraining, updateScore]
  )

  return <TrainingContext.Provider value={values}>{props.children}</TrainingContext.Provider>
}

export { TrainingProvider }

export default TrainingContext
