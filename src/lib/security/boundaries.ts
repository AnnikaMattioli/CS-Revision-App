export function safeInternalPath(value: string | null | undefined, fallback = "/dashboard") {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return fallback;
  return value;
}

export function demoAttemptAllowed(attemptId: string, supabaseConfigured: boolean) {
  const hasDemoPrefix = attemptId.startsWith("demo-") || attemptId.startsWith("exam-demo-") || attemptId.startsWith("retry-");
  return hasDemoPrefix && !supabaseConfigured;
}

export function hasDemoAttemptPrefix(attemptId: string) {
  return attemptId.startsWith("demo-") || attemptId.startsWith("exam-demo-") || attemptId.startsWith("retry-");
}
