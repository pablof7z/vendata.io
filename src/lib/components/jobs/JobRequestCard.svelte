<script lang="ts">
	import { jobRequestKinds, kindToText } from "$utils";
	import EventCard from "./EventCard.svelte";
	import { nip19 } from "nostr-tools";
	import ndk from "$stores/ndk";
	import { onDestroy } from "svelte";
	import { derived } from "svelte/store";
	import JobFeedbackRow from "./JobFeedbackRow.svelte";
	import type { NDKDVMRequest, NDKTag, NDKEvent } from "@nostr-dev-kit/ndk";
	import DvmCard from "$components/dvms/DvmCard.svelte";

    export let jobRequest: NDKDVMRequest;
    export let compact = false;

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

    const results = $ndk.storeSubscribe<NDKEvent>({
        kinds: [7, 5, 65000 as number, 65001 as number],
        ...jobRequest.filter(),
    } , { closeOnEose: false, groupableDelay: 1000 });

    const dependentJobs = $ndk.storeSubscribe<NDKEvent>({
        kinds: jobRequestKinds,
        "#i": [ jobRequest.tagId()]
    }, { closeOnEose: false, groupableDelay: 1000 });

    const jobResults = derived(results, ($results) => {
        return $results.filter(result => result.kind === 65001);
    });

    onDestroy(() => {
        results.unsubscribe();
        dependentJobs.unsubscribe();
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
                    <div class="flex flex-row gap-2">
                        <span>output of</span>
                        <a href="/jobs/{encodeInput(input)}" class="text-accent">
                            #{input[1]?.slice(0, 8)}
                        </a>
                        (job chaining)
                    </div>
                {:else if input[2] === 'event'}
                    #{input[1]?.slice(0, 8)}
                {:else}
                    {input[1]}
                {/if}
            </div>
        {/each}
    </div>

    {#if !compact}

        <h3 class="font-semibold">DVMs ({Object.keys(dvms).length})</h3>

        <div class="flex flex-col gap-8 divide-y divide-base-300">
            {#each Object.entries(dvms) as [dvmPubkey, events]}
                <div class="flex flex-col gap-2">
                    <DvmCard pubkey={dvmPubkey} kind={jobRequest.kind} />
                    <div class="flex flex-col rounded-box bg-base-100 divide-y divide-base-300 gap-4 p-4">
                        {#each events as event (event.id)}
                            <JobFeedbackRow {event} />
                        {/each}
                    </div>
                </div>
            {/each}
        </div>
    {:else if $jobResults && $jobResults.length > 0}
        <h3 class="font-semibold">Job Results ({$jobResults.length})</h3>
        {#each $jobResults as jobResult (jobResult.id)}
            <JobFeedbackRow event={jobResult} />
        {/each}
    {/if}
</EventCard>

{#if $dependentJobs.length > 0}
    <div class="flex flex-col rounded-box bg-base-100 divide-y divide-base-300 gap-4 p-2 ml-10">
        <h3 class="font-semibold">Dependent jobs ({$dependentJobs.length})</h3>
        {#each $dependentJobs as event}
            {#if event}
                <svelte:self jobRequest={event} {compact} />
            {:else}
                no event?
            {/if}
        {/each}
    </div>
{/if}