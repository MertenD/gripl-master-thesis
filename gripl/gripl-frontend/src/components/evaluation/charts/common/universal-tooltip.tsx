import React from "react";

function formatPercentageValue(value: unknown) {
    if (typeof value === "number" && value >= 0 && value <= 1) return `${(value * 100).toFixed(1)}%`;
    if (typeof value === "number" && (value < 0 || value > 1)) return `${value.toFixed(1)}%`;
    return `${value}`;
}

export default function UniversalTooltip({ isPercentage, active, payload, label }: any) {
    if (!active || !payload || payload.length === 0) return null;

    return (
        <div className="bg-popover border border-border rounded-md shadow-md p-3 min-w-40 z-9999">
            <p className="font-medium text-popover-foreground mb-1">{label}</p>
            <div className="space-y-1">
                {payload.filter((p: any) => p && p.value != null).map((p: any) => (
                    <div key={String(p.dataKey)} className="flex items-center gap-2">
                        <span className="inline-block w-3 h-3 rounded-sm"
                              style={{ backgroundColor: p.color }}
                              aria-hidden
                        />
                        <span className="text-sm text-muted-foreground">
                            {p.name ?? String(p.dataKey)}
                        </span>
                        <span className="ml-auto font-medium">{isPercentage ? formatPercentageValue(p.value) : p.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}