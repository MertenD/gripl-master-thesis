import { EvaluationReportSummary } from "@/models/dto/ReportData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar
} from 'recharts';
import { getEvaluationColors } from '@/lib/chart-colors';
import { useState } from 'react';

interface MetricsChartsProps {
    reportSummary: EvaluationReportSummary;
}

export default function MetricsCharts({ reportSummary }: MetricsChartsProps) {
    const [colors, setColors] = useState(getEvaluationColors());

    // Data for pie chart (test results)
    const testResultsData = [
        { name: 'Passed', value: reportSummary.passed, color: colors.passed },
        { name: 'Failed', value: reportSummary.failed, color: colors.failed },
        { name: 'Error', value: reportSummary.error, color: colors.error }
    ].filter(item => item.value > 0);

    // Data for confusion matrix visualization
    const confusionMatrixData = [
        { name: 'True Positives', value: reportSummary.totalTruePositives, color: colors.truePositive },
        { name: 'False Positives', value: reportSummary.totalFalsePositives, color: colors.falsePositive },
        { name: 'False Negatives', value: reportSummary.totalFalseNegatives, color: colors.falseNegative },
        { name: 'True Negatives', value: reportSummary.totalTrueNegatives, color: colors.trueNegative }
    ];

    // Data for metrics radar chart
    const metricsRadarData = [
        {
            metric: 'Accuracy',
            value: reportSummary.accuracy * 100,
            fullMark: 100
        },
        {
            metric: 'Precision',
            value: reportSummary.precision * 100,
            fullMark: 100
        },
        {
            metric: 'Recall',
            value: reportSummary.recall * 100,
            fullMark: 100
        },
        {
            metric: 'F1-Score',
            value: reportSummary.f1Score * 100,
            fullMark: 100
        }
    ];

    // Data for metrics bar chart
    const metricsBarData = [
        { name: 'Accuracy', value: reportSummary.accuracy, percentage: reportSummary.accuracy * 100, color: colors.accuracy },
        { name: 'Precision', value: reportSummary.precision, percentage: reportSummary.precision * 100, color: colors.precision },
        { name: 'Recall', value: reportSummary.recall, percentage: reportSummary.recall * 100, color: colors.recall },
        { name: 'F1-Score', value: reportSummary.f1Score, percentage: reportSummary.f1Score * 100, color: colors.f1Score }
    ];

    const UniversalTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0];
            const color = data.payload?.color || data.color || data.fill || colors.accuracy;

            let value = data.value;
            let displayText = '';

            const isRadarChart = data.payload?.fullMark !== undefined;
            const isPieChart = data.name && !label;
            const isMetricsBarChart = label && typeof value === 'number' && value <= 1 && value > 0;
            const isConfusionMatrix = label && typeof value === 'number' && value > 1;

            if (isPieChart) {
                const percentage = ((value / reportSummary.total) * 100).toFixed(1);
                displayText = `Count: ${value} (${percentage}%)`;
            } else if (isRadarChart) {
                displayText = `${value.toFixed(1)}%`;
            } else if (isMetricsBarChart) {
                displayText = `${(value * 100).toFixed(1)}%`;
            } else if (isConfusionMatrix) {
                const percentage = ((value / reportSummary.total) * 10).toFixed(1);
                displayText = `${percentage}%`;
            } else {
                displayText = `Value: ${value}`;
            }

            return (
                <div className="bg-popover border border-border rounded-md shadow-md p-3">
                    <p className="font-medium text-popover-foreground">{label || data.name}</p>
                    <p style={{ color }}>
                        {displayText}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Test Results Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={testResultsData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, value, percent }) =>
                                    `${name}: ${value} (${((percent || 0) * 100).toFixed(0)}%)`
                                }
                                outerRadius={80}
                                dataKey="value"
                            >
                                {testResultsData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip content={<UniversalTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Performance Metrics Overview</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <RadarChart data={metricsRadarData}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="metric" />
                            <PolarRadiusAxis
                                angle={90}
                                domain={[0, 100]}
                                tick={{ fontSize: 12 }}
                                tickFormatter={(value) => `${value}%`}
                            />
                            <Radar
                                name="Metrics"
                                dataKey="value"
                                stroke={colors.accuracy}
                                fill={colors.accuracy}
                                fillOpacity={0.3}
                                strokeWidth={2}
                            />
                            <Tooltip content={<UniversalTooltip />} />
                        </RadarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Performance Metrics Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={metricsBarData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis
                                domain={[0, 1]}
                                tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                            />
                            <Tooltip content={<UniversalTooltip />} />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                {metricsBarData.map((entry, index) => {
                                    let color: string;
                                    switch (entry.name) {
                                        case 'Accuracy':
                                            color = colors.accuracy;
                                            break;
                                        case 'Precision':
                                            color = colors.precision;
                                            break;
                                        case 'Recall':
                                            color = colors.recall;
                                            break;
                                        case 'F1-Score':
                                            color = colors.f1Score;
                                            break;
                                        default:
                                            color = colors.accuracy;
                                    }
                                    return <Cell key={`cell-${index}`} fill={color} />;
                                })}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Confusion Matrix Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={confusionMatrixData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="name"
                                tick={{ fontSize: 12 }}
                                interval={0}
                                angle={-45}
                                textAnchor="end"
                                height={80}
                            />
                            <YAxis />
                            <Tooltip content={<UniversalTooltip />} />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                {confusionMatrixData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
