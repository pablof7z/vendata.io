import { NDKDVMRequest } from "@nostr-dev-kit/ndk";
import type { NDKEventStore } from "@nostr-dev-kit/ndk-svelte";
import { get as getStore } from "svelte/store";
import ndk from './ndk';
import { currentUser } from "./current-user";
import { jobRequestKinds } from "$utils";

const $ndk = getStore(ndk);

export let userJobRequests: NDKEventStore<NDKDVMRequest> | undefined;

export const allJobRequests = $ndk.storeSubscribe<NDKDVMRequest>(
    { kinds: jobRequestKinds, limit: 100 },
    { closeOnEose: false, subId: 'all-job-requests' },
    NDKDVMRequest
);

export function initJobRequests() {
    const $currentUser = getStore(currentUser);

    if (!$currentUser) {
        throw new Error("Current user not initialized");
    }

    userJobRequests = $ndk.storeSubscribe(
        { kinds: jobRequestKinds, authors: [$currentUser.hexpubkey()], limit: 100 },
        { closeOnEose: false, subId: 'user-job-requests' },
        NDKDVMRequest
    )
}
