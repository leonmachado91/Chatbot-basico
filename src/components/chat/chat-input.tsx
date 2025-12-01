import { useRef, useState, KeyboardEvent } from "react";
import { SendHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
    onSend: (message: string) => void;
    isLoading: boolean;
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
    const [input, setInput] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSend = () => {
        if (input.trim() && !isLoading) {
            onSend(input.trim());
            setInput("");
            if (textareaRef.current) {
                textareaRef.current.style.height = "auto";
            }
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
        // Auto-resize
        e.target.style.height = "auto";
        e.target.style.height = `${e.target.scrollHeight}px`;
    };

    return (
        <div className="p-4 border-t bg-background">
            <div className="relative flex items-end gap-2 max-w-3xl mx-auto p-2 border rounded-xl shadow-sm focus-within:ring-1 focus-within:ring-zinc-400 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={handleInput}
                    onKeyDown={handleKeyDown}
                    placeholder="Pergunte algo ao Grok..."
                    className="flex-1 min-h-[24px] max-h-[200px] w-full resize-none bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-zinc-500 disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
                    rows={1}
                    disabled={isLoading}
                />
                <button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className={cn(
                        "inline-flex items-center justify-center rounded-lg p-2 transition-colors",
                        input.trim() && !isLoading
                            ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90"
                            : "text-zinc-400 dark:text-zinc-600 cursor-not-allowed"
                    )}
                >
                    <SendHorizontal size={18} />
                </button>
            </div>
            <div className="mt-2 text-center text-xs text-zinc-500">
                Grok pode cometer erros. Verifique informações importantes.
            </div>
        </div>
    );
}
