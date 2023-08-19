<script lang="ts">
	import ndk from '$stores/ndk';
	import { jobRequestKinds, kindToText } from '$utils';
	import type { NDKEvent, NDKUserProfile } from "@nostr-dev-kit/ndk";
	import { Avatar, Name } from '@nostr-dev-kit/ndk-svelte-components';

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
        if (profile?.name) {
            resolve(profile);
        } else {
            user.fetchProfile().then(resolve);
        }
    });
</script>

{#await profilePromise then}
    <div class="flex flex-row gap-4 w-full card card-compact">
        <div class="card-body flex flex-col gap-4">
            <div class="flex flex-row gap-4">
                <Avatar ndk={$ndk} userProfile={profile} {user} class="w-20 h-20 rounded-lg" />

                <div class="flex flex-col gap-2">
                    <Name ndk={$ndk} userProfile={profile} {user} class="!text-xl !text-base-100-content !font-semibold" />
                    <span class="text-base">{profile?.about??""}</span>
                </div>
            </div>

            <h3 class="text-base-100-content text-lg">Features</h3>
            {#each dvm.getMatchingTags("k") as tag}
                {#if jobRequestKinds.includes(parseInt(tag[1]))}
                    {kindToText(parseInt(tag[1]))}
                {/if}
            {/each}
        </div>
    </div>
{/await}