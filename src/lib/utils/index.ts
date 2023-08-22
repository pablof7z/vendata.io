import type { NDKEvent } from "@nostr-dev-kit/ndk";

const kinds: Record<number, string> = {
    65002: "Text extraction",
    65003: "Summarization",
    65004: "Translation",
    65005: "Image Generation",
    65006: "Nostr Discovery",
    65007: "Nostr Filtering",
    65100: "Placeholder functionality",
};

export function kindToText(kind: number): string {
    if (kind in kinds) {
        return kinds[kind];
    }

    return `Unknown kind ${kind}`;
}

export function kindToDescription(kind: number): string | undefined {
    switch (kind) {
        case 65002: return "Extracts text from an image, audio, video or anything else";
        case 65003: return "Summarizes a text";
        case 65004: return "Translates a text";
        case 65005: return "Generates an image";
        case 65006: return "Discover people or content in nostr";
        case 65007: return "Filter in or out people or content in nostr";
        case 65100: return "Nothing at all 😅";
    }
}

export const jobRequestKinds = Object.keys(kinds).map((k) => parseInt(k));

export function eventUserReference(event: NDKEvent): string {
    return "#" + event.id.slice(0, 4);
}