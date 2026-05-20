"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
    const rafIdRef = useRef<number>(0);
    const lenisRef = useRef<Lenis | null>(null);
    const pathname = usePathname();

    useEffect(() => {
        // Prevent the browser from restoring scroll position on navigation —
        // Lenis owns scroll, and restoration fires after effects, undoing scroll-to-top.
        window.history.scrollRestoration = "manual";

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

        // Intercept pushState to catch same-pathname hash changes that usePathname misses
        // (e.g. /#say-hi → / has the same pathname so the effect below never fires).
        const originalPushState = window.history.pushState.bind(window.history);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window.history as any).pushState = function (state: unknown, title: string, url?: string | URL | null) {
            originalPushState(state, title, url);
            if (!window.location.hash) {
                lenisRef.current?.scrollTo(0, { immediate: true });
            }
        };

        const handlePopState = () => {
            if (!window.location.hash) {
                lenisRef.current?.scrollTo(0, { immediate: true });
            }
        };
        window.addEventListener("popstate", handlePopState);

        return () => {
            cancelAnimationFrame(rafIdRef.current);
            lenis.destroy();
            lenisRef.current = null;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (window.history as any).pushState = originalPushState;
            window.removeEventListener("popstate", handlePopState);
            window.history.scrollRestoration = "auto";
        };
    }, []);

    // Scroll to top on any pathname change (cross-page navigation)
    useEffect(() => {
        lenisRef.current?.scrollTo(0, { immediate: true });
    }, [pathname]);

    return <>{children}</>;
}
