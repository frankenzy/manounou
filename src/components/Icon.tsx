import React from "react";


interface ComponentProps {
    className?: string;
    name: string
}

export default function Icon({ name, className }: ComponentProps) {
    return (
        <i className={`fa fa-${name}` + ` ${className}`}></i>
    )
}