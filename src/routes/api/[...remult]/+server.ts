import { repo } from 'remult'
import { remultSveltekit } from 'remult/remult-sveltekit'

import { controllers, entities, User } from '../../../shared'
import { Roles } from '../../../shared/User'

export const _api = remultSveltekit({
  // dataProvider: createPostgresDataProvider({ connectionString: DATABASE_URL })
  entities: entities,
  controllers: controllers,
  getUser: async (event) => {
    const session = await event.locals.auth() // Get the session from the request
    if (!session?.user?.id) return undefined // If no session or user ID, return undefined
    const user = await repo(User).findId(session.user.id) // Find the user in the database by their session ID
    if (!user) return undefined // If no user is found, return undefined
    return {
      id: user.id,
      name: user.name,
      roles: user.is_admin ? [Roles.admin] : [], // Return roles based on admin status
    }
  },
  // TODO - allow only for admins!!!
  // admin: ()=> remult.isAllowed('admin')
  admin: true,
})

export const { GET, POST, PUT, DELETE } = _api
