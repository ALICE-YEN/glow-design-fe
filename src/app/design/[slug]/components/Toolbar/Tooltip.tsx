"use client";

import { useState } from "react";

export default function Tooltip({
  children,
  tooltip,
}: {
  children: React.ReactNode;
  tooltip: string;
}) {
  const [isShown, setIsShown] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsShown(true)}
      onMouseLeave={() => setIsShown(false)}
    >
      {children}
      {isShown && (
        <div className="absolute z-50 top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-primary rounded-md shadow-lg whitespace-nowrap">
          {tooltip}
        </div>
      )}
    </div>
  );
}
