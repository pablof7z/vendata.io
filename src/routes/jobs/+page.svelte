<script lang="ts">
	import { NDKDVMRequest, type NDKEvent } from '@nostr-dev-kit/ndk';
	import JobRequestCard from '$components/jobs/JobRequestCard.svelte';
    import ndk from '$stores/ndk';
	import { derived } from 'svelte/store';
	import { jobRequestKinds } from '$utils';
	import { onDestroy } from 'svelte';

    const allJobRequests = $ndk.storeSubscribe<NDKDVMRequest>(
        { kinds: jobRequestKinds, limit: 20 },
        { closeOnEose: false, subId: 'all-job-requests' },
        NDKDVMRequest
    );

    onDestroy(() => {
        allJobRequests.unsubscribe();
    })

    function isTopLevelItem(item: NDKEvent) {
        const hasJobAsInput = item.getMatchingTags('i').some(input => {
            return input[2] === 'job';
        });

        return !hasJobAsInput;
    }

    const sortedJobRequests = derived(allJobRequests, ($allJobRequests) => {
        return $allJobRequests.sort((a, b) => {
            return b.created_at - a.created_at;
        });
    });
</script>

<div class="max-w-5xl mx-auto flex flex-col gap-6">
    <h1 class="text-base-content-300 text-3xl font-semibold text-center">Your Requests</h1>

    {#if $sortedJobRequests}
        {#each $sortedJobRequests.slice(0, 50) as jobRequest (jobRequest.id)}
            {#if isTopLevelItem(jobRequest)}
                <JobRequestCard {jobRequest} compact={true} />
            {/if}
        {/each}
    {/if}
</div>

