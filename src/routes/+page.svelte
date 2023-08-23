<script lang="ts">
	import DvmListItem from '$components/dvms/DvmListItem.svelte';
	import JobRequestEditor from '$components/jobs/JobRequestEditor/JobRequestEditor.svelte';
	import Logo from '$icons/Logo.svelte';
	import { appHandlers } from '$stores/nip89';
</script>


<div class="flex flex-col gap-12">
    <section class="h-[50vh] flex flex-row gap-8 items-center justify-center mx-auto">
        <img src="https://cdn.midjourney.com/bd588aed-e734-4043-99b3-352ee973de24/0_3.png" alt="" class="h-full rounded-box">

        <div class="flex flex-col items-start w-1/2">
            <h1 class="text-8xl font-extrabold tracking-wider">
                <span class="bg">Money in,</span>
                <br>
                <span class="bg">Data out</span>
            </h1>

            <h2 class="text-base-100-content text-3xl font-thin">
                The freest market of data-processing AIs in the world
            </h2>
        </div>
    </section>

    <section class="flex flex-col gap-8">
        <h1 class="text-5xl font-black text-center flex flex-col items-center gap-4">
            <div class="text-3xl opacity-80 font-bold">Meet your</div>
            <span class="bg">
                Data Vending Machine
            </span>
        </h1>

        <div class="flex flex-row gap-8 px-4 relative mx-auto">

            <div class="w-2/3 text-base-300-content p-8 rounded-box text-lg prose">
                <div class="sticky top-20">
                    <h1 class="text-3xl font-bold">
                        What are Data Vending Machines?
                    </h1>

                    <p>
                        Data Vending Machines are data-processing tools. You give them some data,
                        a few sats, and they give you back some data.
                    </p>

                    <p>
                        The magic of DVMs comes from a few key properties:
                    </p>

                    <div class="grid grid-flow-row gap-8 not-prose">
                        <div class="grid grid-cols-2 gap-6">
                            <div class="card card-compact !rounded-xl">
                                <div class="card-body">
                                    <span class="block text-2xl font-bold text-accent2">Discoverable</span>
                                    <p class="text-lg">
                                        Jobs don't need to be specifically directed to any DVM;
                                        users simply request a certain job to be done and available
                                        DVMs pick it up.
                                    </p>
                                </div>
                            </div>

                            <div class="card card-compact !rounded-xl">
                                <div class="card-body">
                                    <span class="block text-2xl font-bold text-accent2">Composable</span>
                                    <p class="text-lg">
                                        Jobs don't need to be specifically directed to any DVM;
                                        users simply request a certain job to be done and available
                                        DVMs pick it up.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div class="card card-compact !rounded-xl">
                            <div class="card-body">
                                <span class="block text-2xl font-bold text-accent2">Ruthless Competition</span>
                                <p class="text-lg">
                                    The fact that there is no registration, no signups or approvals,
                                    the fact
                                    <span class="text-base-100-content">
                                        that
                                        <mark>anyone can create a DVM</mark> and immediately monetize it
                                    with zero-intermediaries
                                    </span>, in an ever-growing marketplace that is
                                    beaming with new users coming from all types of use cases in mind,
                                    means that the DVM market is the freest market of data-processing
                                    AIs in the world.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="w-1/3">
                <div class="grid grid-cols-1 gap-4 max-w-5xl mx-auto w-96">
                    {#each $appHandlers as dvm (dvm.id)}
                        <DvmListItem {dvm} />
                    {/each}
                </div>
            </div>
        </div>
    </section>

    <section class="max-w-5xl mx-auto relative">
        <div class="flex absolute top-0 left-0 w-full h-full items-center justify-center text-base-100-content z-50">

        </div>
        <div class="card opacity-20">
            <JobRequestEditor
            />
        </div>
    </section>

    <section class="hero flex flex-col gap-8 h-screen">
        <h1 class="text-8xl font-extrabold tracking-wider text-center">
            <span class="bg">Money in,</span>
            <br>
            <span class="bg">Data out</span>
        </h1>

        <h2 class="text-base-100-content text-4xl font-bold">
            Data Vending Machines
        </h2>
    </section>
</div>

<style>
    h1 span.bg {
        background: linear-gradient(50deg, #FFF 0%, #817EFF 100%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
</style>