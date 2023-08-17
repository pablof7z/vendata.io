<script lang="ts">
	import type { NDKDVMRequest, NDKTag } from "@nostr-dev-kit/ndk";
	import { nip19 } from "nostr-tools";

    export let jobs: NDKDVMRequest[] = [];
    export let inputTag: NDKTag | undefined = undefined;

    let type: string;
    let value: string;

    $: {
        if (type === 'url') {
            inputTag = [ value, type ];
        } else if (type === 'event') {
            try {
                const decoded = nip19.decode(value);
                let id: string | undefined;

                switch (decoded.type) {
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
</script>

{type}

<div class="flex flex-row gap-2">
    <div class="form-control">
        <select class="select select-bordered" bind:value={type}>
            <option value="url">URL</option>
            <option value="event">Nostr Event</option>

            {#each jobs as job, i}
                <option value={job.id}>Result of #{i+1} {job.encode().slice(0, 10)}...</option>
            {/each}
        </select>
    </div>

    {#if type === 'url'}
        <input type="text" placeholder="URL" class="input input-bordered w-full max-w-xs" bind:value={value} />
    {:else if type === 'event'}
        <input type="text" placeholder="Event ID <nevent1...>" class="input input-bordered w-full max-w-xs" bind:value />
    {/if}
</div>

{JSON.stringify(inputTag)}