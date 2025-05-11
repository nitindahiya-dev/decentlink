// src/components/ui/card.tsx
"use client";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`bg-white shadow-lg rounded-2xl p-4 ${className}`}> {children} </div>
  );
}

export function CardHeader({ children }: CardProps) {
  return <div className="mb-2 font-bold text-lg">{children}</div>;
}

export function CardTitle({ children }: CardProps) {
  return <h3 className="text-xl font-semibold">{children}</h3>;
}

export function CardContent({ children }: CardProps) {
  return <div className="text-base text-gray-700">{children}</div>;
}
