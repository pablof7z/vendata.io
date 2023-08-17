<script lang="ts">
    import ndk from '$stores/ndk';
	import { derived } from 'svelte/store';
	import FeedItem from '$components/feed/FeedItem.svelte';

    const feed = $ndk.storeSubscribe(
        { kinds: [65001, 65002, 65003, 65004, 65005, 65006, 65007, 68001, 68002, 68003], limit: 50 },
        { closeOnEose: false, subId: 'main-feed' },
    )

    const sortedFeed = derived(feed, $feed => {
        return $feed.sort((a, b) => {
            return a.timestamp - b.timestamp;
        })
    });
</script>

<div class="flex flex-col divide-y divide-base-300 mt-10">
    {#each $sortedFeed as item}
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