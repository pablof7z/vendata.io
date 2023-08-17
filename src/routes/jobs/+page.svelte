<script lang="ts">
	import JobCard from '$components/jobs/JobCard.svelte';
	import { currentUser } from '$stores/current-user';
    import ndk from '$stores/ndk';
	import { NDKDVMRequest } from '@nostr-dev-kit/ndk';

    const myJobs = $ndk.storeSubscribe({
        kinds: [65002 as number, 65003 as number],
        authors: [$currentUser!.hexpubkey()]
    }, undefined, NDKDVMRequest)
</script>

<div class="flex flex-col gap-2">
    {#each $myJobs as job}
        <JobCard {job} />
    {/each}
</div>