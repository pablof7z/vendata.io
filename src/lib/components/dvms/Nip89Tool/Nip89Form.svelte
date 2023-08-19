<script lang="ts">
    import { kindToText, jobRequestKinds } from "$utils";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    export let name = '';
    export let pubkey = '';
    export let image = '';
    export let supportedKinds: number[] = [];
    export let about = '';
    let showWarning = false;

    const onKindChange = () => {
        showWarning = supportedKinds.length > 1;
    }

    function submit() {
        dispatch("done");
    }

    function cancel() {
        dispatch('cancel')
    }

    let validForm = false;

    $: validForm = (
        name.length === 0 ||
        pubkey.length === 0 ||
        image.length === 0 ||
        supportedKinds.length === 0
    );
</script>

<div class="card-title flex flex-col gap-4">
    <h3 class="text-2xl text-base-100-content">NIP-89 DVM announcement</h3>
    <h4 class="font-normal text-base">
        NIP-89 allow you to advertise your DVM and its functionalities.
    </h4>
</div>

<form>
    <div class="mb-4">
        <label for="name" class="block mb-2">Name</label>
        <input id="name" bind:value={name} type="text" class="input input-bordered w-full" required>
    </div>

    <div class="mb-4">
        <label for="pubkey" class="block mb-2">DVM Pubkey (in hex)</label>
        <input id="pubkey" bind:value={pubkey} type="text" class="input input-bordered w-full" required>
    </div>

    <div class="mb-4">
        <label for="image" class="block mb-2">Profile Picture (URL)</label>
        <input id="image" bind:value={image} type="url" class="input input-bordered w-full" required>
    </div>

    <div class="mb-4">
        <label for="supportedKinds" class="block mb-2">Supported Features</label>
        <select
            bind:value={supportedKinds} multiple on:change={onKindChange} class="select select-bordered w-full">
            {#each jobRequestKinds as kind}
                <option value={kind}>{kind}: {kindToText(kind)}</option>
            {/each}
        </select>
        {#if showWarning}
            <p class="mt-2 text-sm text-warning">It's better to separate DVMs that support multiple kinds into separate NIP-89 announcements so they can describe the functionality specifically.</p>
        {/if}
    </div>

    <div class="mb-4">
        <label for="about" class="block mb-2">About</label>
        <textarea id="about" bind:value={about} rows="5" class="textarea textarea-bordered w-full" placeholder="Describe your DVM's capabilities. This is your chance to pitch your DVM to potential users. Make it count!" required></textarea>
    </div>

    <div class="flex flex-row items-center">
        <button class="btn btn-primary btn-wide" on:click={submit} disabled={validForm}>Generate Event</button>
        <div class="alert items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-info shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span class="text-xs">
                You'll be able to sign with your DVMs key. No event will be published now.
            </span>
        </div>
        <button class="btn btn-ghost" on:click={cancel}>Cancel</button>
    </div>
</form>
