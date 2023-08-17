export function kindToText(kind: number): string {
    switch (kind) {
        case 65002: return "Text extraction";
        case 65003: return "Summarization";
        default:
            return `Unknown kind ${kind}`;
    }
}