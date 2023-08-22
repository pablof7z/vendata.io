<script lang="ts">
	import { kindToText, kindToDescription } from "$utils";

    export let kind: number;

    let bg: string;

    switch (kind) {
        case 65002: bg = "!bg-primary text-primary-content"; break;
        case 65003: bg = "!bg-warning text-warning-content"; break;
        case 65004: bg = "!bg-info text-info-content"; break;
        case 65005: bg = "!bg-accent text-accent-content"; break;
        case 65006: bg = "!bg-accent2 text-accent-content"; break;
        case 65007: bg = "!bg-teal-400 text-black text-opacity-70"; break;
        case 65100: bg = "!bg-neutral text-neutral-content"; break;
    }
</script>

<button class="card !bg-opacity-80 {bg} hover:!bg-opacity-100 transition-all duration-50" on:click>
    <div class="card-body text-center items-start justify-stretch">
        <div class="card-title">{kindToText(kind)}</div>

        <p class="text-left opacity-80">{kindToDescription(kind)}</p>
    </div>
</button>