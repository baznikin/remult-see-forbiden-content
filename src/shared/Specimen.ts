import { Allow, Entity, EntityBase, Fields, Relations, remult, Validators } from 'remult'

import { Collection } from './Collection'
import { Identification } from './Identification'
import { Taxa } from './Taxa'
import { User } from './User'

const spreadings = ['ventral', 'dorsal', 'lateral', 'natural', 'other'] as const
export type SpreadingType = (typeof spreadings)[number]

const stages = ['imago', 'pupa', 'larva', 'ovo'] as const
export type DevelopmentStage = (typeof stages)[number]

@Entity('specimens', {
  allowApiCrud: Allow.authenticated,
  // apiPrefilter: (sss) => {
  //   return entity?.collection.visibility_setting == 'public'
  // },

  // backendPrefilter: () => remult.authenticated()?{}:{id:[]}
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

  @Relations.toOne(() => User, {
    allowApiUpdate: false,
    required: true,
    validate: [Validators.notNull],
    saving: async (_, fieldRef, e) => {
      if (remult.user?.id) fieldRef.value = <User>await remult.repo(User).findId(remult.user.id)
      // TODO add fallback as 'system user'?
    },
  })
  owner: User = <User>remult.user

  @Fields.string({
    required: true,
    caption: 'Specimen ID',
  })
  collection_id: string = ''

  @Fields.string({
    required: true,
    caption: 'Locality',
  })
  collection_location: string = ''

  @Fields.string({
    caption: 'Collection conditions',
  })
  collection_conditions: string = ''

  @Fields.string({
    required: true,
    caption: 'Collection date',
  })
  collection_date: string = ''

  @Fields.string({
    required: true,
    caption: 'Leg. collector name',
  })
  collection_collector: string = ''

  @Fields.string({
    caption: 'GPS coordinates',
  })
  collection_gps: string = ''

  @Fields.string({
    caption: 'Comment',
  })
  comment: string = ''

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
  storage_location: string = ''

  @Fields.number({
    caption: 'Wing length',
  })
  metrics_winglength = ''

  @Fields.number({
    caption: 'Wing span',
  })
  metrics_wingspan = ''

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

  // // tmp
  //   @Fields.string()
  //   Sex?: string
  //   @Fields.string()
  //   Det_Genus?: string
  //   @Fields.string()
  //   Det_Species?: string
  //   @Fields.string()
  //   Det_Form?: string
  //   @Fields.string()
  //   Det_Author?: string
  //   @Fields.string()
  //   Det_Name?: string
  //   @Fields.string()
  //   Det_Date?: string
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
