<script lang="ts">
  import '../app.css'

  import { remult } from 'remult'

  import { route } from '$lib/ROUTES'

  import type { LayoutData } from './$types'

  export let data: LayoutData

  $: remult.user = data.user
</script>

<svelte:head>
  <title>Bio-collection</title>
</svelte:head>

<h1>Bio-collection</h1>

<a href={route('/specimens')}>Specimens</a> |
<a href={route('/taxas')}>Taxas</a> |
<a href={route('remult_admin')}>Admin</a> |
<a href={route('sign_out')}>Log out</a> |
{#if remult.user}
  User: {remult.user.name}[{remult.user.roles || '-'}]
{/if}
<hr />

<slot />

<hr />
