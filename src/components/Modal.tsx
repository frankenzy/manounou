import React, { useEffect, useState } from "react";

interface CustomProps {
    children: React.ReactNode;
    className?: string;
    isOpen?: boolean;
    onClose?: () => void;
}

const Modal = ({ children, className, isOpen = false, onClose }: CustomProps) => {
    const CLOSE_DURATION_MS = 260;
    const [shouldRender, setShouldRender] = useState(isOpen);
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        let closeTimer: ReturnType<typeof setTimeout> | undefined;

        if (isOpen) {
            setShouldRender(true);
            setIsClosing(false);
        } else if (shouldRender) {
            setIsClosing(true);
            closeTimer = setTimeout(() => {
                setShouldRender(false);
                setIsClosing(false);
            }, CLOSE_DURATION_MS);
        }

        return () => {
            if (closeTimer) {
                clearTimeout(closeTimer);
            }
        };
    }, [isOpen, shouldRender]);

    if (!shouldRender) return null;

    const overlayAnimation = isClosing
        ? "animate-[modalOverlayHide_240ms_ease-in_forwards]"
        : "animate-[modalOverlayReveal_260ms_ease-out_forwards]";
    const contentAnimation = isClosing
        ? "animate-[modalLightHide_260ms_cubic-bezier(0.4,0,1,1)_forwards]"
        : "animate-[modalLightReveal_320ms_cubic-bezier(0.22,1,0.36,1)_forwards]";

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center ${className}`}>
            <div
                className={`fixed inset-0 bg-black bg-opacity-50 ${overlayAnimation}`}
                onClick={onClose}
                aria-label="Close Modal"
            />

            <div className={`relative bg-white rounded-lg shadow-lg max-w-[640] min-h-max w-full mx-4 z-10 ${contentAnimation}`}>
                {children}
            </div>
        </div>
    );
}

export default Modal;
