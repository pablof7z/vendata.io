<script lang="ts">
	import type { NDKEvent } from "@nostr-dev-kit/ndk";
	import PaymentRequiredButton from "./PaymentRequiredButton.svelte";

    export let event: NDKEvent | undefined = undefined;
    export let status: string | undefined = undefined;
</script>

{#if status === 'success'}
    <span class="text-success">Success</span>
{:else if status === 'payment-required' && event}
    <PaymentRequiredButton {event} />
{:else}
    {status}
{/if}