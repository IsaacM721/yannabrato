"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Download } from "lucide-react";

interface AboutSectionProps {
    isOpen?: boolean;
    onToggle?: () => void;
}

export default function AboutSection({ isOpen: propsIsOpen, onToggle }: AboutSectionProps) {
    const [internalIsOpen, setInternalIsOpen] = useState(false);
    
    const isOpen = propsIsOpen !== undefined ? propsIsOpen : internalIsOpen;
    const toggle = onToggle || (() => setInternalIsOpen(!internalIsOpen));

    return (
        <div className="border-t border-white/10">
            <button
                onClick={toggle}
                className="w-full grid grid-cols-[1fr_auto_1fr] items-center py-8 md:py-12 group transition-colors"
            >
                {/* Left Spacer */}
                <span className="w-full text-left" />
                
                {/* Centered Title */}
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-reenie text-[#637381] group-hover:text-amber-100 transition-colors uppercase text-center">
                    Sobre mí
                </h2>
                
                {/* Right Arrow */}
                <div className="flex justify-end w-full">
                    <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="text-[#637381] group-hover:text-amber-100"
                    >
                        <ChevronDown size={40} className="md:w-16 md:h-16" />
                    </motion.div>
                </div>
            </button>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] }}
                        className="overflow-hidden"
                    >
                        <div className="pb-20 pt-4 space-y-20">
                            {/* Bio Section */}
                            <motion.section
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="grid grid-cols-1 md:grid-cols-12 gap-10 border-b border-white/10 pb-20 max-w-6xl mx-auto"
                            >
                                <div className="md:col-span-3">
                                    <h2 className="font-sans text-[10px] md:text-xs text-[#637381] uppercase tracking-[0.2em]">Sobre Mí</h2>
                                </div>
                                <div className="md:col-span-8 md:col-start-5 space-y-8 text-left">
                                    <p className="text-xl md:text-2xl font-sans font-medium leading-relaxed text-zinc-200">
                                        Soy Yanna Beato, una artista del movimiento y profesional audiovisual interesada en la relación entre cuerpo, cámara y narrativa visual.
                                    </p>
                                    <p className="text-lg md:text-xl font-sans leading-relaxed text-zinc-400">
                                        Mi trabajo combina coreografía, dirección de movimiento y procesos de producción audiovisual, explorando el movimiento como lenguaje cinematográfico en videoclips conceptuales, fotografía y proyectos escénicos.
                                    </p>
                                    <p className="text-lg md:text-xl font-sans leading-relaxed text-zinc-400">
                                        Paralelamente he desarrollado experiencia en producción de eventos cinematográficos, televisión y festivales de cine.
                                    </p>

                                    {/* CV Download */}
                                    <div className="pt-4">
                                        <a
                                            href="/Yanna_Beato_CV.pdf"
                                            download="Yanna_Beato_CV.pdf"
                                            className="inline-flex items-center gap-3 px-6 py-3 border border-zinc-700 rounded-full font-sans text-[10px] md:text-xs uppercase tracking-[0.25em] text-zinc-300 hover:bg-[#637381] hover:text-black hover:border-[#637381] transition-all duration-300 group"
                                        >
                                            <Download className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                            Descargar CV Completo
                                        </a>
                                    </div>
                                </div>
                            </motion.section>

                            {/* Narrative Section */}
                            <motion.section
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-20 max-w-6xl mx-auto"
                            >
                                <div className="md:col-span-3">
                                    <h2 className="font-sans text-[10px] md:text-xs text-[#637381] uppercase tracking-[0.2em]">MOVEMENT · VISION · DIRECTION</h2>
                                </div>
                                <div className="md:col-span-8 md:col-start-5 text-left">
                                    <p className="text-lg md:text-xl font-sans leading-relaxed text-zinc-400">
                                        Formación en cine y experiencia en producción audiovisual. Mi enfoque une la dirección creativa con la coreografía para crear piezas donde el movimiento cuenta la historia — desde la conceptualización hasta la postproducción.
                                    </p>
                                </div>
                            </motion.section>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
