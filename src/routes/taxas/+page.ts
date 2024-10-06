import { remult, type FindOptions } from 'remult'

import { Taxa } from '../../shared/Taxa'

export const load = async ({ url }) => {
  const options: FindOptions<Taxa> = {
    orderBy: { genus: 'asc', species: 'asc' },
  }
  const taxas = await remult.repo(Taxa).find(options)

  return { taxas: remult.repo(Taxa).toJson(taxas), options }
}
