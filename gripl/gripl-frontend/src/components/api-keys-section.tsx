"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/input-password";
import { KeyRound } from "lucide-react";
import { ApiKeyName, ApiKeys } from "@/hooks/use-api-keys";

interface ApiKeysSectionProps {
    keys: ApiKeys;
    updateKey: (name: ApiKeyName, value: string) => void;
    className?: string;
}

export default function ApiKeysSection({ keys, updateKey, className }: ApiKeysSectionProps) {
    return (
        <Card className={className}>
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <KeyRound className="h-4 w-4" />
                    API Keys
                </CardTitle>
                <CardDescription className="text-xs">
                    Saved for this browser session only (sessionStorage — cleared when you close the tab). Use{" "}
                    <code className="bg-muted px-1 rounded text-[11px]">{"${OPENAI_API_KEY}"}</code> or{" "}
                    <code className="bg-muted px-1 rounded text-[11px]">{"${OPEN_ROUTER_API_KEY}"}</code> as
                    placeholders in model configurations — they are resolved client-side before the request is sent.
                    The server has no pre-configured API keys; you must provide one here or in each model row.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label className="text-xs font-mono">OPENAI_API_KEY</Label>
                    <PasswordInput
                        placeholder="sk-..."
                        value={keys.OPENAI_API_KEY}
                        onChange={(e) => updateKey("OPENAI_API_KEY", e.target.value)}
                    />
                </div>
                <div className="space-y-1.5">
                    <Label className="text-xs font-mono">OPEN_ROUTER_API_KEY</Label>
                    <PasswordInput
                        placeholder="sk-or-v1-..."
                        value={keys.OPEN_ROUTER_API_KEY}
                        onChange={(e) => updateKey("OPEN_ROUTER_API_KEY", e.target.value)}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
