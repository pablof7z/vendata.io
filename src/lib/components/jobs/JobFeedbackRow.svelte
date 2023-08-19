<script lang="ts">
	import type { NDKEvent } from "@nostr-dev-kit/ndk";
    import ndk from "$stores/ndk";
	import JobStatusLabel from "./JobStatusLabel.svelte";
	import { EventContent } from "@nostr-dev-kit/ndk-svelte-components";

    export let event: NDKEvent;

    const status = event.tagValue("status");

    function contentIsImageUrl() {
        try {
            const url = new URL(event.content);

            return url.pathname.endsWith(".png") || url.pathname.endsWith(".jpg");
        } catch (e) {
            return false;
        }
    }
</script>

<div class="
    flex flex-row w-full items-center whitespace-normal
    {event.kind === 65001 ? "text-lg" : ""}
">
    <div class="flex-grow overflow-y-auto overflow-x-clip
        {contentIsImageUrl() ? "" : "max-h-96"}
    ">
        {#if event.kind === 65001 && contentIsImageUrl()}
            <img src={event.content} class="max-h-96" />
        {/if}
        <EventContent ndk={$ndk} {event} showMedia={true} />
    </div>
    <div class="w-1/5 self-end text-right">
        <a href="https://nostr.com/{event.encode()}">
            <JobStatusLabel {status} {event} />
        </a>
    </div>
</div>