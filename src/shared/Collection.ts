import { Allow, Entity, Fields, Relations, remult, Validators } from 'remult'

import { User } from './User'

const visibility_settings = ['public', 'authenticated', 'private', 'specified_users'] as const
export type VisibilitySetting = (typeof visibility_settings)[number]

@Entity('collections', {
  allowApiCrud: Allow.authenticated,
  allowApiRead: true,
  apiPrefilter: () => {
    // Admins can access all rows
    if (remult.isAllowed('admin')) return {}

    // Non-admins can only access rows where they are the owner
    return { owner: remult.user!.id }
  },
  // backendPrefilter: () => remult.authenticated()?{}:{id:[]}
})
export class Collection {
  @Fields.cuid({
    allowApiUpdate: false,
    required: true,
    caption: 'Database ID',
  })
  id!: string

  @Relations.toOne(() => User, {
    allowApiUpdate: false,
    validate: [Validators.notNull],
    saving: async (_, fieldRef, e) => {
      if (e.isNew && !fieldRef.value)
        if (remult.user?.id) fieldRef.value = <User>await remult.repo(User).findId(remult.user.id)
      // TODO add fallback as 'system user'?
    },
  })
  owner: User = <User>remult.user

  @Fields.string({
    required: true,
    caption: 'Collection name',
  })
  name: string = ''

  @Fields.string({
    required: true,
    validate: [Validators.unique],
    caption: 'Prefix',
  })
  prefix: string = ''

  @Fields.string({
    required: true,
    caption: 'Prefix-name separator',
  })
  separator: string = '-'

  @Fields.literal(() => visibility_settings, {
    caption: 'Visibility settings',
  })
  visibility_setting: VisibilitySetting = 'public'

  @Fields.string({
    caption: 'Users on allowed to see',
  })
  visibility_allowed_user_ids?: string[]

  @Fields.createdAt()
  createdAt?: Date

  @Fields.updatedAt()
  updatedAt?: Date
}
