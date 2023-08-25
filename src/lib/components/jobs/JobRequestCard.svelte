<script lang="ts">
	import { eventUserReference, jobRequestKinds, kindToText } from '$utils';
	import EventCard from './EventCard.svelte';
	import { nip19 } from 'nostr-tools';
	import ndk from '$stores/ndk';
	import { onDestroy } from 'svelte';
	import { derived, type Readable, type Writable } from 'svelte/store';
	import JobFeedbackRow from './JobFeedbackRow.svelte';
	import JobResultRow from './JobResultRow.svelte';
	import {
		type NDKDVMRequest,
		type NDKTag,
		type NDKEvent,
		NDKDVMJobResult,
		NDKKind,
		NDKDVMJobFeedback
	} from '@nostr-dev-kit/ndk';
	import DvmCard from '$components/dvms/DvmCard.svelte';
	import JobRequestEditor from './JobRequestEditor/JobRequestEditor.svelte';
	import { Avatar, Name } from '@nostr-dev-kit/ndk-svelte-components';
	import JobTypeIcon from './JobTypeIcon.svelte';
	import { Plus } from 'phosphor-svelte';
	import { slide } from 'svelte/transition';
	import JobRequestEditorModal from '$modals/JobRequestEditorModal.svelte';
	import { openModal } from 'svelte-modals';
	import JobRequestCardDvmCard from './JobRequestCardDvmCard.svelte';

	export let jobRequest: NDKDVMRequest;
	export let compact = false;
	export let relatedJobRequests: Writable<Set<NDKEvent>>;

	if (relatedJobRequests) {
		relatedJobRequests.update((tree) => {
			if (!tree.has(jobRequest)) tree.add(jobRequest);
			return tree;
		});

		relatedJobRequests = relatedJobRequests;
	}

	let inputs: NDKTag[] = [];

	inputs = jobRequest.getMatchingTags('i');

	function encodeInput(input: NDKTag) {
		try {
			const id = input[1];
			let encodedId;

			if (id.match(/:/)) {
				const [kind, pubkey, identifier] = id.split(/:/);
				encodedId = nip19.naddrEncode({
					kind: parseInt(kind),
					pubkey,
					identifier
				});
			} else {
				encodedId = nip19.noteEncode(id);
			}

			return encodedId;
		} catch (e) {
			return '';
		}
	}

	const results = $ndk.storeSubscribe<NDKDVMJobResult>(
		{
			kinds: [7, 5, 65000 as number, 65001 as number],
			...jobRequest.filter()
		},
		{ closeOnEose: false, groupableDelay: 1000 },
		NDKDVMJobResult
	);

	const dependentJobs = $ndk.storeSubscribe<NDKEvent>(
		{
			kinds: jobRequestKinds,
			'#i': [jobRequest.tagId()]
		},
		{ closeOnEose: false, groupableDelay: 1000 }
	);

	const jobResults = derived(results, ($results) => {
		return $results.filter((result) => result.kind === 65001);
	});

	onDestroy(() => {
		results.unsubscribe();
		dependentJobs.unsubscribe();
	});

	let dvms: Record<string, (NDKDVMJobFeedback | NDKDVMJobResult)[]> = {};

	$: if ($relatedJobRequests && $dependentJobs.length > 0) {
		relatedJobRequests.update((tree) => {
			for (const event of $dependentJobs) {
				if (!tree.has(event)) tree.add(event);
			}
			return tree;
		});

		relatedJobRequests = relatedJobRequests;
	}

	$: for (const result of $results) {
		const key = result.pubkey;
		if (!dvms[key]) dvms[key] = [];
		const alreadyAdded = dvms[key].some((e) => e.id === result.id);

		if (!alreadyAdded) {
			let mappedEvent;

			if (result.kind === NDKKind.DVMJobFeedback) mappedEvent = NDKDVMJobFeedback.from(result);
			else if (result.kind === NDKKind.DVMJobResult) mappedEvent = NDKDVMJobResult.from(result);

			dvms[key].push(mappedEvent);
			dvms = dvms;
		}
	}

	let shouldShowJobFeedback = false;

	$: shouldShowJobFeedback = !compact; // && ($jobResults && $jobResults.length === 0);
	let addJobHover = false;
	let cardHover = false;
</script>

<EventCard
	event={jobRequest}
	href={`/jobs/${jobRequest.encode()}`}
	on:mouseover={() => (cardHover = true)}
	on:mouseout={() => (cardHover = false)}
>
	<div class="text-base-100-content flex w-full flex-row gap-4" slot="header">
		<div class="flex w-full flex-row gap-2 text-sm font-normal">
			<Avatar ndk={$ndk} pubkey={jobRequest.pubkey} class="h-8 w-8 rounded-full" />
			<div
				class="flex w-full flex-col justify-between gap-2 xl:flex-row xl:items-center xl:justify-start xl:gap-5"
			>
				<span class="inline-block max-w-xs" style="overflow-wrap: anywhere;">
					<Name ndk={$ndk} pubkey={jobRequest.pubkey} class="font-semibold" />
				</span>
				requested
				<JobTypeIcon kind={jobRequest.kind} />
				<div
					class="flex w-[140%] items-center justify-between sm:w-[124%] md:w-[115%] lg:w-[110%] xl:hidden"
				>
					requested
					<JobTypeIcon kind={jobRequest.kind} />
				</div>
			</div>
		</div>
	</div>

	<div class="flex flex-col gap-2 whitespace-normal">
		{#each inputs as input}
			<div class="flex flex-row items-baseline gap-2">
				<h3 class="font-semibold">
					<span class="text-lg">INPUT</span>
					{#if input[2]}
						<span class="font-normal opacity-50">({input[2]})</span>
					{/if}
				</h3>
				{#if input[2] === 'job'}
					<div class="flex flex-row gap-2">
						<span>output of</span>
						<a href="/jobs/{encodeInput(input)}" class="text-accent">
							#{input[1]?.slice(0, 8)}
						</a>
						(job chaining)
					</div>
				{:else if input[2] === 'event'}
					#{input[1]?.slice(0, 8)}
				{:else}
					<p style="overflow-wrap: anywhere;">
						{input[1]}
					</p>
				{/if}
			</div>
		{/each}
	</div>

	{#if $jobResults && $jobResults.length > 0}
		{#each $jobResults as jobResult (jobResult.id)}
			<JobResultRow event={jobResult} />
		{/each}
	{/if}

	{#if cardHover || true}
		<div
			class="relative
        "
		>
			<button
				class="
                    btn-normal group btn btn-sm inline-block flex w-fit min-w-[32px] flex-row items-center
                    !rounded-full !bg-base-300 from-gradient3
                    to-gradient4
                    p-1 font-normal
                    transition-all
                    duration-200 hover:bg-gradient-to-r
                    hover:px-4
                    hover:text-white
                "
				on:mouseover={() => (addJobHover = true)}
				on:mouseout={() => (addJobHover = false)}
				on:click={() => {
					openModal(JobRequestEditorModal, {
						suggestedJobRequestInput: jobRequest,
						jobs: [...$dependentJobs, jobRequest]
					});
				}}
			>
				<Plus size="1rem" />
				{#if addJobHover}
					<span class="line-clamp-1 whitespace-nowrap" transition:slide|local={{ axis: 'x' }}>
						Add job
					</span>
				{/if}
			</button>

			{#if $dependentJobs.length > 0}
				<div
					class=" absolute left-[5.5px] top-4 z-10 -mb-3 ml-2.5 mt-1.5 h-[5.50rem] w-2 rounded-bl-lg border-b-[1px] border-l-[1px] border-[#858A94]"
				></div>
			{:else if shouldShowJobFeedback}
				<div
					class=" absolute left-[5.5px] top-4 z-10 -mb-3 ml-2.5 mt-1.5 h-20 w-4 rounded-bl-lg border-b-[1px] border-l-[1px] border-[#858A94]"
				></div>
			{:else}{/if}
		</div>
	{/if}
</EventCard>

{#if shouldShowJobFeedback}
	<div class="ml-10">
		<div class="flex flex-col gap-8 divide-y divide-base-300">
			{#each Object.entries(dvms) as [dvmPubkey, events]}
				<JobRequestCardDvmCard {jobRequest} {dvmPubkey} {events} />
			{/each}
		</div>
	</div>
{/if}

{#if $dependentJobs.length > 0}
	<div class="rounded-box ml-5 flex flex-col gap-4 divide-y divide-base-300 bg-base-100 p-1">
		{#each $dependentJobs as event}
			{#if event}
				<svelte:self jobRequest={event} {relatedJobRequests} {compact} />
			{:else}
				no event?
			{/if}
		{/each}
	</div>
{/if}
