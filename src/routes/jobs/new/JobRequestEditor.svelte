<script lang="ts">
    import ndk from '$stores/ndk';
	import NDK, { NDKDVMRequest, type NDKTag, type NostrEvent } from "@nostr-dev-kit/ndk";
    import { createEventDispatcher } from "svelte";
	import JobRequestEditorInput from './JobRequestEditorInput.svelte';
    import JobRequestEditorPayment from './JobRequestEditorPayment.svelte';
	import { jobRequestKinds, kindToText } from '$utils';
	import TypeCard from './TypeCard.svelte';

    const dispatch = createEventDispatcher();

    export let jobRequest: NDKDVMRequest | undefined;
    export let jobs: NDKDVMRequest[] | undefined;

    let type: string | undefined;
    let inputTags: NDKTag[] = [[]];
    let outputType: string = 'text/plain';
    let amount: number = 1000;

    async function create() {
        jobRequest = new NDKDVMRequest($ndk as NDK, {
            kind: parseInt(type),
        } as NostrEvent);

        for (const inputTag of inputTags) {
            jobRequest.addInput(...inputTag);
        }

        if (shouldShowOutput)
            jobRequest.output = outputType;

        if (type === '65002') {
            if (rangeStart && rangeEnd) jobRequest.tags.push([ "param", "range", rangeStart, rangeEnd ]);
        }

        if (type === '65005') {
            if (prompt) jobRequest.tags.push([ "param", "prompt", prompt ]);
            if (negativePrompt) jobRequest.tags.push([ "param", "negative_prompt", negativePrompt ]);
        }

        await jobRequest.sign();

        dispatch('created');

        await jobRequest.publish();

        console.log(jobRequest.rawEvent());
    }

    let prompt: string | undefined;
    let negativePrompt: string | undefined;

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

    let rangeStart: string | undefined;
    let rangeEnd: string | undefined;
</script>

<div class="card-body">
    {#if !type}
        <div>
            <h1 class="text-3xl">Choose the job type you would like to run</h1>
            <div class="divider"></div>
        </div>

        <div class="grid grid-cols-3 flex-wrap gap-4 justify-start">

            {#each jobRequestKinds as kind}
                <TypeCard {kind} on:click={() => { type = kind.toString() }} />
            {/each}
        </div>
    {:else}
        <div>
            <h1 class="text-3xl">{kindToText(parseInt(type))}</h1>
            <div class="divider"></div>
        </div>

        <h3>
            Input
            <button class="btn btn-circle btn-neutral btn-xs ml-2" on:click={addInput}>
                +
            </button>
        </h3>

        {#each inputTags as inputTag, index (index)}
            <div class="flex flex-row items-center group">
                <button class="btn btn-ghost btn-xs group-hover:opacity-100 opacity-0 absolute -ml-6" title="remove" on:click={() => { removeInput(index) }}>x</button>
                <JobRequestEditorInput bind:inputTag={inputTags[index]} {jobs} />
            </div>
        {/each}

        {#if shouldShowOutput}
            <h3>Output</h3>

            <input type="text" class="input input-bordered" placeholder="Desired output (mime type)" bind:value={outputType} />
        {/if}

        <h3>Parameters</h3>

        {#if type === "65002"}
            <p>Range (for audio/video)</p>
            <div class="flex flex-row gap-2">
                <input type="number" class="input input-bordered" placeholder="Starting second" bind:value={rangeStart} />
                <input type="number" class="input input-bordered" placeholder="Finishing second" bind:value={rangeEnd} />
            </div>
        {:else if type === "65005"}
            <h3>Prompt (optional)</h3>
            <input type="text" class="input input-bordered" placeholder="" bind:value={prompt} />
            <h3>Negative prompt (optional)</h3>
            <input type="text" class="input input-bordered" placeholder="" bind:value={negativePrompt} />
        {/if}

        <h3>Payment</h3>

        <p>Indicate how much you are willing to pay for this job</p>

        <JobRequestEditorPayment bind:amount />

        <div class="card-actions">
            <button class="btn btn-primary" on:click={create}>
                Create
            </button>

            <button class="btn btn-ghost" on:click={() => dispatch('cancel')}>
                Cancel
            </button>
        </div>
    {/if}
</div>