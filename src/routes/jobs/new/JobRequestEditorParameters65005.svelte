<script lang="ts">
    import type { NDKDvmParam } from "@nostr-dev-kit/ndk";

    export let params: NDKDvmParam[] = [];

    function update() {
        params = params.filter(param => param[0] !== "negative_prompt");

        if (negativePrompt && negativePrompt.length > 0) {
            params.push([ "negative_prompt", negativePrompt ]);
            params = params;
        }
    }

    let negativePrompt: string | undefined;
</script>

<h3>Negative prompt (optional)</h3>
<textarea class="textarea textarea-bordered w-full" placeholder="" bind:value={negativePrompt} on:change={update} />