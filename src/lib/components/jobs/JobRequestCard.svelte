<script lang="ts">
	import { jobRequestKinds, kindToText } from "$utils";
	import EventCard from "./EventCard.svelte";
	import { nip19 } from "nostr-tools";
	import ndk from "$stores/ndk";
	import { onDestroy } from "svelte";
	import { Avatar, Name } from "@nostr-dev-kit/ndk-svelte-components";
	import { derived } from "svelte/store";
	import JobFeedbackRow from "./JobFeedbackRow.svelte";
	import JobStatusLabel from "./JobStatusLabel.svelte";
	import type { NDKDVMRequest, NDKTag, NDKEvent } from "@nostr-dev-kit/ndk";

    export let jobRequest: NDKDVMRequest;

    console.log('jobRequest', jobRequest);

    const jobRequestType = kindToText(jobRequest.kind!);

    let inputs: NDKTag[] = [];

    inputs = jobRequest.getMatchingTags('i');

    function encodeInput(input: NDKTag) {
        const id = input[1];
        let encodedId;

        if (id.match(/:/)) {
            const [ kind, pubkey, identifier ] = id.split(/:/);
            encodedId = nip19.naddrEncode({
                kind: parseInt(kind),
                pubkey,
                identifier
            });
        } else {
            encodedId = nip19.noteEncode(id);
        }

        return encodedId;
    }

    const relatedEvents = $ndk.storeSubscribe<NDKEvent>([
        {
            kinds: [7, 5, 65000 as number, 65001 as number],
            ...jobRequest.filter(),
        },
        {
            kinds: jobRequestKinds,
            "#i": [ jobRequest.tagId()]
        }
    ], { closeOnEose: false },
    );

    onDestroy(() => {
        console.log('JobRequestCard destroyed');
        relatedEvents.unsubscribe();
    });

    const results = derived(relatedEvents, ($relatedEvents) => {
        return $relatedEvents.filter(event => event.getMatchingTags('e').map(t => t[1]).includes(jobRequest.tagId()));
    });

    const dependentJobs = derived(relatedEvents, ($relatedEvents) => {
        return $relatedEvents.filter(event => event.getMatchingTags('i').map(t => t[1]).includes(jobRequest.tagId()));
    });

    let dvms: Record<string, NDKEvent[]> = {};

    $: for (const result of $results) {
        const key = result.pubkey;
        if (!dvms[key]) dvms[key] = [];
        const alreadyAdded = (dvms[key].some(e => e.id === result.id));

        if (!alreadyAdded) {
            dvms[key].push(result);
            dvms = dvms;
        }
    }

    function mostRecentStatus(events: NDKEvent[]) {
        const mostRecentEvent = events.sort((a, b) => b.created_at! - a.created_at!)[0];
        return mostRecentEvent.tagValue("status");
    }
</script>

<EventCard event={jobRequest} title={jobRequestType} href={`/jobs/${jobRequest.encode()}`}>
    <div class="whitespace-normal flex flex-col gap-4">
        {#each inputs as input}
            <div class="flex flex-col gap-2">
                <h3 class="font-semibold">
                    INPUT
                    {#if input[2]}
                        <span class="font-normal opacity-50">({input[2]})</span>
                    {/if}
                </h3>
                {#if input[2] === 'job'}
                    output of
                    <a href="/jobs/{encodeInput(input)}" class="text-accent">
                        #{input[1]?.slice(0, 8)}
                    </a>
                    (job chaining)
                {:else if input[2] === 'event'}
                    #{input[1]?.slice(0, 8)}
                {:else}
                    {input[1]}
                {/if}
            </div>
        {/each}
    </div>

    <h3 class="font-semibold">DVMs ({Object.keys(dvms).length})</h3>

    <div class="flex flex-col rounded-box bg-base-100 divide-y divide-base-300 gap-4 p-2">
        {#each Object.entries(dvms) as [dvmPubkey, events]}
            <div class="flex flex-row justify-between">
                <div class="flex flex-row gap-2 items-center">
                    <Avatar ndk={$ndk} pubkey={dvmPubkey} class="w-12 h-12 object-cover rounded-lg" />
                    <Name ndk={$ndk} pubkey={dvmPubkey} />
                </div>

                <JobStatusLabel status={mostRecentStatus(events)} />
            </div>

            {#each events as event}
                <JobFeedbackRow {event} />
            {/each}
        {/each}
    </div>
</EventCard>

{#if $dependentJobs.length > 0}
    <h3 class="font-semibold">Dependent jobs ({$dependentJobs.length})</h3>

    <div class="flex flex-col rounded-box bg-base-100 divide-y divide-base-300 gap-4 p-2 ml-10">
        {#each $dependentJobs as event}
            {#if event}
                <svelte:self jobRequest={event} />
            {:else}
                no event?
            {/if}
        {/each}
    </div>
{/if}