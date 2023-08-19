<script lang="ts">
	import { allJobRequests, initJobRequests, userJobRequests } from '$stores/jobRequests';
	import ndk from '$stores/ndk';
	import { onMount } from 'svelte';
	import '../app.postcss';
	import { NDKNip07Signer } from '@nostr-dev-kit/ndk';
	import { currentUser } from '$stores/current-user';
	import { page } from '$app/stores';
	import Navbar from '$components/Navbar.svelte';
	import Logo from '$icons/Logo.svelte';

	onMount(async () => {
        try {
            $ndk.connect();

			if (localStorage.getItem('nostr-login') === 'nip07') {
				await login();
			}
        } catch (e) {
            console.error(`layout error`, e);
        }
    });

	async function login() {
		$ndk.signer = new NDKNip07Signer();
		$currentUser = await $ndk.signer?.blockUntilReady();
		$currentUser.ndk = $ndk;

		if ($currentUser) {
			localStorage.setItem('nostr-login', 'nip07');
		}
	}

	$: if ($currentUser && !$userJobRequests) {
		initJobRequests();
	}
</script>

<Navbar />

<div class="mx-auto">
    {#if $currentUser}
        <slot />
    {:else}
        <button class="btn btn-primary" on:click={login}>Login</button>
    {/if}
</div>
