export function rangeStep(n: number, m: number, k = 1): number[] {
    if (k === 0) throw new Error("k darf nicht 0 sein");

    const step = (n <= m ? Math.abs(k) : -Math.abs(k));
    const out: number[] = [];

    if (step > 0) {
        for (let x = n; x <= m; x += step) out.push(x);
    } else {
        for (let x = n; x >= m; x += step) out.push(x);
    }
    return out;
}