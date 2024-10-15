// import { ForbiddenError, repo, type FindOptions } from 'remult'

// import { Specimen } from '../../shared/Specimen'
// import type { PageLoad } from './$types'

// export const load = (async () => {
//   const options: FindOptions<Specimen> = {
//     include: {
//       acceptedTaxa: true,
//       identifications: {
//         include: { taxa: true },
//       },
//     },
//     orderBy: { id: 'desc' },
//   }

//   try {
//     if (!repo(Specimen).metadata.apiReadAllowed) throw new ForbiddenError()
//     const specimens = await repo(Specimen).find(options)
//     return { specimens: repo(Specimen).toJson(specimens), options }
//   } catch (error: any) {
//     return { error: error}
//   }
// }) satisfies PageLoad
