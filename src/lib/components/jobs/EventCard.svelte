<script lang="ts">
	import { eventUserReference } from "$utils";
	import type { NDKEvent } from "@nostr-dev-kit/ndk";
    import Time from "svelte-time";

    export let event: NDKEvent;
    export let title: string | undefined = undefined;
    export let href: string | undefined = "#";

    const timestamp = event.created_at!*1000;

    function useRelativeTime() {
        const now = Date.now();
        const diff = now - timestamp;

        return diff < 1000*60*60*24;
    }
</script>

<div class="card card-compact">
    <div class="card-body flex flex-col gap-8">
        <div class="card-title justify-between border-b border-base-300 pb-2">
            <h3>
                {title}
                <span class="font-normal opacity-50">{eventUserReference(event)}</span>
            </h3>

            <a {href}>
                {console.log({timestamp})}
                <Time
                    relative={useRelativeTime()}
                    {timestamp}
                    class="text-sm whitespace-nowrap"
                />
            </a>
        </div>

        <slot />
    </div>
</div>