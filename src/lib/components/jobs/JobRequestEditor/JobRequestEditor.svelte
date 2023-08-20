<script lang="ts">
    import ndk from '$stores/ndk';
	import NDK, { NDKDVMRequest, type NDKTag, type NostrEvent } from "@nostr-dev-kit/ndk";
    import { createEventDispatcher } from "svelte";
    import type { NDKDvmParam } from "@nostr-dev-kit/ndk";
	import JobRequestEditorInput from './JobRequestEditorInput.svelte';
    import JobRequestEditorPayment from './JobRequestEditorPayment.svelte';
    import JobRequestEditorParameters65002 from './JobRequestEditorParameters65002.svelte';
    import JobRequestEditorParameters65005 from './JobRequestEditorParameters65005.svelte';
	import { jobRequestKinds, kindToDescription, kindToText } from '$utils';
	import TypeCard from './TypeCard.svelte';

    const dispatch = createEventDispatcher();

    export let jobRequest: NDKDVMRequest | undefined;
    export let jobs: NDKDVMRequest[] | undefined;
    export let suggestedJobRequestInput: NDKDVMRequest | undefined = undefined;

    let type: string | undefined;
    let inputTags: NDKTag[] = [];
    let outputType: string = 'text/plain';
    let amount: number = 1000;
    let params: NDKDvmParam[] = [];

    if (suggestedJobRequestInput) {
        inputTags = [ [ suggestedJobRequestInput.id, "job" ] ]
    }

    $: if (inputTags.length === 0 && type === "65005") {
        inputTags = [ [ "", "text" ] ];
    }

    async function create() {
        jobRequest = new NDKDVMRequest($ndk as NDK, {
            kind: parseInt(type!),
        } as NostrEvent);

        for (const inputTag of inputTags) {
            jobRequest.addInput(...inputTag);
        }

        if (shouldShowOutput)
            jobRequest.output = outputType;

        params.forEach(param => jobRequest.tags.push([ "param", ...param ]));

        await jobRequest.sign();

        dispatch('created');

        await jobRequest.publish();

        console.log(jobRequest.rawEvent());
    }

    function addInput() {
        inputTags.push([]);
        inputTags = inputTags;
    }

    function removeInput(index: number) {
        inputTags.splice(index, 1);
        inputTags = inputTags.slice();  // re-assigning to trigger a reactive update in Svelte
    }

    let shouldShowOutput = true;
    $: shouldShowOutput = type !== '65005';
</script>

<div class="card-body flex flex-col gap-8">
    {#if !type}
        <div>
            <h1 class="text-3xl">Choose the job type you would like to run</h1>
            <div class="divider"></div>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 flex-wrap gap-4 justify-start">

            {#each jobRequestKinds as kind}
                <TypeCard {kind} on:click={() => { type = kind.toString() }} />
            {/each}
        </div>
    {:else}
        <section>
            <div>
                <div class="flex flex-row gap-2 items-end whitespace-nowrap">
                    <h1 class="text-3xl">{kindToText(parseInt(type))}</h1>
                    <h2 class="opacity-50 hidden md:block">{kindToDescription(parseInt(type))}</h2>
                </div>
                <div class="divider"></div>
            </div>

            <div class="flex flex-row items-end gap-2 mb-4">
                <button class="btn btn-circle btn-accent btn-outline btn-sm whitespace-nowrap ml-2" on:click={addInput}>
                    +
                </button>
                <div class="flex flex-row gap-2 items-end">
                    <h3 class="text-base-100-content text-xl">
                        Input
                    </h3>
                    <span class="font-thin text-base opacity-50">
                        Enter the data you want to be processed
                    </span>

                </div>
            </div>

            <div class="flex flex-col gap-4">
                {#each inputTags as inputTag, index (index)}
                    <div class="flex flex-row items-start group">
                        <button class="btn btn-ghost btn-xs group-hover:opacity-100 opacity-0 absolute -ml-6 mt-2" title="remove" on:click={() => { removeInput(index) }}>
                            x
                        </button>
                        <JobRequestEditorInput bind:inputTag={inputTags[index]} {jobs} />
                    </div>
                {/each}
            </div>
        </section>

        <section>
            {#if shouldShowOutput}
                <div class="flex flex-row gap-2 justify-between mb-2">
                    <div class="flex flex-col gap-2">
                        <h3 class="text-base-100-content text-xl">
                            Output
                        </h3>
                        <span class="font-thin text-base opacity-50">
                            Specify the desired output format
                        </span>
                    </div>

                    <input type="text" class="input input-bordered" placeholder="Desired output (mime type)" bind:value={outputType} />
                </div>
            {/if}
        </section>

        <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
        <details class="collapse collapse-arrow border border-base-300 bg-base-200">
            <summary class="collapse-title">
                <div class="flex flex-row gap-2 items-end">
                    <h3 class="text-base-100-content text-xl">
                        Parameters
                    </h3>
                    <span class="font-thin text-base opacity-50">
                        Specify any additional parameters
                    </span>
                </div>
            </summary>

            <div class="collapse-content">
                {#if type === "65002"}
                    <JobRequestEditorParameters65002 bind:params />
                {:else if type === "65005"}
                    <JobRequestEditorParameters65005 bind:params />
                {:else}
                    <em>No parameters</em>
                {/if}
            </div>
        </details>

        <section>
            <div class="flex flex-row gap-2 items-end mb-4">
                <h3 class="text-base-100-content text-xl">
                    Payment
                </h3>
                <span class="font-thin text-base opacity-50">
                    Indicate how much you are willing to pay for this job
                </span>
            </div>

            <JobRequestEditorPayment bind:amount />
        </section>

        <div class="card-actions">
            <button class="btn btn-accent btn-outline px-10" on:click={create}>
                SUBMIT
            </button>

            <button class="btn btn-ghost" on:click={() => {dispatch('cancel'); type = undefined;} }>
                Cancel
            </button>
        </div>
    {/if}
</div>

<style>
    :global(section.params) {
        @apply flex flex-col gap-1;
        @apply my-2;
    }

    :global(section.params h3) {
        @apply text-accent2;
    }
</style>