// Phase 1: GM slug == franchise slug. Owner page mirrors franchise page with GM framing.
import { notFound, redirect } from "next/navigation";
import { getFranchiseBySlug } from "@/lib/queries/franchises";

export default async function OwnerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const franchise = await getFranchiseBySlug(slug);
  if (!franchise) notFound();

  // In Phase 1, just redirect to the franchise page.
  // Phase 2: separate GM pages with multi-franchise history.
  redirect(`/franchises/${slug}`);
}
