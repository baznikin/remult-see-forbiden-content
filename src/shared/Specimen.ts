import {
  Allow,
  Entity,
  EntityBase,
  Fields,
  Relations,
  remult,
  repo,
  Validators,
  type EntityFilter,
} from 'remult'

import { AccessToCollection, Collection } from './Collection'
import { Identification } from './Identification'
import { Taxa } from './Taxa'
import { OwnerField, User } from './User'

const spreadings = ['ventral', 'dorsal', 'lateral', 'natural', 'other'] as const
export type SpreadingType = (typeof spreadings)[number]

const stages = ['imago', 'pupa', 'larva', 'ovo'] as const
export type DevelopmentStage = (typeof stages)[number]

@Entity('specimens', {
  allowApiCrud: Allow.authenticated,
  apiPrefilter: async () => specimenPrefilter(),
  backendPrefilter: async () => specimenPrefilter(),
})
export class Specimen {
  @Fields.cuid({
    allowApiUpdate: false,
    required: true,
    caption: 'Database ID',
  })
  id!: string

  @Relations.toOne(() => Collection, {
    defaultIncluded: true,
    required: true,
  })
  collection?: Collection

  @Relations.toMany(() => Identification)
  identifications?: Identification[]

  @Relations.toOne(() => Taxa, { defaultIncluded: true })
  acceptedTaxa?: Taxa

  @OwnerField()
  owner!: User

  @Fields.string({
    required: true,
    caption: 'Specimen ID',
  })
  collection_id = ''

  @Fields.string({
    required: true,
    caption: 'Locality',
  })
  collection_location = ''

  @Fields.string({
    caption: 'Collection conditions',
  })
  collection_conditions = ''

  @Fields.string({
    required: true,
    caption: 'Collection date',
  })
  collection_date = ''

  @Fields.string({
    required: true,
    caption: 'Leg. collector name',
  })
  collection_collector = ''

  @Fields.string({
    caption: 'GPS coordinates',
  })
  collection_gps = ''

  @Fields.string({
    caption: 'Comment',
  })
  comment = ''

  @Fields.literal(() => spreadings, {
    caption: 'Spreading',
  })
  spreading_type: SpreadingType = 'ventral'

  @Fields.string(() => stages, {
    caption: 'Development stage',
  })
  development_stage: DevelopmentStage = 'imago'

  @Fields.string({
    caption: 'Storage location',
  })
  storage_location = ''

  @Fields.number({
    caption: 'Wing length',
  })
  metrics_winglength = 0

  @Fields.number({
    caption: 'Wing span',
  })
  metrics_wingspan = 0

  @Fields.string({
    caption: 'Ventral view',
  })
  image1: string = ''

  @Fields.string({
    caption: 'Dorsal view',
  })
  image2: string = ''

  @Fields.createdAt()
  createdAt?: Date

  @Fields.updatedAt()
  updatedAt?: Date
}

async function specimenPrefilter(): Promise<EntityFilter<Collection>> {
  let allowedCollections: Collection[] = await repo(Collection).find()
  console.log("specimenPrefilter(): allowedCollections: ", allowedCollections.length, " ", allowedCollections)
  return {
    collection: allowedCollections,
  }
}

// export class SpecimensController {
//   @BackendMethod({ allowed: true })
//   static async addIdentifications() {
//     const specimenRepo = remult.repo(Specimen)
//     const taxaRepo = remult.repo(Taxa)

//     for (const specimen of await specimenRepo.find({include: {identifications: {include: {taxa: true}} }})) {
//       const taxa = await taxaRepo.findFirst({
//         genus:specimen.Det_Genus,
//         species:specimen.Det_Species,
//       })
//       console.log(specimen.identifications)

//       if (!specimen.identifications?.length) {
//         console.log("Hey!!")
//         const identified = await specimenRepo
//           .relations(specimen)
//           .identifications.insert([{
//             taxa: taxa,
//             idName: specimen.Det_Name,
//             idDate: specimen.Det_Date,
//             ...(specimen.Sex == "M") && { sex: 'male' },
//             ...(specimen.Sex == "F") && { sex: 'female' },
//             ...(specimen.Det_Form == "ab. niko") && { form: "f. niko", formAuthorship: specimen.Det_Author },
//             ...(specimen.Det_Form == "ab.") && { isAberrated: true },
//           }])
//         // await specimenRepo.save(identified)
//       }
//       // await taskRepo.update(task.id, { completed })
//     }
//   }
// }
