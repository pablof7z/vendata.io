import type { NDKEvent } from "@nostr-dev-kit/ndk";

export function kindToText(kind: number): string {
    switch (kind) {
        case 65002: return "Text extraction";
        case 65003: return "Summarization";
        case 65004: return "Translation";
        case 65005: return "Image Generation";
        default:
            return `Unknown kind ${kind}`;
    }
}

export const jobRequestKinds = [
    65002, 65003, 65004, 65005
];

export function eventUserReference(event: NDKEvent): string {
    return "#" + event.id.slice(0, 4);
}