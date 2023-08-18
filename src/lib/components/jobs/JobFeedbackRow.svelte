<script lang="ts">
	import type { NDKEvent } from "@nostr-dev-kit/ndk";
	import JobStatusLabel from "./JobStatusLabel.svelte";

    export let event: NDKEvent;

    const status = event.tagValue("status");
</script>

<div class="
    flex flex-row w-full items-center whitespace-normal
    {event.kind === 65001 ? "text-lg" : ""}
">
    <div class="flex-grow max-h-96 overflow-y-auto overflow-x-clip">
        {event.content}
    </div>
    <div class="w-1/5 self-end text-right">
        <a href="https://nostr.com/{event.encode()}">
            <JobStatusLabel {status} {event} />
        </a>
    </div>
</div>