import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from "recharts";
import { modelPalette } from "../common/palettes";
import React from "react";
import { EvaluationReportSummary } from "@/models/dto/ReportData";

export default function ConfusionGroupedBars({
    items,
}: {
    items: Array<{ label: string; summary: EvaluationReportSummary }>;
}) {
    const data = [
        Object.fromEntries([["name","True Positives"], ...items.map(({label,summary})=>[label, summary.totalTruePositives])]),
        Object.fromEntries([["name","False Positives"], ...items.map(({label,summary})=>[label, summary.totalFalsePositives])]),
        Object.fromEntries([["name","False Negatives"], ...items.map(({label,summary})=>[label, summary.totalFalseNegatives])]),
        Object.fromEntries([["name","True Negatives"], ...items.map(({label,summary})=>[label, summary.totalTrueNegatives])]),
    ] as Array<Record<string, number | string>>;

    return (
        <Card>
            <CardHeader><CardTitle>Confusion Matrix — per Model</CardTitle></CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={340}>
                    <BarChart data={data} margin={{ top:20, right:30, left:20, bottom:40 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{ fontSize:12 }} interval={0} angle={-15} textAnchor="end" height={40} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {items.map(({ label }, idx) => (
                            <Bar key={label} dataKey={label} name={label} radius={[4,4,0,0]} fill={modelPalette[idx % modelPalette.length]} />
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
