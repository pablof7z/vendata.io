<script lang="ts">
	import type { NDKDVMRequest, NDKEvent } from "@nostr-dev-kit/ndk";
    import JobRequestEditor from "./JobRequestEditor.svelte";
	import JobCard from "$components/jobs/JobCard.svelte";
	import FeedItem from "$components/feed/FeedItem.svelte";
	import type { NDKEventStore } from "@nostr-dev-kit/ndk-svelte";
	import ndk from "$stores/ndk";

    let jobs: NDKDVMRequest[] = [];
    let jobRequest: NDKDVMRequest | undefined;
    let showNewJobRequest = false;

    let results: NDKEventStore<NDKEvent>;

    function jobCreated() {
        if (jobRequest) jobs.push(jobRequest);
        jobs = jobs;
        jobRequest = undefined;
        showNewJobRequest = false;

        if (results) results.unsubscribe();

        results = $ndk.storeSubscribe(
            jobs.map((job) => job.filter()),
            { closeOnEose: false },
        );
    }
</script>

<div class="flex flex-row gap-8">
    <div class="flex flex-col divide-y divide-base-300 w-2/5 truncate">
        {#if showNewJobRequest}
            <div class="max-w-prose mx-auto card">
                <JobRequestEditor
                    bind:jobRequest
                    {jobs}
                    on:created={jobCreated}
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

        {#each jobs as jobRequest}
            <FeedItem item={jobRequest} />
        {/each}
    </div>

    {#if $results}
        <div class="flex flex-col divide-y divide-base-300 flex-grow">
            {#each $results as result}
                <FeedItem item={result} />
            {/each}
        </div>
    {/if}
</div>

<style>
    h3 {
        @apply text-lg text-base-100-content font-semibold;
    }
</style>
