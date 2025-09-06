"use client";

import { Button } from "@/components/ui/button";
import { Upload, Download } from "lucide-react";
import {ChangeEvent, RefObject} from "react";

interface EvaluationConfigHeaderProps {
    fileInputRef: RefObject<HTMLInputElement | null>;
    onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onClickImportYaml: () => void;
    onClickExportYaml: () => void;
}

export default function EvaluationConfigHeader({ fileInputRef, onFileChange, onClickImportYaml, onClickExportYaml }: EvaluationConfigHeaderProps) {
    return (
        <div className="flex gap-3 flex-wrap">
            <input ref={fileInputRef} type="file" accept=".yml,.yaml" className="hidden" onChange={onFileChange} />
            <Button variant="outline" size="sm" className="gap-2 border-border text-card-foreground hover:bg-muted bg-transparent" onClick={onClickImportYaml}>
                <Upload className="h-4 w-4" />
                Import YAML Config
            </Button>
            <Button variant="outline" size="sm" className="gap-2 border-border text-card-foreground hover:bg-muted bg-transparent" onClick={onClickExportYaml}>
                <Download className="h-4 w-4" />
                Download YAML Config
            </Button>
        </div>
    );
}