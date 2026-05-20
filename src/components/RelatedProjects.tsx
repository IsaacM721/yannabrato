"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { motion } from "framer-motion";
import ProjectCard from "./ProjectCard";
import { Project } from "@/lib/data";

interface RelatedProjectsProps {
    currentProjectId: string;
}

export default function RelatedProjects({ currentProjectId }: RelatedProjectsProps) {
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "projects"));
                const allProjects = querySnapshot.docs.map(doc => {
                    const data = doc.data() as Project;
                    let category = data.category;

                    // Remap categories as requested
                    const lowerCat = category?.toLowerCase().trim();
                    if (
                      lowerCat === "videoclips conceptuales" ||
                      lowerCat === "videos conceptuales" ||
                      lowerCat === "dirección creativa & coreografía" ||
                      lowerCat === "creative direction & choreography"
                    ) {
                      category = "Creative Direction & Choreography";
                    } else if (
                      lowerCat === "casting" ||
                      lowerCat === "producción y gestión de proyectos audiovisuales" ||
                      lowerCat === "producción y gestión de eventos audiovisuales" ||
                      lowerCat === "production & event management"
                    ) {
                      category = "Production & Event Management";
                    } else if (
                      lowerCat === "postproducción" ||
                      lowerCat === "postproduction"
                    ) {
                      category = "Postproduction";
                    }

                    return { ...data, id: doc.id, category };
                }) as Project[];

                // Filter out current project, drafts, and random shuffle
                const others = allProjects.filter(p => p.id !== currentProjectId && p.published !== false);
                const shuffled = others.sort(() => 0.5 - Math.random());

                // Take top 3
                setProjects(shuffled.slice(0, 3));
            } catch (error) {
                console.error("Error fetching related projects:", error);
            }
        };

        fetchProjects();
    }, [currentProjectId]);

    if (projects.length === 0) return null;

    return (
        <div className="mt-32 space-y-10">
            <div className="flex items-center gap-4">
                <span className="h-px flex-1 bg-zinc-900" />
                <h3 className="font-reenie text-2xl text-zinc-500 tracking-widest">Más Proyectos</h3>
                <span className="h-px flex-1 bg-zinc-900" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </div>
        </div>
    );
}
