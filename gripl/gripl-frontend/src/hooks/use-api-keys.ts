"use client";
import { useState } from "react";

export type ApiKeys = { OPEN_ROUTER_API_KEY: string };

const DEFAULT: ApiKeys = { OPEN_ROUTER_API_KEY: "" };

function resolveValue(value: unknown, keys: Record<string, string>): unknown {
    if (typeof value === "string")
        return value.replace(/\$\{([^}]+)\}/g, (match, name) => keys[name] ?? match);
    if (Array.isArray(value)) return value.map((v) => resolveValue(v, keys));
    if (value !== null && typeof value === "object")
        return Object.fromEntries(Object.entries(value as object).map(([k, v]) => [k, resolveValue(v, keys)]));
    return value;
}

export function useApiKeys() {
    const [keys, setKeys] = useState<ApiKeys>(DEFAULT);

    const updateKey = (value: string) => setKeys({ OPEN_ROUTER_API_KEY: value });

    const resolveObject = <T>(obj: T): T => resolveValue(obj, keys) as T;
    const resolveString = (s: string | null | undefined): typeof s =>
        typeof s === "string" ? (resolveValue(s, keys) as string) : s;

    return { keys, updateKey, resolveObject, resolveString };
}
