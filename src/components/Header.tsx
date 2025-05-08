"use client";

import Link from "next/link";

export default function Header() {

  return (
    <header className="bg-primary p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-accent">
          <Link href="/">SillyLink</Link>
        </h1>
        <nav className="flex items-center space-x-4">
          <ul className="flex space-x-4">
            <li>
              <Link href="/" className="hover:underline text-secondary">
                Home
              </Link>
            </li>
            <li>
              <Link href="/analytics" className="hover:underline text-secondary">
                Analytics
              </Link>
            </li>
          </ul>
       
            <Link
              href="/login"
              className="hover:underline text-secondary"
            >
              Sign In
            </Link>
        </nav>
      </div>
    </header>
  );
}