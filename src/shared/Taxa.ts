import { Allow, Entity, Fields, remult } from 'remult'

const taxonRanks = [
  'family',
  'plum',
  'class',
  'order',
  'superfamily',
  'family',
  'subrfamily',
  'genera',
  'species',
  'subspecies',
] as const
export type TaxonRank = (typeof taxonRanks)[number]

@Entity('taxas', {
  allowApiCrud: Allow.authenticated,
  allowApiInsert: 'admin',
  allowApiDelete: 'admin',
})
export class Taxa {
  @Fields.cuid({
    allowApiUpdate: false,
    required: true,
    caption: 'Database ID',
  })
  id!: string

  @Fields.literal(() => taxonRanks, {
    caption: 'Taxon rank',
  })
  rank?: TaxonRank = 'species'

  @Fields.string({
    caption: 'Kingdom',
  })
  kingdom: string = 'Animalia'

  @Fields.string({
    caption: 'Plum',
  })
  plum: string = 'Arthropoda'

  @Fields.string({
    caption: 'Class',
  })
  class_rank: string = 'Insecta'

  @Fields.string({
    caption: 'Order',
  })
  order: string = 'Lepidoptera'

  @Fields.string({
    caption: 'Superfamily',
  })
  superfamily = ''

  @Fields.string({
    caption: 'Family',
  })
  family = ''

  @Fields.string({
    caption: 'Sub-family',
  })
  subfamily = ''

  @Fields.string({
    required: true,
    caption: 'Genus',
  })
  genus = ''

  @Fields.string({
    required: true,
    caption: 'Species',
  })
  species = ''

  @Fields.string({
    required: true,
    caption: 'Authorship',
  })
  authorship = ''

  @Fields.string({
    caption: 'Link to GBIF',
  })
  link_gbif = ''

  @Fields.string({
    caption: 'Link to Lepiforum.de',
  })
  link_lw = ''

  @Fields.string({
    caption: 'Link to ERMAK24.ru',
  })
  link_ermak = ''

  @Fields.string({
    caption: 'Link to OMFLIES.ru',
  })
  link_omflies = ''

  @Fields.createdAt()
  createdAt?: Date

  @Fields.updatedAt()
  updatedAt?: Date
}
