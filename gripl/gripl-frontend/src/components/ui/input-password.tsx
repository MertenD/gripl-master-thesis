import * as React from "react"
import { Eye, EyeOff } from "lucide-react"

import { cn } from "@/lib/utils"

export interface PasswordInputProps
    extends Omit<React.ComponentProps<"input">, "type"> {}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
    ({ className, ...props }, ref) => {
        const [visible, setVisible] = React.useState(false)

        const PLACEHOLDER_RE = /^\s*\$\{[^}]*\}\s*$/;

        function isVisible(value: any) {
            return visible || PLACEHOLDER_RE.test(String(value ?? ""));
        }

        return (
            <div className="relative">
                <input
                    type={isVisible(props.value) ? "text" : "password"}
                    className={cn(
                        "flex h-9 w-full rounded-md border border-input bg-transparent pl-3 pr-10 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                        className
                    )}
                    ref={ref}
                    {...props}
                />

                <button
                    type="button"
                    onClick={() => setVisible((v) => !v)}
                    className="absolute inset-y-0 right-0 grid place-items-center px-3 text-muted-foreground hover:text-foreground"
                    aria-label={visible ? "Passwort verbergen" : "Passwort anzeigen"}
                    title={visible ? "Passwort verbergen" : "Passwort anzeigen"}
                >
                    {isVisible(props.value) ? (
                        <Eye className="h-4 w-4" aria-hidden="true" />
                    ) : (
                        <EyeOff className="h-4 w-4" aria-hidden="true" />
                    )}
                </button>
            </div>
        )
    }
)

PasswordInput.displayName = "PasswordInput"

export { PasswordInput }
