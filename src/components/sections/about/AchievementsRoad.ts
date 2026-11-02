export type Point = { x: number; y: number };

/**
 * Smooth S-curve road through the node centres, in real pixel coordinates.
 * Because the points are measured from the DOM, the road always meets the nodes,
 * in LTR and RTL, on mobile and desktop, whatever the card heights are.
 */
export function buildRoadPath(points: Point[], lead = 56): string {
  if (points.length === 0) return "";

  const first = points[0];
  let d = `M ${first.x} ${first.y - lead} L ${first.x} ${first.y}`;

  for (let i = 1; i < points.length; i += 1) {
    const a = points[i - 1];
    const b = points[i];
    const handle = (b.y - a.y) * 0.5;
    d += ` C ${a.x} ${a.y + handle}, ${b.x} ${b.y - handle}, ${b.x} ${b.y}`;
  }

  const last = points[points.length - 1];
  return `${d} L ${last.x} ${last.y + lead}`;
}

/** Path length at which the road reaches a given y (the road only ever goes down, so a binary search works). */
export function lengthAtY(
  path: SVGPathElement,
  targetY: number,
  total: number,
): number {
  let low = 0;
  let high = total;
  for (let i = 0; i < 20; i += 1) {
    const mid = (low + high) / 2;
    if (path.getPointAtLength(mid).y < targetY) low = mid;
    else high = mid;
  }
  return (low + high) / 2;
}
