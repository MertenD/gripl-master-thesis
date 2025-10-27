"use client"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical, Download, Palette } from "lucide-react"

interface WithChartId {
    chartId: string
    onColorConfig?: () => void
    onDownload?: () => void
}

interface WithDownload {
    chartId?: undefined
    onColorConfig?: () => void
    onDownload: () => void
}

type ChartMenuProps = WithChartId | WithDownload

export default function ChartMenu({ chartId, onColorConfig, onDownload }: ChartMenuProps) {

    const handleDownload = async () => {
        if (!chartId) return
        try {
            const ApexChartsModule = (await import("apexcharts")).default
            const chart = ApexChartsModule.getChartByID(chartId)
            if (chart) {
                // @ts-ignore
                chart.dataURI().then((data: { imgURI: string }) => {
                    const link = document.createElement("a")
                    link.href = data.imgURI
                    link.download = `${chartId.toLowerCase().replace(/\s+/g, "-")}-chart.png`
                    link.click()
                })
            } else {
                console.error("Chart not found")
            }
        } catch (error) {
            console.error("Error downloading chart:", error)
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={onDownload || handleDownload}>
                    <Download className="mr-2 h-4 w-4" />
                    Download as PNG
                </DropdownMenuItem>
                { onColorConfig && <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onColorConfig}>
                        <Palette className="mr-2 h-4 w-4" />
                        Configure Colors
                    </DropdownMenuItem>
                </>}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
