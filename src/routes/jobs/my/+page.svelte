<script lang="ts">
	import type { NDKEvent } from '@nostr-dev-kit/ndk';
    import { currentUser } from '$stores/current-user';
    import { userJobRequests } from '$stores/jobRequests';
	import JobRequestCard from '$components/jobs/JobRequestCard.svelte';
	import { derived, type Readable } from 'svelte/store';

    function isTopLevelItem(item: NDKEvent) {
        const hasJobAsInput = item.getMatchingTags('i').some(input => {
            return input[2] === 'job';
        });

        return !hasJobAsInput;
    }

    let sortedJobRequests: Readable<NDKEvent[]> | undefined;

    $: if (!sortedJobRequests && $currentUser) {
        sortedJobRequests = derived(userJobRequests, ($userJobRequests) => {
            return $userJobRequests.sort((a, b) => {
                return b.created_at - a.created_at;
            });
        });
    }
</script>

<div class="max-w-5xl mx-auto flex flex-col gap-6">
    <h1 class="text-base-content-300 text-3xl font-semibold">Your Requests</h1>

    {#if $sortedJobRequests && $sortedJobRequests.length > 0}
        {#each $sortedJobRequests as jobRequest (jobRequest.id)}
            <JobRequestCard {jobRequest} compact={true} />
        {/each}
    {/if}
</div>

