import { Entity, EntityBase, Fields, Relations, remult, repo, Validators } from 'remult'

import { Specimen } from './Specimen'
import { Taxa } from './Taxa'
import { OwnerField, User } from './User'

const sexes = ['unknown', 'male', 'female', 'gynandromorph'] as const
export type Sex = (typeof sexes)[number]

// add `status` = [accepted, outdated, proposed, declined]
//      accepted - collection owner selected ID
//      outdated - previous accepted ID (for historical reasons)
//      proposed - ID by someone else. Can change state to `accepted` or `declined`
//      declined - collection owner disagrees with ID
const idstatuses = ['accepted', 'outdated', 'proposed', 'declined'] as const
export type IdentificationStatus = (typeof idstatuses)[number]

@Entity<Identification>('identifications', {
  allowApiCrud: true,
  saved: async (id, e) => {
    // Enforce only one `accepted` identification for each specimen
    if ((e.fields.status.valueChanged() || e.isNew) && id.status == 'accepted') {
      // make sure the relation is loaded
      const s = await e.fields.specimen.load()
      const t = await e.fields.taxa.load()

      // outdate previous accepted identification
      await remult
        .repo(Specimen)
        .relations(s!)
        .identifications.updateMany({
          where: {
            id: { $not: id.id },
            status: 'accepted',
          },
          set: {
            status: 'outdated',
          },
        })

      await repo(Specimen).update(s!, { acceptedTaxa: t })
    }
  },
})
export class Identification {
  @Fields.cuid({
    allowApiUpdate: false,
    required: true,
    caption: 'Database ID',
  })
  id!: string

  @Relations.toOne(() => Taxa, {
    // TODO on saving - "Taxa: Should not be empty"
    // required: true
  })
  taxa?: Taxa

  @Relations.toOne(() => Specimen, {
    // TODO on saving - "Specimen: Shoud not be empty"
    // required: true
  })
  specimen?: Specimen

  @OwnerField()
  owner!: User

  @Fields.literal(() => idstatuses, {
    caption: 'Status',
  })
  status?: IdentificationStatus

  @Fields.string({
    caption: 'Form name',
    // TODO add validation - can be accessible only for "species" taxa ideintification (not genera or higher)
  })
  form? = ''

  @Fields.string({
    caption: 'Form authorship',
    // TODO add validation - can be accessible only for "species" taxa ideintification (not genera or higher)
  })
  formAuthorship? = ''

  // TODO - in this case taxa points to parent taxon rank
  @Fields.string({
    caption: 'Subspecies name',
  })
  customTaxon? = ''

  // TODO - in this case taxa points to parent taxon rank
  @Fields.string({
    caption: 'Subspecies authorship',
  })
  customTaxonAuthorship? = ''

  @Fields.literal(() => sexes, {
    caption: 'Sex',
  })
  sex?: Sex = 'unknown'

  @Fields.boolean({
    caption: 'Is aberratied?',
  })
  isAberrated?: boolean = false

  // TODO - add link to User; save his name into this field
  //        if user change his name - notify collection owner and give UI to update changes or keep id_name as is
  @Fields.string({
    caption: 'Who make identification',
  })
  idName = ''

  @Fields.string({
    caption: 'Det. date',
  })
  idDate = ''

  @Fields.createdAt()
  createdAt?: Date

  @Fields.updatedAt()
  updatedAt?: Date
}
