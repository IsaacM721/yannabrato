"use client";

import Link from "next/link";
import { useCursor } from "@/context/CursorContext";

export default function Header() {
    const { setCursor } = useCursor();

    const handleMouseEnter = () => setCursor("link");
    const handleMouseLeave = () => setCursor("default");

    return (
        <header className="fixed top-0 left-0 w-full z-50 px-4 md:px-10 py-6 flex justify-between items-start mix-blend-difference text-[#637381]">
            {/* Left: Branding */}
            <Link
                href="/"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="text-4xl font-reenie tracking-wider hover:text-accent transition-colors"
            >
                Yanna Beato
            </Link>

            {/* Right: Contact Link */}
            <Link
                href="/#contacto"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="font-reenie text-3xl md:text-4xl z-50 relative tracking-widest hover:text-accent transition-colors pt-1"
            >
                CONTACTO
            </Link>
        </header>
    );
}
