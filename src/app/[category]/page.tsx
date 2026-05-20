import CategoryClient from "./CategoryClient";

import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { slugify } from "@/lib/utils";

export async function generateStaticParams() {
    try {
        const querySnapshot = await getDocs(collection(db, "projects"));
        const categories = new Set<string>();

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.category) {
                let category = data.category;
                const lowerCat = category.toLowerCase().trim();
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
                categories.add(slugify(category));
            }
        });

        // Always include default categories even if not in DB yet, to be safe
        const defaultCategories = [
            "commercial",
            "music-video",
            "narrative",
            "spec",
            "creative-direction-choreography",
            "production-event-management",
            "postproduction"
        ];
        defaultCategories.forEach(c => categories.add(c));

        return Array.from(categories).map((category) => ({
            category,
        }));
    } catch (error) {
        console.error("Error generating static params:", error);
        return [];
    }
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
    const resolvedParams = await params;
    return <CategoryClient category={resolvedParams.category} />;
}
