"use client"

import type React from "react"
import {useRef} from "react"
import {Button} from "@/components/ui/button"
import {Upload} from "lucide-react"

interface FileUploadProps {
  onFileLoaded: (content: string) => void
}

export default function BpmnUploadButton({ onFileLoaded }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // @ts-ignore
      const file = e.target.files[0]
      processFile(file)
    }
  }

  const processFile = (file: File) => {
    if (!file.name.endsWith(".bpmn") && !file.name.endsWith(".xml")) {
      alert("Bitte laden Sie eine .bpmn oder .xml Datei hoch.")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      if (content) {
        onFileLoaded(content)
      } else {
        console.error("Fehler beim Lesen der Datei: Inhalt ist leer")
      }
    }
    reader.onerror = (e) => {
      console.error("Fehler beim Lesen der Datei:", e)
    }
    reader.readAsText(file)
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return <div>
    <input type="file" accept=".bpmn,.xml" className="hidden" onChange={handleFileChange} ref={fileInputRef}/>
    <Button
        variant="outline"
        size="sm"
        onClick={handleButtonClick}
        title="Exportieren"
    >
      <Upload className="h-4 w-4 mr-1"/>
      Importieren
    </Button>
  </div>
}

