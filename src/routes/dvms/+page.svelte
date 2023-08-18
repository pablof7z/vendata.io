<script lang="ts">
	import DvmListItem from '$components/dvms/DvmListItem.svelte';
    import ndk from '$stores/ndk';
	import type { NDKEvent } from '@nostr-dev-kit/ndk';

    const DVMKinds = [65002, 65003];

    const dvms = $ndk.storeSubscribe<NDKEvent>({
        kinds: [31990 as number],
        "#k": [
            "65002", "65003"
        ]
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

<div class="flex flex-col divide-y divide-base-300 mt-10 max-w-prose mx-auto">
    {#each $dvms as dvm}
        <DvmListItem {dvm} />
    {/each}
</div>

<h1>Unannounced DVMs</h1>

<div class="flex flex-col divide-y divide-base-300 mt-10 max-w-prose mx-auto">
    {#each Array.from(unannouncedDvmsEvents.values()) as dvm}
        {#if !dvmPubkeys.has(dvm.pubkey)}
            <DvmListItem {dvm} />
        {/if}
    {/each}
</div>