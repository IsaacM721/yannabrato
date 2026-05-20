"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
    const rafIdRef = useRef<number>(0);
    const lenisRef = useRef<Lenis | null>(null);
    const pathname = usePathname();

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: true,
        });

        lenisRef.current = lenis;

        function raf(time: number) {
            lenis.raf(time);
            rafIdRef.current = requestAnimationFrame(raf);
        }

        rafIdRef.current = requestAnimationFrame(raf);

        return () => {
            cancelAnimationFrame(rafIdRef.current);
            lenis.destroy();
            lenisRef.current = null;
        };
    }, []);

    useEffect(() => {
        lenisRef.current?.scrollTo(0, { immediate: true });
    }, [pathname]);

    return <>{children}</>;
}
