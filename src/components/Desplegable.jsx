import { useState, useRef, useEffect } from "react";
import { useTheme } from "../providers/ThemeProvider";

export default function Desplegable({ icon, children, style, hideWithScroll=false }) {

    const { theme } = useTheme();
    const [open, setOpen] = useState(false);
    const [coords, setCoords] = useState({ x: 0, top: true });
    const [ready, setReady] = useState(false);
    const triggerRef = useRef(null);
    const dropdownRef = useRef(null);

    const updatePosition = () => {
        if (!open || !triggerRef.current || !dropdownRef.current) return;
        const t = triggerRef.current.getBoundingClientRect();
        const d = dropdownRef.current.getBoundingClientRect();
        const MARGIN = 8;

        // Ideal position in viewport coordinates
        const idealX = t.left + t.width / 2 - d.width / 2;
        const clampedX = Math.max(MARGIN, Math.min(idealX, window.innerWidth - d.width - MARGIN));

        // Convert viewport coordinates to relative coordinates for position: absolute
        // Since the parent is position: relative and wraps the trigger
        setCoords({
            x: clampedX - t.left,
            top: t.bottom + d.height + MARGIN <= window.innerHeight,
        });
        setReady(true);
    };

    useEffect(() => {
        if (!open) setReady(false);
        updatePosition();
    }, [open]);

    useEffect(() => {
        const handleScrollOrResize = () => {
            if (open && hideWithScroll) setOpen(false);
        };

        if (open && hideWithScroll) {
            window.addEventListener("resize", handleScrollOrResize);
            window.addEventListener("scroll", handleScrollOrResize, true);
        }
        return () => {
            window.removeEventListener("resize", handleScrollOrResize);
            window.removeEventListener("scroll", handleScrollOrResize, true);
        };
    }, [open]);

    useEffect(() => {
        const close = (e) => {
            if (!dropdownRef.current?.contains(e.target) && !triggerRef.current?.contains(e.target))
                setOpen(false);
        };
        if (open) document.addEventListener("mousedown", close);
        return () => document.removeEventListener("mousedown", close);
    }, [open]);

    return (
        <div style={{ position: "relative", display: "inline-block" }}>
            <div
                style={{ cursor: "pointer", height: "100%", display: "flex", alignItems: "center" }}
                ref={triggerRef}
                onClick={() => setOpen((v) => !v)}
            >
                {icon}
            </div>

                <div
                    ref={dropdownRef}
                    style={{
                        borderRadius: 10,
                        position: "absolute",
                        top: coords.top ? "calc(100% + 8px)" : undefined,
                        bottom: !coords.top ? "calc(100% + 8px)" : undefined,
                        left: coords.x,
                        display: open ? "block" : "none",
                        backgroundColor: "rgba(100, 100, 100, 0.2)", backdropFilter: "blur(2px)",
                        zIndex: 9999,
                        width: "max-content",
                        visibility: ready ? "visible" : "hidden",
                        opacity: ready ? 1 : 0,
                        transform: ready
                            ? "translateY(0) scale(1)"
                            : coords.top
                                ? "translateY(-6px) scale(0.97)"
                                : "translateY(6px) scale(0.97)",
                        transition: "opacity 0.15s ease, transform 0.15s ease",
                        transformOrigin: coords.top ? "top center" : "bottom center",
                    ...style}}
                >
                    {children}
                </div>
        </div>
    );
}