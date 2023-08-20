<script lang="ts">
	import { eventUserReference } from "$utils";
	import type { NDKEvent } from "@nostr-dev-kit/ndk";
    import Time from "svelte-time";
    import { Avatar, EventCardDropdownMenu, Name } from "@nostr-dev-kit/ndk-svelte-components";
	import ndk from "$stores/ndk";

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

<div class="card card-compact group">
    <div class="card-body flex flex-col gap-3">
        <div class="card-title justify-between border-b border-base-300 pb-2">
            <div class="flex flex-row items-center gap-4">
                <h3>
                    {title}
                    <span class="font-normal opacity-50">{eventUserReference(event)}</span>
                </h3>

                <div class="flex flex-row items-center gap-2 font-normal text-xs opacity-50 group-hover:opacity-100 transition-all duration-50">
                    <Avatar ndk={$ndk} pubkey={event.pubkey} class="w-8 h-8 rounded-lg" />
                    <div>
                        requested by
                        <Name ndk={$ndk} pubkey={event.pubkey} class="font-normal" />
                    </div>
                </div>

            </div>

            <div class="flex flex-row gap-2 dropdown dropdown-end text-sm font-normal">
                <EventCardDropdownMenu {event} />
                <a {href}>
                    <Time
                        relative={useRelativeTime()}
                        {timestamp}
                        class="text-sm whitespace-nowrap"
                    />
                </a>
            </div>
        </div>

        <slot />
    </div>
</div>

<style lang="postcss">
    :global(.event-card--dropdown-menu) {
        @apply dropdown-content;
        @apply bg-base-100 p-4 rounded-box;
    }

    :global(.event-card--dropdown-menu li) {
        @apply py-1;
    }

    :global(.event-card--dropdown-menu li svg) {
        @apply mr-2;
    }
</style>
