<script lang="ts">
    import ndk from '$stores/ndk';
	import type { NDKEvent, NDKUser, NDKUserProfile } from '@nostr-dev-kit/ndk';
	import { Avatar, Name } from '@nostr-dev-kit/ndk-svelte-components';

    export let pubkey: string;
    export let kind: number;
    export let nip89event: NDKEvent | null | undefined = undefined;
    export let profile: NDKUserProfile | undefined = undefined;
    export let user: NDKUser | undefined = undefined;

    if (!user) user = $ndk.getUser({hexpubkey: pubkey});

    const promise = new Promise((resolve) => {
        if (nip89event) return resolve(nip89event);

        $ndk.fetchEvent({
            kinds: [31990 as number],
            "#k": [kind.toString()],
            authors: [pubkey]
        }).then((e) => {
            nip89event = e;

            if (nip89event?.content) {
                try {
                    profile = JSON.parse(nip89event.content) as unknown as NDKUserProfile;
                } catch (e) {}
            }

            resolve(e);
        });
    });
</script>

{#await promise}
{:then}
    <div class="w-full card card-compact truncate">
        <div class="card-body flex flex-row gap-4 whitespace-normal">
            <Avatar ndk={$ndk} bind:userProfile={profile} {user} class="w-24 h-24 object-cover rounded-lg" />
            <div class="flex flex-row gap-4">
                <div class="flex flex-col gap-2 truncate">
                    <Name ndk={$ndk} userProfile={profile} {user} class="text-xl text-base-100-content truncate" />
                    <span class="text-base whitespace-normal">{profile?.about||profile?.bio||""}</span>
                </div>
            </div>
        </div>
    </div>
{:catch e}
        {e}
{/await}