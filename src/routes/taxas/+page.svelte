<script lang="ts">
  import { remult } from 'remult'
  import type { ErrorInfo } from 'remult'

  import { browser } from '$app/environment'

  import { remultLive } from '$lib/stores/remultLive'

  import { Taxa } from '../../shared/Taxa'

  export let data

  // entitiy validation error from remult
  let validationError: any

  // get the repo
  const taxaRepo = remult.repo(Taxa)

  // Start with SSR then subscribe to changes (respecting options!)
  const taxas = remultLive(taxaRepo, data.taxas)
  $: browser && taxas.listen(data.options)

  let kingdom: string = ''
  let plum: string = ''
  let class_rank: string = ''
  let order: string = ''
  let family: string = ''
  let genus: string = ''
  let species: string = ''
  let authorship: string = ''
  let link_gbif: string = ''
  let link_lw: string = ''
  let link_ermak: string = ''
  let link_omflies: string = ''
  const add = async () => {
    validationError = {}
    try {
      await remult.repo(Taxa).insert({
        kingdom: kingdom,
        plum: plum,
        class_rank: class_rank,
        order: order,
        family: family,
        genus: genus,
        species: species,
        authorship: authorship,
        link_gbif: link_gbif,
        link_lw: link_lw,
        link_ermak: link_ermak,
        link_omflies: link_omflies,
      })
      kingdom = ''
      plum = ''
      family = ''
      class_rank = ''
      order = ''
      genus = ''
      species = ''
      authorship = 'imago'
      link_gbif = ''
      link_lw = ''
      link_ermak = ''
      link_omflies = ''
    } catch (e) {
      validationError = (<ErrorInfo>e).modelState
    }
  }
  async function deleteTask(taxa: Taxa) {
    try {
      await taxaRepo.delete(taxa)
    } catch (error: any) {
      alert(error.message)
    }
  }
</script>

<h2>taxas</h2>

{#if taxaRepo.metadata.apiInsertAllowed()}
  <form on:submit|preventDefault={add}>
    <label for="collection_id">{taxaRepo.fields.kingdom.caption}</label>
    {#if validationError?.kingdom}
      <span>{validationError.kingdom}</span>
    {/if}
    <input type="kingdom" bind:value={kingdom} />

    <label for="plum">{taxaRepo.fields.plum.caption}</label>
    {#if validationError?.plum}
      <span>{validationError.plum}</span>
    {/if}
    <input type="plum" bind:value={plum} />

    <label for="class_rank">{taxaRepo.fields.class_rank.caption}</label>
    {#if validationError?.class_rank}
      <span>{validationError.class_rank}</span>
    {/if}
    <input type="class_rank" bind:value={class_rank} />

    <label for="order">{taxaRepo.fields.order.caption}</label>
    {#if validationError?.order}
      <span>{validationError.order}</span>
    {/if}
    <input type="order" bind:value={order} />

    <label for="family">{taxaRepo.fields.family.caption}</label>
    {#if validationError?.family}
      <span>{validationError.family}</span>
    {/if}
    <input type="family" bind:value={family} />

    <label for="genus">{taxaRepo.fields.genus.caption}</label>
    {#if validationError?.genus}
      <span>{validationError.genus}</span>
    {/if}
    <input type="genus" bind:value={genus} />

    <label for="species">{taxaRepo.fields.species.caption}</label>
    {#if validationError?.species}
      <span>{validationError.species}</span>
    {/if}
    <input type="species" bind:value={species} />

    <label for="authorship">{taxaRepo.fields.authorship.caption}</label>
    {#if validationError?.authorship}
      <span>{validationError.authorship}</span>
    {/if}
    <input type="authorship" bind:value={authorship} />

    <label for="link_gbif">{taxaRepo.fields.link_gbif.caption}</label>
    {#if validationError?.link_gbif}
      <span>{validationError.link_gbif}</span>
    {/if}
    <input type="link_gbif" bind:value={link_gbif} />

    <label for="link_lw">{taxaRepo.fields.link_lw.caption}</label>
    {#if validationError?.link_lw}
      <span>{validationError.link_lw}</span>
    {/if}
    <input type="link_lw" bind:value={link_lw} />

    <label for="link_ermak">{taxaRepo.fields.link_ermak.caption}</label>
    {#if validationError?.link_ermak}
      <span>{validationError.link_ermak}</span>
    {/if}
    <input type="link_ermak" bind:value={link_ermak} />

    <label for="link_omflies">{taxaRepo.fields.link_omflies.caption}</label>
    {#if validationError?.link_omflies}
      <span>{validationError.link_omflies}</span>
    {/if}
    <input type="link_omflies" bind:value={link_omflies} />

    <button type="submit" class="btn w-64 rounded-full">Add</button>
  </form>
{/if}

<div class="overflow-x-auto">
  <table class="table">
    <!-- head -->
    <thead>
      <tr>
        <th>family</th>
        <th>genus</th>
        <th>species</th>
        <th>authorship</th>
        <th>links</th>
      </tr>
    </thead>
    <tbody>
      {#each $taxas as taxa}
        <tr>
          <td>{taxa.family}</td>
          <td>{taxa.genus}</td>
          <td>{taxa.species}</td>
          <td>{taxa.authorship}</td>
          <td>
            {#if taxa.link_gbif}
              <a href={taxa.link_gbif}>[gbif]</a>
            {/if}
            {#if taxa.link_lw}
              <a href={taxa.link_lw}>[lw]</a>
            {/if}
            {#if taxa.link_omflies}
              <a href={taxa.link_omflies}>[omflies]</a>
            {/if}
            {#if taxa.link_ermak}
              <a href={taxa.link_ermak}>[ermak]</a>
            {/if}
          </td>
          <th>
            {#if taxaRepo.metadata.apiDeleteAllowed(taxa)}
              <button class="btn btn-ghost btn-xs">Details</button>
              <button class="btn btn-ghost btn-xs" on:click={() => deleteTask(taxa)}>Delete</button>
            {/if}
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
