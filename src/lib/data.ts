export interface Project {
    id: string;
    title?: string;
    category: string;

    year: string;
    thumbnail: string;
    thumbnailPoster?: string;
    thumbnailPosition?: string;
    videoUrl?: string | null;
    credits?: string | null;
    description?: string | null;
    slug: string;
    published?: boolean;
    createdAt?: string;
    updatedAt?: string;
}
