import type { NDKEvent } from "@nostr-dev-kit/ndk";

export function kindToText(kind: number): string {
    switch (kind) {
        case 65002: return "Text extraction";
        case 65003: return "Summarization";
        case 65004: return "Translation";
        case 65005: return "Image Generation";
        case 65006: return "Nostr Curation";
        case 65100: return "Placeholder functionality";
        default:
            return `Unknown kind ${kind}`;
    }
}

export function kindToDescription(kind: number): string | undefined {
    switch (kind) {
        case 65002: return "Extracts text from an image, audio, video or anything else";
        case 65003: return "Summarizes a text";
        case 65004: return "Translates a text";
        case 65005: return "Generates an image";
        case 65006: return "Generate a curation of nostr events or people";
        case 65100: return "Nothing at all 😅";
    }
}

export const jobRequestKinds = [
    65002, 65003, 65004, 65005, 65006, 65100
];

export function eventUserReference(event: NDKEvent): string {
    return "#" + event.id.slice(0, 4);
}