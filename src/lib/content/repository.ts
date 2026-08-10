import { demoCourse } from "@/lib/content/demo-content";
import { hasSupabaseConfig } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import type { CourseContent, Lesson, Topic, WorkedSolution } from "@/types/content";
import type { Database } from "@/types/database";

const colours = ["var(--violet)", "var(--blue)", "var(--teal)", "var(--coral)"];

export async function getActiveCourseContent(): Promise<CourseContent> {
  if (!hasSupabaseConfig()) return demoCourse;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return demoCourse;

  const { data: enrolment } = await supabase
    .from("user_course_enrolments")
    .select("course_id")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .maybeSingle();
  const courseId = enrolment?.course_id ?? demoCourse.id;
  const { data: course } = await supabase.from("courses").select("id, slug, title, description").eq("id", courseId).maybeSingle();
  if (!course) return demoCourse;

  const { data: sections } = await supabase.from("specification_sections").select("id, code").eq("course_id", course.id).eq("status", "published").order("sort_order");
  if (!sections?.length) return { ...demoCourse, id: course.id, slug: course.slug, title: course.title, description: course.description, topics: [] };

  const sectionIds = sections.map((section) => section.id);
  const { data: topicRows } = await supabase.from("topics").select("*").in("specification_section_id", sectionIds).eq("status", "published").order("sort_order");
  const topics = await Promise.all((topicRows ?? []).map(async (topicRow, index): Promise<Topic> => {
    const section = sections.find((item) => item.id === topicRow.specification_section_id);
    const { data: subtopicRows } = await supabase.from("subtopics").select("*").eq("topic_id", topicRow.id).eq("status", "published").order("sort_order");
    const subtopicIds = (subtopicRows ?? []).map((row) => row.id);
    if (!subtopicIds.length) return emptyTopic(topicRow, section?.code ?? "", index);

    const [{ data: lessonRows }, { data: cardRows }, { data: solutionRows }] = await Promise.all([
      supabase.from("lessons").select("*").in("subtopic_id", subtopicIds).eq("status", "published").order("sort_order"),
      supabase.from("flashcards").select("*").in("subtopic_id", subtopicIds).eq("status", "published").order("sort_order"),
      supabase.from("worked_solutions").select("*").in("subtopic_id", subtopicIds).eq("status", "published").order("created_at"),
    ]);

    const lessons: Lesson[] = await Promise.all((lessonRows ?? []).map(async (lesson) => {
      const { data: sectionRows } = await supabase.from("lesson_sections").select("*").eq("lesson_id", lesson.id).order("sort_order");
      return {
        id: lesson.id, slug: lesson.slug, title: lesson.title, summary: lesson.summary, estimatedMinutes: lesson.estimated_minutes,
        sections: (sectionRows ?? []).map((item) => ({ id: item.id, heading: item.heading, body: item.body.paragraphs ?? [], callout: item.body.callout, code: item.body.code })),
      };
    }));

    const solutions: WorkedSolution[] = (solutionRows ?? []).map((solution) => ({
      id: solution.id,
      slug: `${topicRow.slug}-${slugify(solution.title)}`,
      title: solution.title,
      marks: Number(solution.prompt.match(/\[(\d+)\s+marks?\]/i)?.[1] ?? 1),
      prompt: solution.prompt,
      steps: solution.steps,
      finalAnswer: solution.final_answer,
      topicSlug: topicRow.slug,
      topicTitle: topicRow.title,
    }));

    return {
      id: topicRow.id, slug: topicRow.slug, code: section?.code ?? "", title: topicRow.title,
      description: topicRow.description, icon: topicRow.icon ?? "💡", colour: colours[index % colours.length],
      estimatedMinutes: topicRow.estimated_minutes, learningObjectives: topicRow.learning_objectives, mastery: 0,
      subtopicTitle: subtopicRows?.[0]?.title ?? topicRow.title, lessons,
      flashcards: (cardRows ?? []).map((card) => ({ id: card.id, front: card.front, back: card.back, hint: card.hint ?? undefined })),
      workedSolutions: solutions,
    };
  }));

  const [board = "", qualification = ""] = course.title.split(" ");
  return { id: course.id, slug: course.slug, title: course.title, description: course.description, examBoard: board, qualification, topics };
}

function emptyTopic(row: Database["public"]["Tables"]["topics"]["Row"], code: string, index: number): Topic {
  return { id: row.id, slug: row.slug, code, title: row.title, description: row.description, icon: row.icon ?? "💡", colour: colours[index % colours.length], estimatedMinutes: row.estimated_minutes, learningObjectives: row.learning_objectives, mastery: 0, subtopicTitle: row.title, lessons: [], flashcards: [], workedSolutions: [] };
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function getTopic(slug: string) {
  const course = await getActiveCourseContent();
  return { course, topic: course.topics.find((topic) => topic.slug === slug) };
}

export async function getLesson(topicSlug: string, lessonSlug: string) {
  const { course, topic } = await getTopic(topicSlug);
  return { course, topic, lesson: topic?.lessons.find((lesson) => lesson.slug === lessonSlug) };
}

export async function getWorkedSolutions() {
  const course = await getActiveCourseContent();
  return { course, solutions: course.topics.flatMap((topic) => topic.workedSolutions) };
}
