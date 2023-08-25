<script lang="ts">
	import type { NDKDVMJobResult, NDKEvent } from "@nostr-dev-kit/ndk";
    import { requestProvider } from 'webln';

    export let event: NDKDVMJobResult | NDKEvent;


    let amountInMsats: number;
    let invoice: string | null;
    const amountTag = event.getMatchingTags("amount")[0];

    if (amountTag) {
        amountInMsats = parseInt(amountTag[1]);
        invoice = amountTag[2];
    }

    async function pay() {
        if (!amountInMsats) return;

        try {
            if (!invoice) {
                invoice = await event.zap(parseInt(amountInMsats));
            }

            console.log({invoice});

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

<button
    class="btn btn-neutral h-full p-0 px-2"
    on:click|preventDefault|stopPropagation={pay}
>
    Payment required
    {#if amountInMsats}
        {amountInMsats/1000} sats
    {/if}
</button>