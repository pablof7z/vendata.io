<script lang="ts">
	import Logo from "$icons/Logo.svelte";

    import ndk from "$stores/ndk";
    import {currentUser} from '$stores/current-user';
    import { Avatar, Name } from "@nostr-dev-kit/ndk-svelte-components";
	import { page } from "$app/stores";
</script>

<div class="navbar bg-base-100 mb-8 px-8">
    <div class="navbar-start">
        <div class="dropdown">
        <label tabindex="0" class="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
        </label>
        <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
        <li><a>Item 1</a></li>
        <li>
            <a>Parent</a>
            <ul class="p-2">
            <li><a>Submenu 1</a></li>
            <li><a>Submenu 2</a></li>
            </ul>
        </li>
        <li><a>Item 3</a></li>
        </ul>
    </div>
    <a href="/" class="btn btn-ghost normal-case text-xl">
        <Logo class="w-12 h-12"/>
        <h1 class="text-xl font-bold">
            VENDATA
        </h1>
    </a>
    </div>

    <div class="navbar-center hidden lg:flex">
        <ul class="menu menu-horizontal">
            <li><a
                class:tab-active={$page.url.pathname === "/"}
                class="" href="/">Job Request Feed</a></li>
            <li><a
                class:tab-active={$page.url.pathname === "/dvms"}
                class="" href="/dvms">List DVMs</a></li>
            <li><a
                class:tab-active={$page.url.pathname === "/jobs/my"}
                class="" href="/jobs/my">Your Jobs</a></li>
            <li><a
                class:tab-active={$page.url.pathname === "/jobs/new"}
                class="" href="/jobs/new">Create Job Chain</a></li>
        </ul>
    </div>
    <div class="navbar-end">
        {#if $currentUser}
            <Avatar ndk={$ndk} user={$currentUser} class="w-12 h-12 rounded-lg" />
        {:else}
        {/if}
    </div>
</div>