import {Crumb} from "@/models/Crumb";

/**
 * Generates an array of breadcrumb objects based on the given pathname and name mapping.
 *
 * @param {string} pathname - The URL path to generate breadcrumbs for.
 *                            It is expected to be a string with segments separated by '/'.
 * @param {Record<string, string>} nameMap - A mapping of path segments to their display names.
 *                                           If a segment is not found in the map, it will be transformed
 *                                           into a readable format (e.g., replacing hyphens with spaces and capitalizing words).
 * @returns {Crumb[]} An array of breadcrumb objects, where each object contains:
 *                    - `href` (string): The cumulative path up to the current segment.
 *                    - `label` (string): The display name for the segment.
 */
export function generateBreadcrumbs(pathname: string, nameMap: Record<string, string>): Crumb[] {
    const segments = pathname
        .split('/')
        .filter((seg) => seg.length > 0);

    if (segments.length === 0) {
        return [{
            href: '/',
            label: nameMap['']
        }]
    }

    return segments.map((seg, idx) => {
        const href = '/' + segments.slice(0, idx + 1).join('/');
        const label =
            nameMap[seg] ||
            seg
                .replace(/-/g, ' ')
                .replace(/\b\w/g, (c) => c.toUpperCase());

        return { href, label };
    });
}