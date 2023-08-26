<script lang="ts">
    import { createEventDispatcher } from "svelte";

    export let range: string[] | undefined = undefined;

    const dispatch = createEventDispatcher();

    function updateRange() {
        if (rangeStart && rangeEnd) {
            range = [ rangeStart.toString(), rangeEnd.toString() ];
        } else {
            range = undefined;
        }

        dispatch('change', { name: 'range', value: range });
    }

    let rangeStart: string | undefined;
    let rangeEnd: string | undefined;
</script>

<p>
    Range (for audio/video)
    <span class="badge badge-neutral">Optional</span>
</p>
<div class="flex flex-row gap-2">
    <input type="number" class="input input-bordered" placeholder="Starting second" bind:value={rangeStart} on:change={updateRange} />
    <input type="number" class="input input-bordered" placeholder="Finishing second" bind:value={rangeEnd} on:change={updateRange} />
</div>
