<script lang="ts">
  import { remult } from 'remult'
  import type { ErrorInfo } from 'remult'

  import { browser } from '$app/environment'

  import SpecimenPlate from '$lib/components/SpecimenPlate.svelte'
  import { remultLive } from '$lib/stores/remultLive'

  import { Specimen, type DevelopmentStage, type SpreadingType } from '../../shared/Specimen'

  export let data

  // entitiy validation error from remult
  export let err: any

  // get the repo
  const specimenRepo = remult.repo(Specimen)

  // Start with SSR then subscribe to changes (respecting options!)
  const specimens = remultLive(specimenRepo, data.specimens)
  $: browser && specimens.listen(data.options)

  let collection_id: string = ''
  let collection_location: string = ''
  let collection_date: string = ''
  let collection_collector: string = ''
  let collection_conditions: string = ''
  let collection_gps: string = ''
  let comment: string = ''
  let spreading_type: SpreadingType = 'dorsal'
  let development_stage: DevelopmentStage = 'imago'
  let storage_location: string = ''
  let metrics_winglength: string = ''
  let metrics_wingspan: string = ''
  const add = async () => {
    err = {}
    try {
      await remult.repo(Specimen).insert({
        collection_id: collection_id,
        collection_location: collection_location,
        collection_conditions: collection_conditions,
        collection_date: collection_date,
        collection_collector: collection_collector,
        collection_gps: collection_gps,
        comment: comment,
        spreading_type: spreading_type,
        development_stage: development_stage,
        storage_location: storage_location,
        metrics_winglength: metrics_winglength,
        metrics_wingspan: metrics_wingspan,
        image1: '/static/images_source/.jpg' + collection_id + '.jpg',
        image2: '/static/images_source/.jpg' + collection_id + '-rev.jpg',
      })
      collection_id = ''
      collection_location = ''
      collection_conditions = ''
      collection_date = ''
      collection_collector = ''
      collection_gps = ''
      comment = ''
      spreading_type = 'dorsal'
      development_stage = 'imago'
      storage_location = ''
      metrics_winglength = ''
      metrics_wingspan = ''
    } catch (e) {
      err = (<ErrorInfo>e).modelState
    }
  }
  async function deleteTask(specimen: Specimen) {
    try {
      await specimenRepo.delete(specimen)
    } catch (error: any) {
      alert(error.message)
    }
  }
</script>

<h2>specimens</h2>

<!-- error here -->
{#if data.error}
<div>
error: {data.error.message}
status: {data.error.status}
</div>
{/if}

{#if !$specimens.length}
  <div>so empty...</div>
{:else}
<div class="overflow-x-auto">
  <table class="table">
    <!-- head -->
    <thead>
      <tr>
        <th>Image 1</th>
        <th>Image 2</th>
        <th>Locality</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {#each $specimens as specimen}
        <tr>
          <td>
            <div class="flex items-center gap-3">
              <div>
                <!-- svelte-ignore a11y-missing-attribute -->
                <img src={specimen.image1} style="max-height: 150px" />
              </div>
            </div>
          </td>
          <td>
            <div class="flex items-center gap-3">
              <div>
                <!-- svelte-ignore a11y-missing-attribute -->
                <img src={specimen.image2} style="max-height: 150px" />
              </div>
            </div>
          </td>
          <td>
            <div class="flex items-center gap-3">
              <SpecimenPlate {specimen} />
              {#if specimen.acceptedTaxa}
                <i
                  >{specimen.acceptedTaxa.genus}
                  {specimen.acceptedTaxa.species}
                  {specimen.acceptedTaxa.authorship}</i
                >
              {/if}
            </div>
          </td>
          <th>
            <button class="btn btn-ghost btn-xs">Details</button>
            <button class="btn btn-ghost btn-xs" on:click={() => deleteTask(specimen)}
              >Delete</button
            >
          </th>
        </tr>
      {/each}
    </tbody>
    <!-- foot -->
    <tfoot>
      <tr>
        <th></th>
        <th>Images</th>
        <th>Locality</th>
        <th></th>
      </tr>
    </tfoot>
  </table>
</div>
{/if}

<h2>Add new</h2>
<form on:submit|preventDefault={add}>
  <label for="collection_id">{specimenRepo.fields.collection_id.caption}</label>
  {#if err?.collection_id}
    <span>{err.collection_id}</span>
  {/if}
  <input type="collection_id" bind:value={collection_id} />

  <label for="collection_location">{specimenRepo.fields.collection_location.caption}</label>
  {#if err?.collection_location}
    <span>{err.collection_location}</span>
  {/if}
  <input type="collection_location" bind:value={collection_location} />

  <label for="collection_conditions">{specimenRepo.fields.collection_conditions.caption}</label>
  {#if err?.collection_conditions}
    <span>{err.collection_conditions}</span>
  {/if}
  <input type="collection_conditions" bind:value={collection_conditions} />

  <label for="collection_date">{specimenRepo.fields.collection_date.caption}</label>
  {#if err?.collection_date}
    <span>{err.collection_date}</span>
  {/if}
  <input type="collection_date" bind:value={collection_date} />

  <label for="collection_collector">{specimenRepo.fields.collection_collector.caption}</label>
  {#if err?.collection_collector}
    <span>{err.collection_collector}</span>
  {/if}
  <input type="collection_collector" bind:value={collection_collector} />

  <label for="collection_gps">{specimenRepo.fields.collection_gps.caption}</label>
  {#if err?.collection_gps}
    <span>{err.collection_gps}</span>
  {/if}
  <input type="collection_gps" bind:value={collection_gps} />

  <label for="comment">{specimenRepo.fields.comment.caption}</label>
  {#if err?.comment}
    <span>{err.comment}</span>
  {/if}
  <input type="comment" bind:value={comment} />

  <label for="spreading_time">{specimenRepo.fields.spreading_type.caption}</label>
  {#if err?.spreading_time}
    <span>{err.spreading_time}</span>
  {/if}
  <input type="spreading_time" bind:value={spreading_type} />

  <label for="development_stage">{specimenRepo.fields.development_stage.caption}</label>
  {#if err?.development_stage}
    <span>{err.development_stage}</span>
  {/if}
  <input type="development_stage" bind:value={development_stage} />

  <label for="storage_location">{specimenRepo.fields.storage_location.caption}</label>
  {#if err?.storage_location}
    <span>{err.storage_location}</span>
  {/if}
  <input type="storage_location" bind:value={storage_location} />

  <label for="metrics_winglength">{specimenRepo.fields.metrics_winglength.caption}</label>
  {#if err?.metrics_winglength}
    <span>{err.metrics_winglength}</span>
  {/if}
  <input type="metrics_winglength" bind:value={metrics_winglength} />

  <label for="metrics_wingspan">{specimenRepo.fields.metrics_wingspan.caption}</label>
  {#if err?.metrics_wingspan}
    <span>{err.metrics_wingspan}</span>
  {/if}
  <input type="metrics_wingspan" bind:value={metrics_wingspan} />

  <button type="submit" class="btn w-64 rounded-full">Add</button>
</form>