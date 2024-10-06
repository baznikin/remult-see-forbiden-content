<script lang="ts">
  import { remult } from 'remult'
  import type { ErrorInfo } from 'remult'

  import { browser } from '$app/environment'

  import { remultLive } from '$lib/stores/remultLive'

  import { Taxa } from '../../shared/Taxa'

  export let data

  // entitiy validation error from remult
  export let err: any

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
    err = {}
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
      err = (<ErrorInfo>e).modelState
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

<form on:submit|preventDefault={add}>
  <label for="collection_id">{taxaRepo.fields.kingdom.caption}</label>
  {#if err?.kingdom}
    <span>{err.kingdom}</span>
  {/if}
  <input type="kingdom" bind:value={kingdom} />

  <label for="plum">{taxaRepo.fields.plum.caption}</label>
  {#if err?.plum}
    <span>{err.plum}</span>
  {/if}
  <input type="plum" bind:value={plum} />

  <label for="class_rank">{taxaRepo.fields.class_rank.caption}</label>
  {#if err?.class_rank}
    <span>{err.class_rank}</span>
  {/if}
  <input type="class_rank" bind:value={class_rank} />

  <label for="order">{taxaRepo.fields.order.caption}</label>
  {#if err?.order}
    <span>{err.order}</span>
  {/if}
  <input type="order" bind:value={order} />

  <label for="family">{taxaRepo.fields.family.caption}</label>
  {#if err?.family}
    <span>{err.family}</span>
  {/if}
  <input type="family" bind:value={family} />

  <label for="genus">{taxaRepo.fields.genus.caption}</label>
  {#if err?.genus}
    <span>{err.genus}</span>
  {/if}
  <input type="genus" bind:value={genus} />

  <label for="species">{taxaRepo.fields.species.caption}</label>
  {#if err?.species}
    <span>{err.species}</span>
  {/if}
  <input type="species" bind:value={species} />

  <label for="authorship">{taxaRepo.fields.authorship.caption}</label>
  {#if err?.authorship}
    <span>{err.authorship}</span>
  {/if}
  <input type="authorship" bind:value={authorship} />

  <label for="link_gbif">{taxaRepo.fields.link_gbif.caption}</label>
  {#if err?.link_gbif}
    <span>{err.link_gbif}</span>
  {/if}
  <input type="link_gbif" bind:value={link_gbif} />

  <label for="link_lw">{taxaRepo.fields.link_lw.caption}</label>
  {#if err?.link_lw}
    <span>{err.link_lw}</span>
  {/if}
  <input type="link_lw" bind:value={link_lw} />

  <label for="link_ermak">{taxaRepo.fields.link_ermak.caption}</label>
  {#if err?.link_ermak}
    <span>{err.link_ermak}</span>
  {/if}
  <input type="link_ermak" bind:value={link_ermak} />

  <label for="link_omflies">{taxaRepo.fields.link_omflies.caption}</label>
  {#if err?.link_omflies}
    <span>{err.link_omflies}</span>
  {/if}
  <input type="link_omflies" bind:value={link_omflies} />

  <button type="submit" class="btn w-64 rounded-full">Add</button>
</form>

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
            <button class="btn btn-ghost btn-xs">Details</button>
            <button class="btn btn-ghost btn-xs" on:click={() => deleteTask(taxa)}>Delete</button>
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
