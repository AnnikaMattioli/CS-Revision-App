import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { AchievementsGallery } from "@/components/progress/achievements-gallery";
import { getProgressSnapshot } from "@/lib/progress/repository";

export const metadata: Metadata = { title: "Achievements" };
export default async function AchievementsPage() { const snapshot = await getProgressSnapshot(); return <main id="main-content" className="mx-auto max-w-6xl px-5 pb-20 pt-20 sm:px-8 lg:pt-10"><Breadcrumbs items={[{ label: "Achievements" }]} /><AchievementsGallery initial={snapshot} /></main>; }
