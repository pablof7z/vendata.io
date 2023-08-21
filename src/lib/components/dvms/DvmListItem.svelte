<script lang="ts">
    import ndk from '$stores/ndk';
	import { jobRequestKinds, kindToText } from '$utils';
	import { NDKEvent, type NDKUserProfile } from "@nostr-dev-kit/ndk";
	import { Avatar, EventCardDropdownMenu, EventContent, Name } from '@nostr-dev-kit/ndk-svelte-components';

    export let dvm: NDKEvent;

    const user = dvm.author;
    const kTag = dvm.tagValue("k");
    let supportedKind: number;

    if (kTag) supportedKind = parseInt(kTag);

    let profile: NDKUserProfile | undefined;

    if (dvm.content) {
        try {
            profile = JSON.parse(dvm.content) as unknown as NDKUserProfile;
        } catch (e) {}
    }

    const profilePromise = new Promise((resolve) => {
        if (profile?.name && profile?.image) {
            resolve(profile);
        } else {
            user.fetchProfile().then(resolve);
        }
    });

    const kTags = dvm.getMatchingTags("k");
</script>

{#await profilePromise then}
    <div class="flex flex-row gap-4 w-full truncate rounded-box card card-compact card-side">
        <figure class="w-1/4">
            <Avatar ndk={$ndk} userProfile={profile} {user} class="w-48 h-full bg-accent2" />
        </figure>
        <div class="card-body flex flex-col gap-4 w-3/4">
            <div class="flex flex-row gap-4">
                <div class="flex flex-col gap-2 whitespace-normal w-full">
                    <div class="flex flex-row justify-between dropdown dropdown-end">
                        <Name ndk={$ndk} userProfile={profile} {user} class="text-xl text-base-100-content truncate font-semibold" />
                        <EventCardDropdownMenu ndk={$ndk} event={dvm}>

                        </EventCardDropdownMenu>
                    </div>
                    <span class="text-base">
                        <EventContent
                            ndk={$ndk}
                            event={new NDKEvent(undefined, {
                                content: profile?.about||profile?.bio||"",
                                tags: []
                            })}
                        />
                    </span>
                </div>
            </div>

            {#if kTags.length > 0}
                <h3 class="text-base-100-content text-lg">Features</h3>
                {#each dvm.getMatchingTags("k") as tag}
                    {#if jobRequestKinds.includes(parseInt(tag[1]))}
                        {kindToText(parseInt(tag[1]))}
                    {/if}
                {/each}
            {/if}
        </div>
    </div>
{/await}

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
