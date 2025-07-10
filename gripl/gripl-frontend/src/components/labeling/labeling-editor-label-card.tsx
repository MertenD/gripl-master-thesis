import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Switch} from "@/components/ui/switch";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {useEffect, useState} from "react";
import {ExpectedValues} from "@/models/dto/EvaluationData";

export interface LabelingEditorProps {
    elementName: string;
    elementId: string;
    criticalActivities: ExpectedValues[];
    onLabelingChange: (elementId: string, isChecked: boolean, reason: string) => void;
}

export default function ({ elementName, elementId, criticalActivities, onLabelingChange }: LabelingEditorProps) {

    const [criticalChecked, setCriticalChecked] = useState(
        criticalActivities.some(critical => critical.value === elementId)
    )
    const [reason, setReason] = useState(criticalActivities.find(
        critical => critical.value === elementId)?.reason || ""
    )

    useEffect(() => {
        setCriticalChecked(criticalActivities.some(critical => critical.value === elementId));
        const foundReason = criticalActivities.find(critical => critical.value === elementId)?.reason || "";
        setReason(foundReason);
    }, [elementId]);

    return <Card className="w-[202px]">
        <CardHeader>
            <h2 className="text-lg font-semibold">{elementName}</h2>
        </CardHeader>
        <CardContent>
            <div className="flex items-center space-x-2">
                <Switch
                    id="label-mode"
                    checked={criticalChecked}
                    onCheckedChange={(checked) => {
                        setCriticalChecked(checked)
                        onLabelingChange(elementId, checked, reason)
                    }}
                />
                <Label htmlFor="label-mode">Is GDPR critical</Label>
            </div>
            { criticalChecked && <div className="mt-4 flex flex-col space-y-2">
                <Label htmlFor="reason">Reason for labeling</Label>
                <Textarea
                    id="reason"
                    className="p-2 border rounded"
                    placeholder="Enter reason for labeling this activity..."
                    rows={5}
                    value={reason}
                    onChange={(event) => {
                        setReason(event.target.value);
                        onLabelingChange(elementId, criticalChecked, event.target.value)
                    }}
                />
            </div> }
        </CardContent>
    </Card>
}