<script lang="ts">
	import type { NDKDVMJobResult, NDKTag } from "@nostr-dev-kit/ndk";
    import ndk from "$stores/ndk";
	import JobStatusLabel from "./JobStatusLabel.svelte";
	import { Avatar, EventContent, Name, UserCard } from "@nostr-dev-kit/ndk-svelte-components";
	import Time from "svelte-time/src/Time.svelte";

    export let event: NDKDVMJobResult;

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
</script>

<div class="
    flex flex-row w-full items-center whitespace-normal
    {event.kind === 65001 ? "text-lg" : ""}
">
    <div class="flex-grow overflow-y-auto overflow-x-clip
        {shouldRestrictResultHeight() ? "max-h-48" : ""}
    ">
        {#if event.kind === 65001 && contentIsImageUrl()}
            <img src={event.content} class="max-h-96" />
        {/if}
        {#if event.jobRequest?.kind === 65006}
            {#if decodedContent}
                <div class="flex flex-col divide-y divide-y-base-300">
                    {#each decodedContent as tag}
                        <div class="flex flex-row gap-4 p-2">
                            <UserCard ndk={$ndk} pubkey={tag[1]} class="" />
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
    <div class="w-1/5 self-end text-right">
        <a href="https://nostr.com/{event.encode()}">
            <Time
                live={true}
                relative={useRelativeTime()}
                {timestamp}
                class="text-xs font-normal my-0.5 block opacity-50 whitespace-nowrap"
            />
            <JobStatusLabel {status} {event} />
        </a>
    </div>
</div>