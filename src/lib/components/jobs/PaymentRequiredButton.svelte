<script lang="ts">
	import AttentionButton from "$components/buttons/AttentionButton.svelte";
	import Lightning from "$icons/Lightning.svelte";
    import type { NDKDVMJobResult, NDKEvent } from "@nostr-dev-kit/ndk";
    import { requestProvider } from 'webln';
    import {decode} from "light-bolt11-decoder";

    export let event: NDKDVMJobResult | NDKEvent;

    let amountInMsats: number;
    let invoice: string | null;
    const amountTag = event.getMatchingTags("amount")[0];

    if (amountTag) {
        amountInMsats = parseInt(amountTag[1]);
        invoice = amountTag[2];

        console.log({amountTag})
        console.log(invoice);

        try {
            const decodedInvoice = invoice ? decode(invoice) : null;
            const amount = parseInt(decodedInvoice?.sections.find((section: any) => section.name === "amount")?.value);

            if (amount) amountInMsats = amount;
        } catch (e) {
        }
    }

    async function pay() {
        console.log(invoice);
        if (!amountInMsats) return;

        try {
            if (!invoice) {
                invoice = await event.zap(amountInMsats);
            }

            const webln = await requestProvider();
            await webln.sendPayment(invoice!);
            // TODO we should check here if the payment was successful, with a timer
            // that is canceled here; if the timer doesn't come back, show the modal again
            // or instruct the user to do something with the failed payment
        } catch (err: any) {
            console.log(err);
            return;
        }
    }
</script>

<AttentionButton
    class="text-lg {$$props.class}"
    on:click={pay}
>
    <span class="opacity-80">Pay</span>
    {#if amountInMsats}
        <Lightning />
        {amountInMsats/1000} sats
    {/if}
</AttentionButton>
