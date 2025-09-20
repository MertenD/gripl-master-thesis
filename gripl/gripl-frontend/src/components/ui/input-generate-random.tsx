import * as React from "react"

import { cn } from "@/lib/utils"
import {RefreshCw, Trash2} from "lucide-react";

export interface GenerateRandomInputProps extends Omit<React.ComponentProps<"input">, "type"> {
    className?: string
    length?: number
    alphabet?: string
}

const GenerateRandomInput = React.forwardRef<HTMLInputElement, GenerateRandomInputProps>(
    ({ className, list, ...props }, ref) => {
        function generateRandom() {
            const randomValue = randomSeedString(props.length ?? 8);
            if (props.onChange) {
                const event = {
                    target: {
                        value: randomValue
                    }
                } as React.ChangeEvent<HTMLInputElement>;
                props.onChange(event);
            }
        }

        function randomSeedString(
            length: number,
            alphabet = props.alphabet ? props.alphabet : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
        ): string {
            let out = "";
            for (let i = 0; i < length; i++) {
                out += alphabet[Math.floor(Math.random() * alphabet.length)];
            }
            return out;
        }

        function clearInput() {
            if (props.onChange) {
                const event = {
                    target: {
                        value: ""
                    }
                } as React.ChangeEvent<HTMLInputElement>;
                props.onChange(event);
            }
        }

        return (
            <div className="relative">
                <input
                    type={"text"}
                    className={cn(
                        "flex h-9 w-full rounded-md border border-input bg-transparent pl-3 pr-10 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                        className
                    )}
                    ref={ref}
                    list={list}
                    {...props}
                />

                <button
                    type="button"
                    onClick={generateRandom}
                    className="absolute inset-y-0 right-8 grid place-items-center px-3 text-muted-foreground hover:text-foreground"
                    aria-label="Generate Random"
                    title="Generate Random"
                >
                    <RefreshCw width={12} />
                </button>

                <button
                    type="button"
                    onClick={clearInput}
                    className="absolute inset-y-0 right-0 grid place-items-center px-3 text-muted-foreground hover:text-foreground"
                    aria-label="Clear"
                    title="Clear"
                >
                    <Trash2 width={12} />
                </button>
            </div>
        )
    }
)

GenerateRandomInput.displayName = "GenerateRandomInput"

export { GenerateRandomInput }