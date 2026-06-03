"use client";
import { useState } from "react";

const STORAGE_KEY = "gripl-api-keys";

export const API_KEY_NAMES = ["OPENAI_API_KEY", "OPEN_ROUTER_API_KEY"] as const;
export type ApiKeyName = typeof API_KEY_NAMES[number];
export type ApiKeys = Record<ApiKeyName, string>;

const DEFAULT: ApiKeys = { OPENAI_API_KEY: "", OPEN_ROUTER_API_KEY: "" };

function load(): ApiKeys {
    try {
        const raw = typeof window !== "undefined" ? sessionStorage.getItem(STORAGE_KEY) : null;
        return raw ? { ...DEFAULT, ...JSON.parse(raw) } : DEFAULT;
    } catch {
        return DEFAULT;
    }
}

function resolveValue(value: unknown, keys: Record<string, string>): unknown {
    if (typeof value === "string")
        return value.replace(/\$\{([^}]+)\}/g, (match, name) => keys[name] ?? match);
    if (Array.isArray(value)) return value.map((v) => resolveValue(v, keys));
    if (value !== null && typeof value === "object")
        return Object.fromEntries(Object.entries(value as object).map(([k, v]) => [k, resolveValue(v, keys)]));
    return value;
}

export function useApiKeys() {
    const [keys, setKeys] = useState<ApiKeys>(load);

    const updateKey = (name: ApiKeyName, value: string) => {
        const next = { ...keys, [name]: value };
        setKeys(next);
        if (typeof window !== "undefined") sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    };

    const resolveObject = <T>(obj: T): T => resolveValue(obj, keys) as T;
    const resolveString = (s: string | null | undefined): typeof s =>
        typeof s === "string" ? (resolveValue(s, keys) as string) : s;

    return { keys, updateKey, resolveObject, resolveString };
}
