<script lang="ts">
	import { page } from '$app/stores';
	import FeedItem from '$components/feed/FeedItem.svelte';
	import ndk from '$stores/ndk';
	import { NDKDVMJobResult, NDKDVMRequest, NDKEvent, mergeFilters } from '@nostr-dev-kit/ndk';
	import type { NDKEventStore } from '@nostr-dev-kit/ndk-svelte';
	import { EventContent } from '@nostr-dev-kit/ndk-svelte-components';
	import { nip19 } from 'nostr-tools';

    let prevIds: string;
    let ids: string[];

    let jobRequests: NDKEventStore<NDKDVMRequest>;
    let results: NDKEventStore<NDKEvent>;

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

        results = $ndk.storeSubscribe(
            { "#e": hexids },
            { closeOnEose: false }
        )
    }

    let showNewJobRequest = true;
</script>

<div class="flex flex-row gap-8">
    <div class="flex flex-col divide-y divide-base-300 w-2/5 truncate">
        {#each $jobRequests as jobRequest}
            <FeedItem item={jobRequest} />
        {/each}

        <button
            class="btn btn-primary self-start mt-4"
            on:click={() => showNewJobRequest = true}
        >
            Add new job request
        </button>
    </div>

    <div class="flex flex-col divide-y divide-base-300 ">
        {#each $results as result}
            <div on:click={() => expandEvent = result}>
                <FeedItem item={result} />
            </div>
        {/each}
    </div>

    {#if expandEvent}
        <div class="flex flex-col w-2/5">
            {expandEvent.encode()}
            {expandEvent.content}
            <EventContent ndk={$ndk} event={expandEvent} />
        </div>
    {/if}
</div>