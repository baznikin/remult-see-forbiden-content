import { beforeEach, describe, expect, test } from 'vitest'

import { InMemoryDataProvider, remult, repo } from 'remult'

import { Collection } from './Collection'
import { Specimen } from './Specimen'
import { User } from './User'

describe('access control on models Collection and Specimen', async () => {
  let owner: User, friend: User, other_user: User
  let c_public: Collection, c_private: Collection, c_auth: Collection, c_custom: Collection
  beforeEach(async () => {
    User.hashPassword = async (s) => {
      return <string>s
    }
    remult.dataProvider = new InMemoryDataProvider()

    owner = await repo(User).insert({
      id: 'owner',
      email: 'e1@e',
    })

    friend = await repo(User).insert({
      id: 'friend',
      email: 'e2@e',
    })

    other_user = await repo(User).insert({
      id: 'user3',
      email: 'e3@e',
    })

    c_public = await repo(Collection).insert({
      id: '1',
      name: 'public collection',
      owner: owner,
      prefix: 'c1',
      visibility_setting: 'public',
    })
    c_auth = await repo(Collection).insert({
      id: '2',
      name: 'collection for authenticated users',
      owner: owner,
      prefix: 'c2',
      visibility_setting: 'authenticated',
    })
    c_private = await repo(Collection).insert({
      id: '3',
      name: 'private collection',
      owner: owner,
      prefix: 'c3',
      visibility_setting: 'private',
    })
    c_custom = await repo(Collection).insert({
      id: '4',
      name: 'collection for my group',
      owner: owner,
      prefix: 'c4',
      visibility_setting: 'specified_users',
    })
    repo(Collection).relations(c_custom).allowedUsers.insert({ user: friend })

    let s1 = await repo(Specimen).insert({
      id: 's1',
      collection: c_public,
      owner: owner,
      collection_id: 'n1',
      collection_location: 'here',
      collection_date: '1.I.1900',
      collection_collector: 'Me',
    })
    let s2 = await repo(Specimen).insert({
      id: 's2',
      collection: c_auth,
      owner: owner,
      collection_id: 'n2',
      collection_location: 'here',
      collection_date: '1.I.1900',
      collection_collector: 'Me',
    })
    let s3 = await repo(Specimen).insert({
      id: 's3',
      collection: c_private,
      owner: owner,
      collection_id: 'n3',
      collection_location: 'here',
      collection_date: '1.I.1900',
      collection_collector: 'Me',
    })
    let s4 = await repo(Specimen).insert({
      id: 's4',
      collection: c_custom,
      owner: owner,
      collection_id: 'n4',
      collection_location: 'here',
      collection_date: '1.I.1900',
      collection_collector: 'Me',
    })
  })

  test('Anon user can see only `public` Collections', async () => {
    remult.user = undefined
    console.log('test 1')
    expect((await repo(Collection).find()).length).toBe(1)
  })

  test('Owner can see all Specimens', async () => {
    remult.user = owner
    console.log('test 2')
    expect((await repo(Specimen).find()).length).toBe(4)
  })

  test('Anon user can see Specimens only from `public` collections', async () => {
    remult.user = undefined
    console.log('test 3')
    expect((await repo(Specimen).find()).length).toBe(1)
  })

  test('"Friended" user can see Specimens from 3 collections', async () => {
    remult.user = friend
    console.log('test 4')
    expect((await repo(Specimen).find()).length).toBe(3)
  })

  test('Other authenticated user can see Specimens from `public` and `authenticated` collections', async () => {
    remult.user = other_user
    console.log('test 5')
    expect((await repo(Specimen).find()).length).toBe(2)
  })
})
