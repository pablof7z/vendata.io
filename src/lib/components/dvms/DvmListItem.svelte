<script lang="ts">
	import ndk from '$stores/ndk';
	import { kindToText } from '$utils';
	import { NDKKind, type NDKEvent, type NDKUserProfile } from "@nostr-dev-kit/ndk";
	import { Avatar, Name } from '@nostr-dev-kit/ndk-svelte-components';

    export let dvm: NDKEvent;

    const user = dvm.author;
    const kTag = dvm.tagValue("k");
    let supportedKind: number;

    if (kTag) supportedKind = parseInt(kTag);

    let profile: NDKUserProfile | undefined;

    const displayKinds = [
        NDKKind.DVMJobRequestTranscription,
        65003
    ];

    if (dvm.content) {
        try {
            profile = JSON.parse(dvm.content) as unknown as NDKUserProfile;
            console.log(profile);
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
                <Avatar ndk={$ndk} userProfile={profile} {user} class="w-12 h-12 rounded-lg" />
                <Name ndk={$ndk} userProfile={profile} {user} class="text-xl" />
            </div>

            {#each dvm.getMatchingTags("k") as tag}
                {#if displayKinds.includes(parseInt(tag[1]))}
                    {kindToText(parseInt(tag[1]))}
                {/if}
            {/each}
        </div>
    </div>
{/await}