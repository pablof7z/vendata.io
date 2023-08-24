<script lang="ts">
	import type { NDKDvmParam, NDKEvent } from '@nostr-dev-kit/ndk';
    import JobRequestEditorParameters65002 from './JobRequestEditorParameters65002.svelte';
	import type { Nip90Param } from '$utils/nip90';
	import { fade } from 'svelte/transition';

    export let params: NDKDvmParam[] = [];
    export let kind: number;
    export let nip89Events: NDKEvent[];

    let dvmParams: Record<string, Nip90Param> = {};

    nip89Events.forEach((nip89Event) => {
        try {
            const content = JSON.parse(nip89Event.content);
            const nip90Params: Record<string, Nip90Param>[] = content.nip90Params;

            console.log(nip90Params)

            // go through each param and add it to the dvmParams object so that if there are multiple values inside the Nip90Param for the same name, all of them are added
            for (const [name, params] of Object.entries(nip90Params)) {
                console.log('values', params.values);
                if (dvmParams[name] && params.values) {
                    dvmParams[name].values ??= [];
                    dvmParams[name].values!.push(...params.values);
                } else {
                    dvmParams[name] = params;

                    if (name === 'negative_prompt' || name === 'ratio') {
                        dvmParams[name].required = true;
                    }
                }
            }

            dvmParams = dvmParams;
        } catch (e) {
            console.log(e)
        }
    })

    const showParamMenu: Record<string, boolean> = {};
    const paramValues: Record<string, string> = {};

    let showAllParams = false;
</script>

<div class="flex flex-col gap-2 mb-4">
    {#each Object.keys(dvmParams) as paramName}
        {#if dvmParams[paramName].required}
            <div class="flex flex-row gap-2">
                <p>{paramName}</p>
                <div class="dropdown">
                    <input
                        tabindex="0"
                        class="input input-bordered input-sm"
                        bind:value={paramValues[paramName]}
                        on:focus={() => showParamMenu[paramName] = true}
                        on:blur={() => setTimeout(() => {showParamMenu[paramName] = false}, 20)}
                    />
                    {#if dvmParams[paramName].values && dvmParams[paramName].values.length > 0 && showParamMenu[paramName]}
                        <ul class="dropdown-content menu z-[1] p-2 shadow bg-base-100 rounded-box" transition:fade={{duration:100}}>
                            {#each dvmParams[paramName].values as value}
                                <li>
                                    <button on:click={() => paramValues[paramName] = value}>{value}</button>
                                </li>
                            {/each}
                        </ul>
                    {/if}
                </div>
            </div>
        {/if}
    {/each}

    {#if kind === 65002}
        <JobRequestEditorParameters65002 params={params} />
    {/if}
</div>

<details class="collapse collapse-arrow border border-base-300 bg-base-200 join-item">
    <summary class="collapse-title">
        <div class="flex flex-row gap-2 items-end">
            <h3>
                Parameters
                {#if Object.keys(dvmParams).length > 0}
                    <span class="badge badge-neutral">{Object.keys(dvmParams).length}</span>
                {/if}
            </h3>
            <span class="font-thin text-base opacity-50">
                Specify additional parameters
            </span>
        </div>
    </summary>

    <div class="collapse-content">
        <div class="flex flex-col gap-2">
            {#each Object.keys(dvmParams) as paramName}
                {#if !dvmParams[paramName].required}
                    <div class="flex flex-row gap-2">
                        <p>{paramName}</p>
                        <div class="dropdown">
                            <input
                                tabindex="0"
                                class="input input-bordered input-sm"
                                bind:value={paramValues[paramName]}
                                on:focus={() => showParamMenu[paramName] = true}
                                on:blur={() => setTimeout(() => {showParamMenu[paramName] = false}, 20)}
                            />
                            {#if dvmParams[paramName].values && dvmParams[paramName].values.length > 0 && showParamMenu[paramName]}
                                <ul class="dropdown-content menu z-[1] p-2 shadow bg-base-100 rounded-box" transition:fade={{duration:100}}>
                                    {#each dvmParams[paramName].values as value}
                                        <li>
                                            <button on:click={() => paramValues[paramName] = value}>{value}</button>
                                        </li>
                                    {/each}
                                </ul>
                            {/if}
                        </div>
                    </div>
                {/if}
            {/each}
        </div>
    </div>
</details>


