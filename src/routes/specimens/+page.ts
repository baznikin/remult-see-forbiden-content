import { remult, type FindOptions } from 'remult'

import { Specimen } from '../../shared/Specimen'
import type { PageLoad } from './$types'

export const load = (async () => {
  const options: FindOptions<Specimen> = {
    include: {
      acceptedTaxa: true,
      identifications: {
        include: { taxa: true },
      },
    },
    orderBy: { id: 'desc' },
  }
   
  try {
    const specimens = await remult.repo(Specimen).find(options)
    return { specimens: remult.repo(Specimen).toJson(specimens), options }
  } catch (error: any) {
    return { error: error}
  }
}) satisfies PageLoad
