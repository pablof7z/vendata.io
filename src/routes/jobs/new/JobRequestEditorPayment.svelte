<script lang="ts">
    export let amount: number = 1000;

    let value = amount.toString();

    $: amount = +value;
</script>

<div class="flex flex-row items-center gap-2">
    <input type="range" min="0" max="100000" class="range range-info range-xs flex-grow" bind:value />
    <input type="text" class="input shrink w-24 !bg-transparent" bind:value />
</div>