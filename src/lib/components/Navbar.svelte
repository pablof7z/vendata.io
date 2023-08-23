<script lang="ts">
	import Logo from "$icons/Logo.svelte";

    import {currentUser} from '$stores/current-user';
	import { page } from "$app/stores";
    import CurrentUser from "./CurrentUser.svelte";
	import { GitPullRequest, MagicWand, Rss, Sparkle } from "phosphor-svelte";
    import { notificationsEnabled } from '$stores/notifications';
	import { userTaggedEvents } from "$stores/jobRequests";
    import NotificationButton from "./NotificationButton.svelte";
</script>

<div class="navbar bg-base-100 mb-2 px-8">
    <div class="navbar-start">
        <div class="dropdown">
        <label tabindex="0" class="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
        </label>
        <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li><a
                class:tab-active={$page.url.pathname === "/jobs"}
                class="" href="/jobs">Job Request Feed</a></li>
            <li><a
                class:tab-active={$page.url.pathname === "/dvms"}
                class="" href="/dvms">List DVMs</a></li>
            {#if $currentUser}
                <li><a
                    class:tab-active={$page.url.pathname === "/jobs/my"}
                    class="" href="/jobs/my">Your Jobs</a></li>
            {/if}
            <li><a
                class:tab-active={$page.url.pathname === "/jobs/new"}
                class="" href="/jobs/new">Create Job Chain</a></li>
        </ul>
    </div>
    <a href="/" class="btn btn-ghost normal-case text-xl">
        <Logo class="w-12 h-12"/>
        <h1 class="text-xl font-bold">
            VENDATA
        </h1>
    </a>
</div>

    <div class="navbar-center hidden lg:flex flex-row gap-8">
        <ul class="menu menu-horizontal !bg-transparent">
            <li><a
                class:tab-active={$page.url.pathname === "/magic"}
                class="" href="/magic">
                    <MagicWand class="w-6 h-6 mr-2" />
                Magic</a></li>
        </ul>

        <ul class="menu menu-horizontal">
            <li><a
                class:tab-active={$page.url.pathname === "/jobs"}
                class="" href="/jobs">
                    <Rss class="w-6 h-6 mr-2" />
                Job Request Feed</a></li>
            <li><a
                class:tab-active={$page.url.pathname === "/dvms"}
                class="" href="/dvms">
                    <Sparkle class="w-6 h-6 mr-2" />
                    Data Vending Machines
                </a></li>
            {#if $currentUser}
                <li><a
                    class:tab-active={$page.url.pathname === "/jobs/my"}
                    class="" href="/jobs/my">
                    <GitPullRequest class="w-6 h-6 mr-2" />
                    Your Jobs
                </a></li>
            {/if}
        </ul>

        <a href="/jobs/new" class="btn btn-accent !rounded-full btn-outline ml-12 !py-1">
            SUBMIT NEW JOB
        </a>

    </div>
    <div class="navbar-end flex flex-row items-center gap-4">
        {#if $notificationsEnabled}
            <NotificationButton />
        {/if}

        <CurrentUser />
    </div>
</div>