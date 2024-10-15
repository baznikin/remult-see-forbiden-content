import { beforeEach, describe, expect, test } from 'vitest'

import { InMemoryDataProvider, remult, repo } from 'remult'

import { Collection } from './Collection'
import { Identification } from './Identification'
import { Specimen } from './Specimen'
import { Taxa } from './Taxa'
import { User } from './User'

describe('model Identification tests', async () => {
  let c1: Collection
  let s1: Specimen
  let t1: Taxa
  beforeEach(async () => {
    User.hashPassword = async (s) => {
      return <string>s
    }
    remult.dataProvider = new InMemoryDataProvider()
    let u1 = await repo(User).insert({
      id: 'owner',
      email: 'e1@e',
    })

    c1 = await repo(Collection).insert({
      id: '1',
      owner: u1,
      name: 'public collection',
      prefix: 'c1',
    })
    s1 = await repo(Specimen).insert({
      collection_id: 'n1',
      collection_location: 'here',
      collection_date: '1.I.1900',
      collection_collector: 'Me',
      collection: c1,
      owner: u1,
    })
    t1 = await repo(Taxa).insert({
      genus: 'Taxa1',
      species: 'taxa1',
      authorship: 'Me (1)',
    })
    console.log('before: ', s1.collection?.name)
    await repo(Specimen).relations(s1).identifications.insert({ status: 'accepted', taxa: t1 })
    console.log('after')
  })

  test('New Identification updates previous one as out dated', async () => {
    let currentId = await repo(Identification).findFirst()
    expect(currentId!.status).toBe('accepted')

    let newId = await repo(Identification).insert({
      specimen: s1,
      taxa: t1,
      status: 'accepted',
    })
    currentId = <Identification>(
      /* to get rid of ts(2322) */ await repo(Identification).findId(currentId!.id)
    )

    expect(currentId!.status).toBe('outdated')
    expect(newId.status).toBe('accepted')
  })

  test('New Identification updates acceptedTaxa of Specimen', async () => {
    let reload1 = await repo(Specimen).findId(s1.id, { include: { acceptedTaxa: true } })
    expect(reload1!.acceptedTaxa).toStrictEqual(t1)

    const t2 = await repo(Taxa).insert({
      genus: 'Taxa2',
      species: 'taxa2',
      authorship: 'Me (2)',
    })
    let newId = await repo(Identification).insert({
      specimen: s1,
      taxa: t2,
      status: 'accepted',
    })

    let reload2 = await repo(Specimen).findId(s1.id, { include: { acceptedTaxa: true } })
    expect(reload2!.acceptedTaxa).toStrictEqual(t2)
  })
})
