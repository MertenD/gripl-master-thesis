export default function ThesisPage() {
    return <div className="h-full flex flex-col items-center pt-4 space-y-4">
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