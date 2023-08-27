<script lang="ts">
    export let from: HTMLElement;

    let bottomOfFrom: number = 0;
    let container: HTMLElement | undefined = undefined;

    let topOfContainer: number = 0;

    $: if (from) {
		bottomOfFrom = from.getBoundingClientRect().bottom;
	}

	$: if (container) {
		topOfContainer = container.getBoundingClientRect().top;
	}

    // when the window is resized, recalculate the positions
    window.addEventListener('resize', () => {
        if (from) {
            bottomOfFrom = from.getBoundingClientRect().bottom;
        }

        if (container) {
            topOfContainer = container.getBoundingClientRect().top;
        }
    });

	setInterval(() => {
		if (from) {
			bottomOfFrom = from.getBoundingClientRect().bottom;
		}

		if (container) {
			topOfContainer = container.getBoundingClientRect().top;
		}
	}, 2000);
</script>

<div
    class={$$props.class}
    bind:this={container}
>
    <div class="
        absolute h-10 w-10 border-l-[6px] border-l-base-200 border-b-[6px] border-b-base-200 -ml-[15px]
        rounded-b-2xl
    " style="
        height: {topOfContainer - bottomOfFrom + 20}px;
        margin-top: -{topOfContainer - bottomOfFrom}px;
    "></div>

    <slot />
</div>