"use client";

import React from "react";
import Link from "next/link";

interface DefaultButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  variant?: "dark" | "blue" | "light" | "outline";
  href?: string;
}

export default function DefaultButton({
  onClick,
  children,
  className = "",
  type = "button",
  disabled = false,
  variant = "dark",
  href,
}: DefaultButtonProps) {
  const variantStyles = {
    dark: "bg-[#121824] hover:bg-slate-800 disabled:bg-slate-400 text-white",
    blue: "bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white shadow-sm",
    light: "bg-slate-100 hover:bg-slate-200 disabled:bg-slate-50 text-slate-700 border border-transparent",
    outline: "bg-transparent hover:bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 disabled:opacity-50",
  }[variant];

  // Smart detection of style overrides to avoid class conflicts
  const hasPaddingX = /\bpx-/.test(className) || /\bp-/.test(className);
  const hasPaddingY = /\bpy-/.test(className) || /\bp-/.test(className);
  const hasRounding = /\brounded-/.test(className);
  const hasFontWeight = /\bfont-/.test(className);
  const hasTextSize = /\btext-/.test(className);

  const paddingClass = `${hasPaddingX ? "" : "px-4"} ${hasPaddingY ? "" : "py-3"}`.trim();
  const roundingClass = hasRounding ? "" : "rounded-xl";
  const fontClass = hasFontWeight ? "" : "font-bold";
  const textClass = hasTextSize ? "" : "text-sm";

  const commonClasses = `${fontClass} ${paddingClass} ${roundingClass} ${textClass} transition-colors cursor-pointer disabled:cursor-not-allowed ${variantStyles} ${className}`;

  if (href) {
    return (
      <Link href={href} className={commonClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={commonClasses}
    >
      {children}
    </button>
  );
}
