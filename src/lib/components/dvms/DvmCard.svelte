<script lang="ts">
    import ndk from '$stores/ndk';
	import { NDKAppHandlerEvent, NDKEvent, type NDKUser, type NDKUserProfile } from '@nostr-dev-kit/ndk';
	import { Avatar, EventCardDropdownMenu, EventContent, Name } from '@nostr-dev-kit/ndk-svelte-components';

    export let pubkey: string | undefined = undefined;
    export let kind: number | undefined = undefined;
    export let nip89event: NDKAppHandlerEvent | null | undefined = undefined;
    export let profile: NDKUserProfile | undefined = undefined;
    export let user: NDKUser | undefined = undefined;

    /**
     * Event that should be referrenced in the card (if different than the app handler event)
     */
    export let event: NDKEvent | undefined = undefined;

    if (!user) user = $ndk.getUser({hexpubkey: pubkey});

    const promise = new Promise((resolve) => {
        if (nip89event) return nip89event.fetchProfile().then(resolve);

        $ndk.fetchEvent({
            kinds: [31990 as number],
            "#k": [kind.toString()],
            authors: [pubkey]
        }).then((e) => {
            if (!e) {
                user?.fetchProfile().then(() => { resolve(user.profile); })
                return;
            }

            nip89event = NDKAppHandlerEvent.from(e);

            nip89event.fetchProfile().then(resolve);
        });
    });
</script>

{#await promise}
    here
{:then profile}
    <div class="flex flex-row gap-4 w-full card card-compact image-full md:!rounded-2xl overflow-hidden">
        <figure>
            <Avatar ndk={$ndk} userProfile={profile} {user} class="h-full bg-accent2" />
        </figure>

        <div class="card-body flex flex-col gap-4 overflow-x-hidden">
            <div class="flex flex-row gap-4 flex-grow">
                <div class="flex flex-col gap-2 whitespace-normal w-full">
                    <div class="flex flex-row justify-between dropdown dropdown-end">
                        <Name ndk={$ndk} userProfile={profile} {user} class="text-xl text-base-100-content truncate font-semibold" />
                        {#if event}
                            <EventCardDropdownMenu ndk={$ndk} {event} />
                        {/if}
                    </div>
                    <div class="text-base max-h-48 md:max-h-96 overflow-clip overflow-y-auto">
                        <EventContent
                            ndk={$ndk}
                            event={new NDKEvent(undefined, {
                                content: profile?.about||profile?.bio||"",
                                tags: []
                            })}
                        />
                    </div>
                </div>
            </div>

            <slot />
        </div>
    </div>
{:catch e}
        {e}
{/await}