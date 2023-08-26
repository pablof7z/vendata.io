<button on:click class="attention-btn btn w-full h-11 bg-base-100 rounded-full btn-rounded-full border-2 border-accent2 text-base-100-content font-medium normal-case hover:bg-accent2 hover:bg-opacity-20 hover:border-accent2 {$$props.class}">
    <slot />
</button>

<style>
    .attention-btn {
        box-shadow: 0px 0px 21px 2px rgba(142, 113, 255, 0.33)
    }
</style>