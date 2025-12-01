import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
    role: "user" | "assistant";
    content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
    const isUser = role === "user";

    return (
        <div
            className={cn(
                "flex w-full items-start gap-4 p-4 animate-in fade-in slide-in-from-bottom-2 duration-300",
                isUser ? "flex-row-reverse" : "flex-row"
            )}
        >
            <div
                className={cn(
                    "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full border shadow-sm",
                    isUser
                        ? "bg-background border-zinc-200 dark:border-zinc-800"
                        : "bg-primary text-primary-foreground border-primary"
                )}
            >
                {isUser ? <User size={16} /> : <Bot size={16} />}
            </div>

            <div
                className={cn(
                    "flex-1 space-y-2 overflow-hidden",
                    isUser ? "text-right" : "text-left"
                )}
            >
                <div
                    className={cn(
                        "inline-block rounded-2xl px-4 py-3 text-sm shadow-sm ring-1 ring-inset",
                        "prose dark:prose-invert max-w-none break-words",
                        isUser
                            ? "bg-zinc-100 text-zinc-900 ring-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:ring-zinc-700 prose-p:text-right"
                            : "bg-white text-zinc-900 ring-zinc-200 dark:bg-zinc-950 dark:text-zinc-100 dark:ring-zinc-800 prose-p:text-left"
                    )}
                >
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            p: ({ children }) => (
                                <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>
                            ),
                            a: ({ href, children }) => (
                                <a
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline"
                                >
                                    {children}
                                </a>
                            ),
                            code: ({ className, children, ...props }) => {
                                const match = /language-(\w+)/.exec(className || "");
                                const isInline = !match && !className;

                                if (isInline) {
                                    return (
                                        <code
                                            className="bg-zinc-200 dark:bg-zinc-800 px-1 py-0.5 rounded font-mono text-xs"
                                            {...props}
                                        >
                                            {children}
                                        </code>
                                    );
                                }

                                return (
                                    <div className="relative my-4 overflow-hidden rounded-lg bg-zinc-950 border border-zinc-800">
                                        <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800">
                                            <span className="text-xs text-zinc-400 font-mono">
                                                {match?.[1] || "code"}
                                            </span>
                                        </div>
                                        <div className="p-4 overflow-x-auto">
                                            <code
                                                className="font-mono text-xs text-zinc-300"
                                                {...props}
                                            >
                                                {children}
                                            </code>
                                        </div>
                                    </div>
                                );
                            },
                            ul: ({ children }) => (
                                <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>
                            ),
                            ol: ({ children }) => (
                                <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>
                            ),
                        }}
                    >
                        {content}
                    </ReactMarkdown>
                </div>
            </div>
        </div>
    );
}
