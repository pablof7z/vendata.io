<script lang="ts">
	import { eventUserReference, kindToText } from "$utils";
	import type { NDKDVMRequest, NDKTag } from "@nostr-dev-kit/ndk";
	import { nip19 } from "nostr-tools";

    export let jobs: NDKDVMRequest[] = [];
    export let inputTag: NDKTag | undefined = undefined;
    export let kind: number;

    let type: string = inputTag ? inputTag[1] : "";
    let value: string = inputTag ? inputTag[0] : "";

    if (type === "job") {
        type = value;
    }

    $: {
        if (type === 'url') {
            inputTag = [ value, type ];
        } else if (type === 'text') {
            inputTag = [ value, type ];
        } else if (type === 'event') {
            try {
                const decoded = nip19.decode(value);
                let id: string | undefined;

                switch (decoded.type) {
                    case 'npub':
                        id = decoded.data;
                        break;
                    case 'note':
                        id = decoded.data;
                        break;
                    case 'nevent':
                        id = decoded.data.id;
                        break;
                    case 'naddr':
                        id = [
                            decoded.data.kind,
                            decoded.data.pubkey,
                            decoded.data.identifier,
                        ].join(':');
                }

                if (id) {
                    inputTag = [ id, "event" ];
                }
            } catch (e) {
                inputTag = undefined;
            }
        } else {
            inputTag = [ type, 'job' ];
        }
    }

    let selected: string;

    if (type) {
        selected = type;
    } else {
        if (kind === 65005) type = selected = "text";
        else if (kind === 65002) type = selected = "url";
        else type = selected = "event";
    }
</script>

<div class="flex flex-col gap-2 w-full">
    <select class="select select-bordered" bind:value={type}>
        <option value="text" selected={selected === 'text'}>Text</option>
        <option value="event" selected={selected === 'event'}>Nostr Event</option>
        <option value="url" selected={selected === 'url'}>URL</option>

        {#each jobs as job, i}
            <option value={job.id} selected={value === job.id}>Result of {kindToText(job.kind)} {eventUserReference(job)}...</option>
        {/each}
    </select>

    {#if type === 'url'}
        <input type="text" placeholder="URL" class="input input-bordered w-full" bind:value={value} />
    {:else if type === 'text'}
        <textarea rows="3" placeholder="Write some text..." class="textarea textarea-bordered w-full" bind:value={value} />
    {:else if type === 'event'}
        <input type="text" placeholder="Event ID <nevent1...>" class="input input-bordered w-full" bind:value />
    {/if}
</div>