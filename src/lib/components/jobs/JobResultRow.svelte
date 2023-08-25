<script lang="ts">
	import type { NDKDVMJobResult, NDKTag } from "@nostr-dev-kit/ndk";
    import ndk from "$stores/ndk";
	import JobStatusLabel from "./JobStatusLabel.svelte";
	import { Avatar, EventContent, Name, UserCard } from "@nostr-dev-kit/ndk-svelte-components";
	import Time from "svelte-time/src/Time.svelte";
	import { onMount } from "svelte";
	import { markEventAsSeen } from "$stores/notifications";

    export let event: NDKDVMJobResult;
    export let dontMarkAsSeen: boolean = false;

    const status = event.tagValue("status");

    function contentIsImageUrl() {
        try {
            const url = new URL(event.content);

            return url.pathname.endsWith(".png") || url.pathname.endsWith(".jpg");
        } catch (e) {
            return false;
        }
    }

    const timestamp = event.created_at!*1000;

    function useRelativeTime() {
        const now = Date.now();
        const diff = now - timestamp;

        return diff < 1000*60*60*24;
    }

    let decodedContent: NDKTag[] | undefined;

    try {
        decodedContent = JSON.parse(event.content);
    } catch (e) {}

    function shouldRestrictResultHeight() {
        return (
            !contentIsImageUrl() &&
            event.jobRequest?.kind !== 65006
        )
    }

    onMount(() => {
        if (!dontMarkAsSeen) markEventAsSeen(event.id);
    })
</script>

<div class="
    flex flex-row w-full items-center whitespace-normal
    {event.kind === 65001 ? "text-base" : ""}
">
    <div class="flex-grow overflow-y-auto overflow-x-clip
        {shouldRestrictResultHeight() ? "max-h-48" : ""}
    ">
        {#if event.kind === 65001 && contentIsImageUrl()}
            <img src={event.content} class={$$props.imageClass} />
        {:else if event.jobRequest?.kind === 65006}
            {#if decodedContent}
                <div class="flex flex-col divide-y divide-y-base-300">
                    {#each decodedContent as tag}
                        <div class="flex flex-row gap-4 p-2">
                            {#if tag[0] === "p"}
                                <UserCard ndk={$ndk} pubkey={tag[1]} class="" />
                            {:else if tag[0] === "e"}
                                {#await $ndk.fetchEvent(tag[1]) then event}
                                    <EventContent ndk={$ndk} {event} showMedia={true} />
                                {/await}
                            {:else}
                                {tag[1]}
                            {/if}
                        </div>
                    {/each}
                </div>
            {:else}
                {event.content}
            {/if}
        {:else}
            <EventContent ndk={$ndk} {event} showMedia={true} />
        {/if}
    </div>
</div>