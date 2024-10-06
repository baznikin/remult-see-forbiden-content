import { beforeEach, describe, expect, test } from 'vitest'

import { InMemoryDataProvider, remult, repo } from 'remult'

import { Identification } from './Identification'
import { Specimen } from './Specimen'
import { Taxa } from './Taxa'

describe('model Identification tests', async () => {
  let s1: Specimen
  let t1: Taxa
  beforeEach(async () => {
    remult.dataProvider = new InMemoryDataProvider()
    s1 = await repo(Specimen).insert({
      collection_id: 'n1',
      collection_location: 'here',
      collection_date: '1.I.1900',
      collection_collector: 'Me',
    })
    t1 = await repo(Taxa).insert({
      genus: 'Taxa1',
      species: 'taxa1',
      authorship: 'Me (1)',
    })
    await repo(Specimen).relations(s1).identifications.insert({ status: 'accepted', taxa: t1 })
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
