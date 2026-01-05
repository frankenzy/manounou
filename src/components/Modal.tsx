import React from "react";

interface CustomProps {
    children: React.ReactNode;
    className?: string;
    isOpen?: boolean;
    onClose?: () => void;
}

const Modal = ({ children, className, isOpen = false, onClose }: CustomProps) => {
    if (!isOpen) return null;

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center ${className}`}>
            {/* Overlay */}
            <div 
                className="fixed inset-0 bg-black bg-opacity-50"
                onClick={onClose}
                aria-label="Close Modal"
            />
            
            {/* Modal Content */}
            <div className="relative bg-white rounded-lg shadow-lg max-w-[640] min-h-max w-full mx-4 z-10">
                {children}
            </div>
        </div>
    );
}

export default Modal;
