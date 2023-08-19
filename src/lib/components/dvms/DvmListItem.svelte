<script lang="ts">
	import ndk from '$stores/ndk';
	import { jobRequestKinds, kindToText } from '$utils';
	import { NDKEvent, type NDKUserProfile } from "@nostr-dev-kit/ndk";
	import { Avatar, EventContent, Name } from '@nostr-dev-kit/ndk-svelte-components';

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
    <div class="flex flex-row gap-4 w-full card card-compact truncate card-side rounded-box">
        <figure>
            <Avatar ndk={$ndk} userProfile={profile} {user} class="w-48 h-full bg-accent2" />
        </figure>
        <div class="card-body flex flex-col gap-4">
            <div class="flex flex-row gap-4">
                <div class="flex flex-col gap-2 truncate">
                    <Name ndk={$ndk} userProfile={profile} {user} class="text-xl text-base-100-content truncate" />
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