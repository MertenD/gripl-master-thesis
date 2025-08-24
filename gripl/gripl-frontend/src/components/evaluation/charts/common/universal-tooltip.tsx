import React from "react";

export default function UniversalTooltip({ active, payload, label }: any) {
    if (!active || !payload || !payload.length) return null;
    const d = payload[0];
    const val = d?.value;
    const isFraction = typeof val === "number" && val <= 1 && val >= 0;
    const text = isFraction ? `${(val * 100).toFixed(1)}%` : `${val}`;

    return (
        <div className="bg-popover border border-border rounded-md shadow-md p-3">
            <p className="font-medium text-popover-foreground">{label}</p>
            <p>{text}</p>
        </div>
    );
}