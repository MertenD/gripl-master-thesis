"use client"

import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button"
import {Label} from "@/components/ui/label"
import {useColors} from "@/components/evaluation/charts/common/color-context";

interface ColorConfigDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    modelLabels: string[]
}

const PRESET_COLORS = [
    "#3b82f6",
    "#ef4444",
    "#fb923c",
    "#22c55e",
    "#a855f7",
    "#eab308",
    "#14b8a6",
    "#ec4899",
    "#8b5cf6",
    "#f97316",
]

export default function ColorConfigDialog({ open, onOpenChange, modelLabels }: ColorConfigDialogProps) {
    const { colors, setColor, resetColors } = useColors()

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Color Configuration</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    {modelLabels.map((label) => (
                        <div key={label} className="flex items-center gap-4">
                            <Label className="flex-1 text-sm">{label}</Label>
                            <div className="flex gap-2">
                                {PRESET_COLORS.map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => setColor(label, color)}
                                        className={`h-8 w-8 rounded border-2 transition-all hover:scale-110 ${
                                            colors[label] === color ? "border-black ring-2 ring-black ring-offset-2" : "border-gray-300"
                                        }`}
                                        style={{ backgroundColor: color }}
                                        title={color}
                                    />
                                ))}
                                <input
                                    type="color"
                                    value={colors[label] || "#fb923c"}
                                    onChange={(e) => setColor(label, e.target.value)}
                                    className="h-8 w-8 rounded border-2 border-gray-300 cursor-pointer"
                                    title="Benutzerdefinierte Farbe"
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={resetColors}>
                        Reset
                    </Button>
                    <Button onClick={() => onOpenChange(false)}>Done</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
