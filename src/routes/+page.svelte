<script lang="ts">
	import { derived } from 'svelte/store';
	import FeedItem from '$components/feed/FeedItem.svelte';
	import { allJobRequests } from '$stores/jobRequests';
</script>

<div class="hero min-h-[50vh]">
    <div class="hero-content flex-col lg:flex-row">
        <img src="https://cdn.midjourney.com/bd588aed-e734-4043-99b3-352ee973de24/0_3.png" class="max-w-lg rounded-lg shadow-2xl" />
        <div>
            <h1 class="text-7xl font-black mb-4">Vendata</h1>
            <h1 class="text-3xl font-thin">Data Vending Machines</h1>
            <p class="py-6 text-lg">
                Explore and interact with AI Data Vending Machines over Nostr.
            </p>
            <button class="btn btn-primary px-20 btn-lg">Login</button>
        </div>
    </div>
</div>

<div class="flex flex-col divide-y divide-base-300 mt-10 max-w-5xl mx-auto">
    {#each $allJobRequests as item}
        <FeedItem {item} />
    {/each}
</div>

<style>
    h1 span.bg {
        background: radial-gradient(17397.30% 100% at 9.07% -0%, #FFF 0%, #817EFF 100%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
</style>