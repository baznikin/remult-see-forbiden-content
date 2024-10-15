import { SvelteKitAuth } from '@auth/sveltekit'
import Credentials from '@auth/sveltekit/providers/credentials'
import { hash, verify } from '@node-rs/argon2'
import type { Handle, RequestEvent } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'

import { remult, repo, withRemult, type UserInfo } from 'remult'

import { _api } from './routes/api/[...remult]/+server'
import { Roles, User } from './shared/User'

// Assign the password hashing function to User's static method
User.hashPassword = hash

/**
 * Handle authentication with authjs as an example
 * Based on article at https://authjs.dev/reference/sveltekit
 */
export const { handle: handleAuth } = SvelteKitAuth({
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        email: {
          placeholder: 'Try steve@local(123) or jane@local(123)',
        },
        password: {
          type: 'password', // The input field for password
        },
      },
      authorize: (credentials) =>
        // This function runs when a user tries to sign in
        withRemult(async () => {
          // The withRemult function provides the current Remult context (e.g., repository, authenticated user, etc.)
          // to any Remult-related operations inside this block. This ensures that `remult` functions such as
          // repository queries or checking user permissions can be executed correctly within the request's context.
          let user = await remult.repo(User).findFirst({
            email: <string>credentials?.email,
            providerType: 'credentials',
          })

          if (user && (await verify(user.password, credentials.password as string))) {
            return {
              id: user.id,
              name: user.name,
              roles: [] /* user.roles, */,
            }
          }

          return null // No user found or credentials are invalid
        }),
    }),
  ],
  callbacks: {
    signIn: (arg) =>
      withRemult(async () => {
        // This callback runs after sign-in
        if (arg.account?.type === 'credentials') return true // If credentials-based login, allow sign-in
        let user = await repo(User).findFirst({
          // Find the user by OAuth provider and account ID
          provider: arg.account?.provider,
          providerType: arg.account?.type,
          providerAccountId: arg.account?.providerAccountId,
        })
        if (!user) {
          // If no user exists with this OAuth account, create one
          user = await repo(User).insert({
            name: arg.profile?.name || '', // Use the OAuth profile name
            providerType: arg.account?.type, // Store the type of OAuth provider (e.g., GitHub)
            provider: arg.account?.provider || '',
            providerAccountId: arg.account?.providerAccountId || '',
          })
        }
        arg.user!.id = user.id // Set the user's ID in the session
        return true
      }),
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          name: token.name,
          id: token.sub, // Use the token's subject (user ID)
        },
      }
    },
  },
})

/**
 * Handle remult server side
 */
const handleRemult: Handle = async ({ event, resolve }) => {
  return await _api.withRemult(event, async () => await resolve(event))
}

export const handle = sequence(
  // 1. Handle authentication
  handleAuth,
  // 2. Handle remult server side
  handleRemult,
)
