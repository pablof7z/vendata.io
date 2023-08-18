<script lang="ts">
	import { NDKDVMRequest, NDKEvent } from '@nostr-dev-kit/ndk';
    import ndk from "$stores/ndk";
    import { userJobRequests } from '$stores/jobRequests';
	import JobRequestCard from '$components/jobs/JobRequestCard.svelte';

    function isTopLevelItem(item: NDKEvent) {
        const hasJobAsInput = item.getMatchingTags('i').some(input => {
            return input[2] === 'job';
        });

        return !hasJobAsInput;
    }
</script>

<div class="max-w-5xl mx-auto flex flex-col gap-6">
    <h1 class="text-base-content-300 text-3xl font-semibold">Your Requests</h1>

    {#if $userJobRequests}
        {#each $userJobRequests as jobRequest}
            {#if isTopLevelItem(jobRequest)}
                <JobRequestCard {jobRequest} />
            {/if}
        {/each}
    {/if}
</div>

