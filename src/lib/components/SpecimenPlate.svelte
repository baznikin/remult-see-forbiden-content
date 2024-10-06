<script lang="ts">
  import type { Specimen } from '../../shared/Specimen'

  export let specimen: Specimen
</script>

<div>
  <div class="badge-pimary badge">{specimen.collection_id}</div>
  <div class="badge badge-secondary">{specimen.collection_date}</div>
  <div class="font-bold">{specimen.collection_location}</div>
  <div class="text-sm opacity-50">Leg. {specimen.collection_collector}</div>
</div>
