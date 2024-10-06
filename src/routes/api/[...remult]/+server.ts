import { remultSveltekit } from 'remult/remult-sveltekit'
import { controllers, entities, Task } from '../../../shared'
import type { UserInfo } from 'remult'

export const _api = remultSveltekit({
  // dataProvider: createPostgresDataProvider({ connectionString: DATABASE_URL })
  entities,
  controllers,
  getUser: async (event) => {
    const auth = await event?.locals?.auth() 
    return auth?.user as UserInfo
  },
  // TODO - allow only for admins!!!
  // admin: ()=> remult.isAllowed('admin')
  admin: true,
})

export const { GET, POST, PUT, DELETE } = _api
