import { beforeEach, describe, expect, test } from 'vitest'

import { InMemoryDataProvider, remult, repo } from 'remult'

import { Collection } from './Collection'
import { Specimen } from './Specimen'
import { User } from './User'

describe('model Collection tests', async () => {
  beforeEach(async () => {
    User.hashPassword = async (s) => {
      return <string>s
    }
    remult.dataProvider = new InMemoryDataProvider()

    let owner = await repo(User).insert({
      id: 'owner',
      email: 'e1@e',
    })

    let friend = await repo(User).insert({
      id: 'user2',
      email: 'e2@e',
    })

    let other_user = await repo(User).insert({
      id: 'user3',
      email: 'e3@e',
    })

    let c_public = await repo(Collection).insert({
      id: '1',
      owner: owner,
      name: 'public collection',
      prefix: 'c1',
      visibility_setting: 'public',
    })
    let c_auth = await repo(Collection).insert({
      id: '2',
      name: 'collection for authenticated users',
      prefix: 'c2',
      visibility_setting: 'authenticated',
    })
    let c_private = await repo(Collection).insert({
      id: '3',
      name: 'private collection',
      prefix: 'c3',
      visibility_setting: 'private',
    })
    let c_custom = await repo(Collection).insert({
      id: '4',
      name: 'collection for my group',
      prefix: 'c4',
      visibility_setting: 'specified_users',
      visibility_allowed_user_ids: ['user2'],
    })

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

  // test('Anon user can see only public Specimens', async () => {
  //   remult.user = undefined
  //   expect((await repo(Specimen).find()).length).toBe(1)
  // })

  // test('Authenticated user can see public and authenticated Specimens', async () => {
  //   remult.user = owner
  //   expect((await repo(Specimen).find()).length).toBe(2)
  // })
})
