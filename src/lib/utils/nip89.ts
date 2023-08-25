import { get as getStore } from "svelte/store";
import { appHandlers } from "$stores/nip89";

export function findNip89Event(dvmPubkey: string, handledKind: number) {
    const $appHandlers = getStore(appHandlers);
    const kindAsString = handledKind.toString();

    console.log(`trying to find nip89 event with ${appHandlers?.length} handlers`);

    return $appHandlers.find((event) => (
        event.pubkey === dvmPubkey &&
        event.getMatchingTags("k").find(kTag => kTag[1] === kindAsString)
    ));
}