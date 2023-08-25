<script lang="ts">
	import DvmCard from "$components/dvms/DvmCard.svelte";
	import { NDKDVMJobResult, NDKDVMJobFeedback, NDKDVMRequest, NDKAppHandlerEvent, type NDKUserProfile, NDKKind, NDKEvent } from "@nostr-dev-kit/ndk";
	import JobFeedbackRow from "./JobFeedbackRow.svelte";
	import JobResultRow from "./JobResultRow.svelte";
	import DvmTile from "./JobRequestEditor/DvmTile.svelte";
	import { appHandlers } from "$stores/nip89";
	import { findNip89Event } from "$utils/nip89";
	import { Avatar, EventCard, Name } from "@nostr-dev-kit/ndk-svelte-components";
	import ndk from "$stores/ndk";
	import Time from "svelte-time/src/Time.svelte";

    export let jobRequest: NDKDVMRequest;
    export let dvmPubkey: string;
    export let events: (NDKDVMJobFeedback | NDKDVMJobResult)[];

    let nip89event: NDKAppHandlerEvent | undefined;

    let paymentPending = false;
    let paymentPendingEvent: NDKDVMJobFeedback | undefined;

    $: if ($appHandlers && !nip89event) nip89event = findNip89Event(dvmPubkey, jobRequest.kind!);

    // check if the most recent event has an amount tag
    $: paymentPending = events[events.length-1]?.getMatchingTags('amount').length > 0;
    $: paymentPendingEvent = events.find((event) => event.getMatchingTags('amount').length > 0);

    let profile: NDKUserProfile | undefined;
    let fetchingProfile = false;

    $: if (nip89event && !profile && !fetchingProfile) {
        fetchingProfile = true;
        nip89event.fetchProfile().then((p) => {
            fetchingProfile = false;
            profile = p;
        });
    }

    let jobResults: NDKDVMJobResult[] = [];
    let mostRecentEvent: NDKEvent | undefined;

    $: jobResults = events.filter((event) => event.kind === NDKKind.DVMJobResult) as NDKDVMJobResult[];

    $: mostRecentEvent = events[events.length-1];

    function hasJobResult() {
        return jobResults.length > 0;
    }

    function useRelativeTime(event: NDKEvent) {
        const now = Date.now();
        const diff = now - (event.created_at! * 1000);

        return diff < 1000*60*60*24;
    }
</script>

{#if paymentPending && paymentPendingEvent}
    {#if nip89event}
        <DvmTile dvm={nip89event}>
            <JobFeedbackRow event={paymentPendingEvent} />
        </DvmTile>
    {:else}
        no nip89 event found
    {/if}
{:else if !fetchingProfile}
    <div class="card card-compact">
        <div class="card-body">
            <div class="flex flex-col items-start gap-4">
                <!-- header -->
                <div class="flex flex-row items-center justify-between w-full">
                    <div class="flex flex-row items-center gap-2 font-normal text-sm text-base-100-content">
                        <Avatar ndk={$ndk} userProfile={profile} class="w-8 h-8 rounded-full" />
                        <div class="flex flex-row items-center gap-1">
                            <span class="truncate max-w-xs inline-block">
                                <Name ndk={$ndk} userProfile={profile} class="font-semibold" />
                            </span>
                        </div>
                    </div>

                    <Time
                        relative={useRelativeTime(mostRecentEvent)}
                        timestamp={mostRecentEvent.created_at * 1000}
                        class="text-sm whitespace-nowrap"
                    />
                </div>

                <!-- body -->
                <!-- if we have a response, we show that -->
                {#if hasJobResult()}
                    {#each jobResults as jobResult (jobResult.id)}
                        <JobResultRow event={jobResult} imageClass="max-h-48 rounded-lg" />
                    {/each}
                {:else}
                    no results
                {/if}
            </div>
        </div>
    </div>
{/if}
<!--
<div class="flex flex-col gap-2">
    <DvmCard pubkey={dvmPubkey} kind={jobRequest.kind} />
    <div class="flex flex-col rounded-box bg-base-100 divide-y divide-base-300 gap-4 p-4">
        {#each events as event (event.id)}
            {#if event instanceof NDKDVMJobFeedback}
                <JobFeedbackRow {event} />
            {:else if event instanceof NDKDVMJobResult}
                <JobResultRow {event} />
            {/if}
        {/each}
    </div>
</div> -->