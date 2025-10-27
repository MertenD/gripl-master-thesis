"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface ColorContextType {
    colors: Record<string, string>
    setColors: (colors: Record<string, string>) => void
    setColor: (modelName: string, color: string) => void
    resetColors: () => void
    getColor: (modelName: string) => string
}

const ColorContext = createContext<ColorContextType | undefined>(undefined)

export function ColorProvider({ children }: { children: ReactNode }) {
    const [colors, setColors] = useState<Record<string, string>>({})

    const setColor = (modelName: string, color: string) => {
        setColors((prev) => ({ ...prev, [modelName]: color }))
    }

    const resetColors = () => {
        setColors({})
    }

    const getColor = (modelName: string): string => {
        return colors[modelName] || "#3b82f6"
    }

    return <ColorContext.Provider value={{ colors, setColors, setColor, resetColors, getColor }}>{children}</ColorContext.Provider>
}

export function useColors() {
    const context = useContext(ColorContext)
    if (!context) {
        throw new Error("useColors must be used within a ColorProvider")
    }
    return context
}

export function getModelColor(modelName: string, colors: Record<string, string>): string {
    return colors[modelName] || "#3b82f6"
}
