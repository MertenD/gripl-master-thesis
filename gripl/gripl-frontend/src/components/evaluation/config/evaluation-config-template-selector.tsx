"use client";

import { useState } from "react";
import { load as yamlLoad } from "js-yaml";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BookTemplate, ChevronDown, Loader2 } from "lucide-react";

const TEMPLATES = [
    { label: "All Models (Combined)", file: "combined-models-config.yaml" },
    { label: "OpenAI Models", file: "openai-models-config.yaml" },
    { label: "Mistral Models", file: "mistral-models-config.yaml" },
    { label: "DeepSeek Models", file: "deepseek-models-config.yaml" },
    { label: "Gemma Models", file: "gemma-models-config.yaml" },
    { label: "Qwen Models", file: "Qwen-models-config.yaml" },
    { label: "Temperature Experiment", file: "temperature-experiment-config.yaml" },
] as const;

interface TemplateSelectorProps {
    onApply: (cfg: unknown) => void;
}

export default function EvaluationConfigTemplateSelector({ onApply }: TemplateSelectorProps) {
    const [loading, setLoading] = useState(false);

    async function loadTemplate(file: string) {
        setLoading(true);
        try {
            const res = await fetch(`/templates/${file}`);
            const text = await res.text();
            onApply(yamlLoad(text));
        } catch (err) {
            console.error("Failed to load template:", err);
            alert("Failed to load template.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 border-border text-card-foreground hover:bg-muted bg-transparent"
                    disabled={loading}
                >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <BookTemplate className="h-4 w-4" />}
                    Load Template
                    <ChevronDown className="h-3 w-3 opacity-60" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
                    Experiment configs from the thesis
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {TEMPLATES.map(({ label, file }) => (
                    <DropdownMenuItem key={file} onSelect={() => loadTemplate(file)}>
                        {label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
