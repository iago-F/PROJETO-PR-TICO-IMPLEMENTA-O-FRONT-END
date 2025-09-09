import { useEffect } from "react";
import { createPortal } from "react-dom";

type Props = {
    open: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    maxWidthClass?: string;
};

export default function Modal({
    open,
    onClose,
    title,
    children,
    maxWidthClass = "max-w-2xl",
}: Props) {
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = prev;
        };
    }, [open, onClose]);

    if (!open) return null;

    return createPortal(
        <div
            aria-modal="true"
            role="dialog"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onMouseDown={onClose}
        >
            { }
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

            { }
            <div
                className={`relative w-full ${maxWidthClass} bg-white rounded-2xl shadow-xl border animate-in fade-in zoom-in-95`}
                onMouseDown={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-4 py-3 border-b">
                    <h3 className="font-semibold text-lg">{title}</h3>
                    <button
                        aria-label="Fechar"
                        className="rounded-full p-2 hover:bg-gray-100"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </div>

                <div className="p-4">{children}</div>
            </div>
        </div>,
        document.body
    );
}
