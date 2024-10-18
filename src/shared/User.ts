import type { ProviderType } from '@auth/sveltekit/providers'
import type { hash } from '@node-rs/argon2'

import { Allow, Entity, Fields, Relations, remult, repo, Validators } from 'remult'

export const Roles = {
  admin: 'admin',
}

@Entity('users', {
  allowApiCrud: Allow.authenticated, // Only authenticated users can perform CRUD operations
  allowApiDelete: Roles.admin, // Only admin users can delete
  allowApiInsert: Roles.admin, // Only admin users can create new entries
  apiPrefilter: () => {
    // Defines a prefilter to restrict data access based on user roles
    if (remult.isAllowed(Roles.admin)) return {} // Admin can see all users
    return {
      id: remult.user!.id, // Non-admin users can only access their own data
    }
  },
})
export class User {
  @Fields.cuid({
    caption: 'Database ID',
    required: true,
  })
  id!: string

  @Fields.string({
    required: true,
    validate: Validators.unique(),
  })
  email = ''

  @Fields.string({ includeInApi: false }) // Password field is not exposed in API responses
  password = ''

  @Fields.string<User>({
    // This field is used for updating the password without exposing the actual password column
    serverExpression: () => '***', // Hides the value when retrieved from the server
    saving: async (user, fieldRef, e) => {
      if (e.isNew || fieldRef.valueChanged()) {
        // If the user is new or the password has changed
        user.password = await User.hashPassword(user.updatePassword) // Hash the new password using the injected hashing function
      }
    },
  })
  updatePassword = '' // Placeholder field for password updates, not persisted directly

  @Fields.string()
  name = ''

  @Fields.boolean({
    allowApiUpdate: Roles.admin, // Only admins can update this field
  })
  is_admin = false

  @Fields.createdAt()
  createdAt?: Date

  @Fields.updatedAt()
  updatedAt?: Date

  @Fields.string({ includeInApi: Roles.admin }) // Only admins can see this
  providerType: ProviderType = 'credentials'

  @Fields.string({ includeInApi: Roles.admin }) // Admins can see the OAuth provider (e.g., GitHub)
  provider = ''

  @Fields.string({ includeInApi: Roles.admin }) // Admins can see the user's provider account ID (e.g., GitHub user ID)
  providerAccountId = ''

  static hashPassword: typeof hash // A static function for password hashing, injected in `auth.ts`
}

export function OwnerField() {
  return Relations.toOne(() => User, {
    allowApiUpdate: false,
    saving: async (_, fieldRef, e) => {
      if (e.isNew) {
        if (remult.user?.id) fieldRef.value = <User>await repo(User).findId(remult.user.id)
        if (fieldRef.valueIsNull()) fieldRef.error = 'requires signed in user'
      }
    },
  })
}
