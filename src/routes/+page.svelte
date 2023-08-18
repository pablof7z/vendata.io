<script lang="ts">
	import Logo from '$icons/Logo.svelte';
	import { allJobRequests } from '$stores/jobRequests';
</script>

<div class="bg-gray-900">
    <div class="relative isolate overflow-hidden pt-14">
      <img src="https://cdn.midjourney.com/bd588aed-e734-4043-99b3-352ee973de24/0_3.png" alt="" class="absolute inset-0 -z-10 h-full w-full object-cover opacity-20">
      <div class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div class="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"></div>
      </div>
      <div class="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
        <div class="text-center flex flex-col items-center gap-4">
            <Logo />
          <h1 class="text-4xl font-black tracking-tight text-white sm:text-7xl">VENDATA</h1>
          <p class="text-xl leading-8 text-gray-300">Explore and interact with unstoppable Data Vending Machines over Nostr</p>
          <div class="mt-10 flex items-center justify-center gap-x-6">
            <a href="#" class="btn btn-primary btn-wide btn-lg !rounded-full">Get Started</a>
          </div>
        </div>
      </div>
    </div>
</div>

<style>
    h1 span.bg {
        background: radial-gradient(17397.30% 100% at 9.07% -0%, #FFF 0%, #817EFF 100%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
</style>