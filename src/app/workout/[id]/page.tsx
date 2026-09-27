import { notFound } from "next/navigation";
import { fetchWorkoutById } from "../../lib/fitlog";
import { WorkoutDetailClient } from "./WorkOutDetailClient";

export default async function WorkoutDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const workout = await fetchWorkoutById(id);

  if (!workout) {
    notFound();
  }

  return <WorkoutDetailClient workout={workout} />;
}
