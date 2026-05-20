"use client";

import { useEffect, useState, useMemo } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import CategoryAccordion from "@/components/CategoryAccordion";
import ProjectGrid from "@/components/ProjectGrid";
import { motion } from "framer-motion";
import AboutSection from "@/components/AboutSection";
import ContactAccordion from "@/components/ContactAccordion";
import HeroVideo from "@/components/HeroVideo";
import { sortCategories, slugify } from "@/lib/utils";

interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  year: string;
  thumbnail: string;
  thumbnailPoster?: string;
  videoUrl?: string | null;
  credits?: string | null;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
  published?: boolean;
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroVideoUrl, setHeroVideoUrl] = useState("");

  useEffect(() => {
    fetchData();
    fetchSettings();
  }, []);

  const fetchData = async () => {
    try {
      const projectsSnap = await getDocs(collection(db, "projects"));
      const projectsData = projectsSnap.docs.map(doc => {
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

      // Filter out drafts from the public view
      const publishedProjects = projectsData.filter(p => p.published !== false);

      setProjects(publishedProjects);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const docRef = doc(db, "settings", "general");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setHeroVideoUrl(docSnap.data().heroVideoUrl || "");
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  // Extract unique categories from projects (unifying duplicates)
  const categoriesList = useMemo(() => {
    // Group projects by normalized category name
    const categoryMap = new Map<string, string>(); // normalized -> canonical
    
    projects.forEach(p => {
      const cat = p.category?.trim();
      if (cat) {
        const normalized = cat.toLowerCase();
        if (!categoryMap.has(normalized)) {
          // Keep the first one found, or prefer lowercase if it matches PREDEFINED_ORDER
          categoryMap.set(normalized, cat);
        }
      }
    });

    return Array.from(categoryMap.values()).sort(sortCategories);
  }, [projects]);

  return (
    <main className="min-h-screen bg-black">
      {/* Branding Hero Section with Video Background */}
      <section className="relative h-screen w-full flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Video Background */}
        <HeroVideo videoUrl={heroVideoUrl} />

        {/* Branding Overlay */}
        <div className="relative z-20 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-reenie leading-none text-[#637381]">
              Yanna Beato
            </h1>
            <div className="mt-8">
              <h2 className="font-sans text-sm md:text-base text-[#637381] uppercase tracking-[0.4em] opacity-80">
                Movement · Vision · Direction
              </h2>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-[1920px] mx-auto px-4 md:px-10">
        {/* Project Accordions */}
        {loading ? (
          <div className="space-y-12">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="border-b border-white/5 py-12">
                <div className="h-20 bg-zinc-900 animate-pulse rounded w-1/3 mb-8" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="aspect-video bg-zinc-900 animate-pulse rounded" />
                  <div className="aspect-video bg-zinc-900 animate-pulse rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : categoriesList.length > 0 ? (
          <div className="mt-10">
            {categoriesList.map((cat) => (
              <div key={cat} id={slugify(cat)}>
                <CategoryAccordion
                  title={cat}
                  projects={projects.filter(p => p.category.toLowerCase().trim() === cat.toLowerCase().trim())}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32">
            <p className="font-reenie text-3xl text-zinc-500 tracking-widest">
              No hay proyectos todavía
            </p>
          </div>
        )}

        <div id="who-i-am">
          <AboutSection />
        </div>

        <div id="say-hi">
          <ContactAccordion />
        </div>

      </div>
    </main>
  );
}
