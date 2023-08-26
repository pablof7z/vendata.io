<script lang="ts">
	import { NDKDVMJobResult, NDKDVMJobFeedback, NDKDVMRequest, NDKAppHandlerEvent, type NDKUserProfile, NDKKind, NDKEvent } from "@nostr-dev-kit/ndk";
	import JobResultRow from "./JobResultRow.svelte";
	import { appHandlers } from "$stores/nip89";
	import { findNip89Event } from "$utils/nip89";
	import { Avatar, EventContent, Name } from "@nostr-dev-kit/ndk-svelte-components";
	import ndk from "$stores/ndk";
	import Time from "svelte-time/src/Time.svelte";
	import type { NDKEventStore } from "@nostr-dev-kit/ndk-svelte";
	import JobStatusLabel from "./JobStatusLabel.svelte";
	import PaymentRequiredButton from "./PaymentRequiredButton.svelte";
	import DvmListItem from "$components/dvms/DvmListItem.svelte";
	import DvmCard from "$components/dvms/DvmCard.svelte";
	import JobFeedbackRow from "./JobFeedbackRow.svelte";

    export let jobRequest: NDKDVMRequest;
    export let dvmPubkey: string;
    export let events: NDKEventStore<NDKEvent>;

    let nip89event: NDKAppHandlerEvent | undefined;

    let paymentPending = false;
    let paymentPendingEvent: NDKDVMJobFeedback | undefined;

    $: if ($appHandlers && !nip89event) nip89event = findNip89Event(dvmPubkey, jobRequest.kind!);

    // check if the most recent event has an amount tag
    $: if (mostRecentEvent) {
        paymentPending = mostRecentEvent.getMatchingTags('amount').length > 0;
        paymentPendingEvent = $events.find((event) => event.getMatchingTags('amount').length > 0);
    }

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

    $: jobResults = $events
        .filter((event) => event.kind === NDKKind.DVMJobResult)
        .map((event) => NDKDVMJobResult.from(event));

    $: mostRecentEvent = $events.sort((a, b) => {
        return b.created_at! - a.created_at!;
    })[0];

    let hasJobResult: boolean;

    $: hasJobResult = jobResults.length > 0;

    function useRelativeTime(event: NDKEvent) {
        const now = Date.now();
        const diff = now - (event.created_at! * 1000);

        return diff < 1000*60*60*24;
    }

    let showTime = false;

    function shouldShowTime() {
        // show time after 5 minutes
        if (mostRecentEvent) {
            const diff = Date.now() - (mostRecentEvent.created_at! * 1000);
            return diff > 1000*60*5;
        }

        return true;
    }

    $: if (mostRecentEvent) showTime = shouldShowTime();

    if (!showTime) {
        setInterval(() => {
            showTime = shouldShowTime();
        }, 1000*60);
    }
</script>

{#if paymentPending && paymentPendingEvent}
    <div class="w-1/2">
    {#if nip89event}
        <DvmListItem
            dvm={nip89event}
            event={paymentPendingEvent || mostRecentEvent}
        >
            <div class="h-full flex flex-col justify-end gap-6">
                {#if paymentPendingEvent.content.length > 0}
                    <div class="p-2 glass rounded-lg">
                        <div class="bg-base-300 p-4 rounded-lg text-left">
                            <EventContent
                                event={paymentPendingEvent}
                            />
                        </div>
                    </div>
                {/if}
                <PaymentRequiredButton
                    event={paymentPendingEvent}
                    class="!uppercase"
                />
            </div>
        </DvmListItem>
    {:else}
        <DvmCard pubkey={paymentPendingEvent.pubkey} kind={jobRequest.kind} />
        <div class="h-full flex flex-col justify-end gap-6">
            {#if paymentPendingEvent.content.length > 0}
                <div class="p-2 glass rounded-lg">
                    <div class="bg-base-300 p-4 rounded-lg text-left">
                        <EventContent
                            event={paymentPendingEvent}
                        />
                    </div>
                </div>
            {/if}
            <PaymentRequiredButton
                event={paymentPendingEvent}
                class="!uppercase"
            />
        </div>
    {/if}
    </div>
{:else if !fetchingProfile}
    <div class="card card-compact">
        <div class="card-body">
            <div class="flex flex-col items-start gap-4">
                <!-- header -->
                <div class="flex flex-row items-center justify-between w-full">
                    <div class="flex flex-row items-center gap-2 font-normal text-sm text-base-100-content">
                        <Avatar ndk={$ndk} userProfile={profile} pubkey={dvmPubkey} class="w-8 h-8 rounded-full" />
                        <div class="flex flex-row items-center gap-1">
                            <span class="truncate max-w-xs inline-block">
                                <Name ndk={$ndk} userProfile={profile} pubkey={dvmPubkey} class="font-semibold" />
                            </span>
                        </div>
                    </div>

                    {#if showTime}
                        <Time
                            relative={useRelativeTime(mostRecentEvent)}
                            timestamp={mostRecentEvent.created_at * 1000}
                            class="text-sm whitespace-nowrap"
                        />
                    {/if}

                    {#if !hasJobResult}
                        <JobStatusLabel status={mostRecentEvent?.tagValue('status')} />
                    {/if}
                </div>

                <!-- body -->
                <!-- if we have a response, we show that -->
                {#if hasJobResult}
                    {#each jobResults as jobResult (jobResult.id)}
                        <JobResultRow event={jobResult} imageClass="max-h-48 rounded-lg" />
                    {/each}
                {:else}
                    {mostRecentEvent.content}
                {/if}
            </div>
        </div>
    </div>
{/if}


<!-- <div class="flex flex-col gap-2">
    <div class="flex flex-col rounded-box bg-base-100 divide-y divide-base-300 gap-4 p-4">
        {#each $events as event (event.id)}
            {event.kind}
            <br>
            {event.encode()}
            <br>
            {event.content}
            {JSON.stringify(event.rawEvent())}
            {#if event instanceof NDKDVMJobFeedback}
                <JobFeedbackRow {event} />
            {:else if event instanceof NDKDVMJobResult}
                <JobResultRow {event} />
            {/if}
        {/each}
    </div>
</div> -->