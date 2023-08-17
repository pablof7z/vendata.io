<script lang="ts">
	import ndk from "$stores/ndk";
    import { nip19 } from 'nostr-tools';
	import { type NDKEvent, type NDKTag } from "@nostr-dev-kit/ndk";
	import { Avatar, Name } from "@nostr-dev-kit/ndk-svelte-components";
    import Time from "svelte-time";
	import PaymentRequiredButton from "$components/jobs/PaymentRequiredButton.svelte";
	import { kindToText } from "$utils";

    export let item: NDKEvent;

    let jobRequestId: string | undefined;
    let inputs: NDKTag[] = [];

    if (item.kind === 65000 || item.kind === 65001) {
        jobRequestId = item.tagValue('e');
        if (jobRequestId) {
            jobRequestId = nip19.noteEncode(jobRequestId);
        }
    } else {

    }

    inputs = item.getMatchingTags('i');

    function useRelativeTime() {
        const now = Date.now();
        const diff = now - item.created_at*1000;

        return diff < 1000*60*60*24;
    }
</script>

{#if item.rawEvent}
    <div class="card">
        <div class="card-body flex flex-col gap-2 w-full">
            <div class=" flex flex-row gap-4 items-center">
                <Avatar ndk={$ndk} pubkey={item.pubkey} class="w-12 h-12 rounded-full overflow-hidden" />
                <Name ndk={$ndk} pubkey={item.pubkey} class="font-semibold" />

                <div class="flex-grow"></div>

                <div class="flex flex-col">
                    <div class="text-xs">
                        <Time
                            relative={useRelativeTime()}
                            timestamp={item.created_at*1000}
                            class="text-sm whitespace-nowrap"
                        />
                    </div>

                    {#if item.kind === 65001}
                        <a class="btn btn-neutral" >
                            Result
                        </a>
                    {:else if item.kind === 65000}
                        {#if !['payment-required'].includes(item.tagValue('status'))}
                            <span>
                                {item.content}
                                {item.tagValue('status')}
                                {#if jobRequestId}
                                    <a href="/jobs/{jobRequestId}/">
                                        #{jobRequestId.slice(5, 10)}
                                    </a>
                                {/if}
                            </span>
                        {/if}
                    {:else}
                        <a class="btn btn-neutral" href="/jobs/{item.encode()}">{kindToText(item.kind)}</a>
                    {/if}

                    {#if item.tagValue('status') === 'payment-required'}
                        <PaymentRequiredButton
                            event={item}
                        />
                    {/if}
                </div>
            </div>

            <div class="flex flex-row gap-4 w-full">
                {#if item.tagValue('image')}
                    <img src={item.tagValue('image')} class="w-24 h-24 object-cover rounded-lg" />
                {/if}

                <div class="flex flex-col gap-2 truncate">
                    {#each inputs as input}
                        <p class="font-regular">
                            <span class="text-base-100-content">input:</span>
                            {#if input[2] === 'job'}
                                output of job #{input[1]?.slice(0, 8)} (job chaining)
                            {:else if input[2] === 'event'}
                                #{input[1]?.slice(0, 8)}
                            {:else}
                                {input[1]}
                            {/if}
                        </p>
                    {/each}

                    {#if item.tagValue('output')}
                        <p class="font-regular">
                            <span class="text-base-100-content">output:</span>
                            {item.tagValue('output')}
                        </p>
                    {/if}
                </div>
            </div>
        </div>
    </div>

{/if}