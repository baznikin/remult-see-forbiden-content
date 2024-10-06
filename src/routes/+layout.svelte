<script lang="ts">
  import '../app.css'

  import { route } from '$lib/ROUTES'
</script>

<svelte:head>
  <title>Bio-collection</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/water.css@2/out/dark.css" />
</svelte:head>

<h1>Bio-collection</h1>

<a href={route('/specimens')}>Specimens</a> |
<a href={route('/taxas')}>Taxas</a> |
<a href={route('remult_admin')}>Admin</a> |

<hr />

<slot />

<hr />
