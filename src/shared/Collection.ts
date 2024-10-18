import { Allow, Entity, Fields, Relations, remult, repo, Validators, type EntityFilter } from 'remult'

import { OwnerField, Roles, User } from './User'

const visibility_settings = ['public', 'authenticated', 'private', 'specified_users'] as const
export type VisibilitySetting = (typeof visibility_settings)[number]

@Entity('collections', {
  allowApiCrud: Allow.authenticated,
  allowApiRead: true,
  apiPrefilter: async () => collectionPrefilter(),
  backendPrefilter: async () => collectionPrefilter(),
})
export class Collection {
  @Fields.cuid({
    allowApiUpdate: false,
    required: true,
    caption: 'Database ID',
  })
  id!: string

  @OwnerField()
  owner!: User

  @Fields.string({
    required: true,
    caption: 'Collection name',
  })
  name = ''

  @Fields.string({
    required: true,
    validate: [Validators.unique],
    caption: 'Prefix',
  })
  prefix = ''

  @Fields.string({
    required: true,
    caption: 'Prefix-name separator',
  })
  separator = '-'

  @Fields.literal(() => visibility_settings, {
    caption: 'Visibility settings',
  })
  visibility_setting: VisibilitySetting = 'public'

  // used only if `visibility_setting` == `specified_users`
  @Relations.toMany(() => AccessToCollection, 'collectionId')
  allowedUsers?: AccessToCollection[]

  @Fields.createdAt()
  createdAt?: Date

  @Fields.updatedAt()
  updatedAt?: Date
}

@Entity<AccessToCollection>('accessToCollection', {
  id: {
    collectionId: true,
    userId: true,
  },
})
export class AccessToCollection {
  @Fields.string()
  collectionId = ''
  @Fields.string()
  userId = ''
  @Relations.toOne<AccessToCollection, Collection>(() => Collection, 'collectionId')
  collection?: Collection
  @Relations.toOne<AccessToCollection, User>(() => User, 'userId')
  user?: User
  // TODO add `acitve: boolean` field to allow change visibility setting and still keep vist of users
}

async function collectionPrefilter(): Promise<EntityFilter<Collection>> {
  console.log(new Error().stack);
    let filter: EntityFilter<Collection>[] = [
    {
      visibility_setting: 'public',
    },
  ]

  if (remult.authenticated()) {
    filter.push({
      visibility_setting: 'authenticated',
    })

    const user = await repo(User).findId(remult.user!.id)
    filter.push({
      visibility_setting: ['private', 'specified_users'],
      owner: user!,
    })

    await repo(AccessToCollection).find({
      where: {
        userId: remult.user!.id,
      },
    })

    let allowedForUser: string[] = (
      await repo(AccessToCollection).find({
        where: {
          userId: remult.user!.id,
        },
      })
    ).map((x) => x.collectionId!)

    if (allowedForUser.length)
      filter.push({
        visibility_setting: 'specified_users',
        id: allowedForUser
      })
  }

  console.log('collectionPrefilter(): filter: ', filter)
  return { $or: filter };
}