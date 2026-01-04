import React from "react";
import Link from "next/link";

interface RegisterLinkProps {
  href?: string;
  className?: string;
}
export default function RegisterLink({ href = "/register",className }: RegisterLinkProps) {
  return (
    <>
      <Link href={href} className={className}>Register</Link>
    </>
  );
}
