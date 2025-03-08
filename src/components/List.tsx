import React from "react";

interface ListProps {
  children: React.ReactNode;
}

export default function List({ children }: ListProps) {
  return (
    <ul className="list-disc list-inside">
      <li className="mb-2">{children}</li>
    </ul>
  );
}
