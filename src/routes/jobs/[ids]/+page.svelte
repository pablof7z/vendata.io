<script lang="ts">
	import { page } from '$app/stores';
    import JobRequestCard from '$components/jobs/JobRequestCard.svelte';
	import ndk from '$stores/ndk';
	import { NDKDVMRequest, NDKEvent, mergeFilters } from '@nostr-dev-kit/ndk';
	import type { NDKEventStore } from '@nostr-dev-kit/ndk-svelte';
	import { nip19 } from 'nostr-tools';
	import JobRequestEditor from '../new/JobRequestEditor.svelte';

    let prevIds: string;
    let ids: string[];

    let jobRequests: NDKEventStore<NDKDVMRequest>;

    let expandEvent: NDKEvent | undefined;

    $: if (prevIds !== $page.params.ids) {
        prevIds = $page.params.ids;
        ids = $page.params.ids.split(/,/);

        const hexids = [];

        for (const id of ids) {
            const decoded = nip19.decode(id);

            switch (decoded.type) {
                case 'nevent':
                    hexids.push(decoded.data.id);
                    break;
                case 'note':
                    hexids.push(decoded.data);
                    break;
            }
        }

        jobRequests = $ndk.storeSubscribe(
            { "ids": hexids },
            { closeOnEose: true },
            NDKDVMRequest
        );
    }

    let jobRequest: NDKDVMRequest | undefined;

    let showNewJobRequest = false;

    function isTopLevelItem(item: NDKEvent) {
        const hasJobAsInput = item.getMatchingTags('i').some(input => {
            return input[2] === 'job';
        });

        return !hasJobAsInput;
    }

    $: console.log('jobRequests', $jobRequests);
</script>

<div class="grid grid-flow-col grid-cols-{expandEvent ? 3 : 2} gap-8">
    <div class="flex flex-col gap-2">
        <h3 class="text-2xl font-semibold mb-4">Job Requests</h3>
        {#each $jobRequests as jobRequest (jobRequest)}
            <JobRequestCard jobRequest={jobRequest} />
        {/each}

        {#if showNewJobRequest}
            <div class="card">
                <JobRequestEditor
                    bind:jobRequest
                    jobs={$jobRequests}
                    on:cancel={() => showNewJobRequest = false}
                />
            </div>
        {:else}
            <button
                class="btn btn-primary self-start"
                on:click={() => showNewJobRequest = true}
            >
                Add new job request
            </button>
        {/if}
    </div>

    <!-- <div class="flex flex-col divide-y divide-base-300 px-4">
        <h3 class="text-2xl font-semibold mb-4">DVMs Feed</h3>

        {#each $results as result}
            <div on:click={() => expandEvent = result}>
                <FeedItem item={result} />
            </div>
        {/each}
    </div>

    {#if expandEvent}
        <div class="flex flex-col">
            {expandEvent.encode()}
            <EventContent ndk={$ndk} event={expandEvent} />
        </div>
    {/if} -->
</div>