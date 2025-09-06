import {Card} from "@/components/ui/card";
import {CheckCircle2, ListChecks, Target} from "lucide-react";

interface TestCaseReportCardOverviewProps {
    totalExpected: number;
    totalActual: number;
    correctCount: number;
}

export default function TestCaseReportCardOverview({ totalExpected, totalActual, correctCount }: TestCaseReportCardOverviewProps) {

    return <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4"/>
                <h3 className="font-medium text-sm">Expected</h3>
            </div>
            <p className="text-2xl font-bold">{totalExpected}</p>
            <p className="text-xs text-muted-foreground">Activities</p>
        </Card>

        <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
                <ListChecks className="h-4 w-4"/>
                <h3 className="font-medium text-sm">Detected</h3>
            </div>
            <p className="text-2xl font-bold">{totalActual}</p>
            <p className="text-xs text-muted-foreground">Activities</p>
        </Card>

        <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-4 w-4"/>
                <h3 className="font-medium text-sm">Correct</h3>
            </div>
            <p className="text-2xl font-bold">{correctCount}</p>
            <p className="text-xs text-muted-foreground">Matches</p>
        </Card>
    </div>
}