<script lang="ts">
	import DvmListItem from '$components/dvms/DvmListItem.svelte';
	import Nip89Tool from '$components/dvms/Nip89Tool/Nip89Tool.svelte';
	import Logo from '$icons/Logo.svelte';
    import ndk from '$stores/ndk';
	import { jobRequestKinds } from '$utils';
	import type { NDKEvent } from '@nostr-dev-kit/ndk';

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

    let showNip89Tool = false;
</script>

<div class="max-w-5xl mx-auto flex flex-col gap-8">
    <div class="mx-auto flex flex-col gap-4">
        <h1 class="text-7xl text-center font-black">Data Vending Machines</h1>
    </div>

    <div class="card max-w-2xl card-compact mx-auto items-start">
        <div class="alert rounded-b-none text-base-100-content">
            <Logo class="w-12 h-12" />
            <span>What are DVMs?</span>
        </div>
        <div class="card-body">
            <div class="text-lg flex flex-col items-start gap-4">

                <p>They are programs, serving and processing job requests on Nostr.</p>

                <p>Each DVM can support an ever-expanding range of job types.</p>
            </div>
        </div>
    </div>

    {#if showNip89Tool}
        <Nip89Tool on:cancel={() => showNip89Tool = false} on:done={() => showNip89Tool = false} />
    {:else}
        <div class="flex flex-col divide-y divide-base-300 mt-10 max-w-prose mx-auto">
            {#each $dvms as dvm}
                <DvmListItem {dvm} />
            {/each}
        </div>

        <hr>

        <div class="max-w-prose mx-auto flex flex-col gap-4">
            <h1 class="text-3xl text-center font-semibold">Unannounced DVMs</h1>
            <h2 class="text-center leading-loose">These are DVMs that have been seen acting in the wild but that have not create a NIP-89 record.</h2>
            <button class="btn btn-outline px-8 !rounded-full text-base-100-content self-center" on:click={() => showNip89Tool = !showNip89Tool}>
                List your DVM with NIP-89
            </button>
        </div>


        <div class="flex flex-col divide-y divide-base-300 mt-10 max-w-prose mx-auto">
            {#each Array.from(unannouncedDvmsEvents.values()) as dvm}
                {#if !dvmPubkeys.has(dvm.pubkey)}
                    <DvmListItem {dvm} />
                {/if}
            {/each}
        </div>
    {/if}
</div>