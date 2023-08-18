<script lang="ts">
	import DvmListItem from '$components/dvms/DvmListItem.svelte';
    import ndk from '$stores/ndk';
	import { jobRequestKinds } from '$utils';
	import type { NDKEvent } from '@nostr-dev-kit/ndk';

    const DVMKinds = [65002, 65003];

    const dvms = $ndk.storeSubscribe<NDKEvent>({
        kinds: [31990 as number],
        "#k": jobRequestKinds.map(j => j.toString())
    });

    const dvmPubkeys = new Set<string>();

    $: $dvms.forEach(dvm => dvmPubkeys.add(dvm.pubkey));

    const unannouncedDvms = $ndk.storeSubscribe<NDKEvent>({
        kinds: [65001]
    });

    let unannouncedDvmsEvents = new Map<string, NDKEvent>();

    $: if ($unannouncedDvms) {
        $unannouncedDvms.forEach((e) => {
            if (!unannouncedDvmsEvents.has(e.pubkey)) {
                unannouncedDvmsEvents.set(e.pubkey, e);
                unannouncedDvmsEvents = unannouncedDvmsEvents;
            }
        })
    }
</script>

<div class="max-w-5xl mx-auto">
    <div class="mx-auto flex flex-col gap-4">
        <h1 class="text-7xl text-center font-extralight">Data Vending Machines</h1>
    </div>

    <div class="flex flex-col divide-y divide-base-300 mt-10 max-w-prose mx-auto">
        {#each $dvms as dvm}
            <DvmListItem {dvm} />
        {/each}
    </div>

    <div class="max-w-prose mx-auto flex flex-col gap-4">
        <h1 class="text-5xl text-center font-bold">Unannounced DVMs</h1>
        <h2 class="text-center leading-loose">These are DVMs that have been seen acting in the wild but that have not create a NIP-89 record.</h2>
        <button class="btn btn-ghost">
            Create NIP-89 for a DVM
        </button>
    </div>

    <div class="flex flex-col divide-y divide-base-300 mt-10 max-w-prose mx-auto">
        {#each Array.from(unannouncedDvmsEvents.values()) as dvm}
            {#if !dvmPubkeys.has(dvm.pubkey)}
                <DvmListItem {dvm} />
            {/if}
        {/each}
    </div>
</div>