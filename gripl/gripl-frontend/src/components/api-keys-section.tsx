"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/input-password";
import { KeyRound } from "lucide-react";
import { ApiKeys } from "@/hooks/use-api-keys";

interface ApiKeysSectionProps {
    keys: ApiKeys;
    updateKey: (value: string) => void;
    className?: string;
}

export default function ApiKeysSection({ keys, updateKey, className }: ApiKeysSectionProps) {
    return (
        <Card className={className}>
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <KeyRound className="h-4 w-4" />
                    API Key
                </CardTitle>
                <CardDescription className="text-xs">
                    Only kept in memory for this session — not persisted anywhere. Use{" "}
                    <code className="bg-muted px-1 rounded text-[11px]">{"${OPEN_ROUTER_API_KEY}"}</code> as a
                    placeholder in model configurations — it is resolved client-side before the request is sent.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-1.5">
                    <Label className="text-xs font-mono">OPEN_ROUTER_API_KEY</Label>
                    <PasswordInput
                        placeholder="sk-or-v1-..."
                        value={keys.OPEN_ROUTER_API_KEY}
                        onChange={(e) => updateKey(e.target.value)}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
