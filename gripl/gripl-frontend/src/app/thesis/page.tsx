import {Button} from "@/components/ui/button";
import Link from "next/link";

export default function ThesisPage() {
    return <div className="h-full flex flex-col items-center pt-4 space-y-4">
        <div className="w-full flex flex-row justify-between">
            <Button variant="secondary"><Link href="/">&lt; Zurück</Link></Button>
            <h1 className="text-3xl font-bold">Masterarbeit</h1>
            <div></div>
        </div>
        <iframe
            src="/api/thesis/pdf"
            className="w-full flex-1"
            style={{ border: "none" }}
            title="Thesis PDF"
        >
            Dein Browser unterstützt keine eingebetteten PDFs. Bitte lade die PDF-Datei direkt herunter.
        </iframe>
    </div>
}