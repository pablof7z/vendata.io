<script lang="ts">
	import Nostr from "$icons/Nostr.svelte";
import { kindToText } from "$utils";
	import { Image, TextAa, Translate } from "phosphor-svelte";

    export let kind: number;

    const jobRequestType = kindToText(kind!);
</script>

<div class="flex flex-row items-center gap-2">
    <div class="flex items-center justify-center rounded-md w-10 h-10 bg-base-300 text-base-content">
        {#if kind === 65002}
            <TextAa size="1.5rem" />
        {:else if kind === 65004}
            <Translate size="1.5rem" />
        {:else if kind === 65006}
            <Nostr size="1.5rem" />
        {:else if kind === 65005}
            <Image size="1.5rem" />
        {:else}
        {/if}
    </div>

    {jobRequestType}
</div>