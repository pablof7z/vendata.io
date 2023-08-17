<script lang="ts">
    import ndk from '$stores/ndk';
	import NDK, { NDKDVMRequest, type NDKTag, type NostrEvent } from "@nostr-dev-kit/ndk";
    import { createEventDispatcher } from "svelte";
	import JobRequestEditorInput from './JobRequestEditorInput.svelte';
    import JobRequestEditorPayment from './JobRequestEditorPayment.svelte';

    const dispatch = createEventDispatcher();

    export let jobRequest: NDKDVMRequest | undefined;
    export let jobs: NDKDVMRequest[] | undefined;

    let type: string = '65002';
    let inputTag: NDKTag;
    let outputType: string = 'text/plain';
    let amount: number = 1000;

    async function create() {
        jobRequest = new NDKDVMRequest($ndk as NDK, {
            kind: parseInt(type),
        } as NostrEvent);

        jobRequest.addInput(...inputTag);

        if (type === '65002') {
            jobRequest.tags.push([ "range", "100", "200"]);
        }

        jobRequest.output = outputType;

        await jobRequest.sign();
        await jobRequest.publish();

        // console.log(jobRequest.rawEvent());

        dispatch('created');
    }
</script>

<div class="card-body">
    <div class="form-control w-full max-w-xs">
        <label class="label">
            <span class="label-text">Type</span>
        </label>
        <select class="select select-bordered" bind:value={type}>
            <option disabled selected>Pick one</option>
            <option value="65002">Text extraction</option>
            <option value="65003">Summarization</option>
            <option value="65004">Translation</option>
        </select>
    </div>

    <h3>Input</h3>

    <JobRequestEditorInput
        bind:inputTag
        {jobs}
    />

    <h3>Output</h3>

    <input type="text" class="input input-bordered" placeholder="Desired output (mime type)" bind:value={outputType} />

    <h3>Payment</h3>

    <p>Indicate how much you are willing to pay for this job</p>

    <JobRequestEditorPayment bind:amount />

    <div class="card-actions">
        <button class="btn btn-primary" on:click={create}>
            Create
        </button>
    </div>
</div>