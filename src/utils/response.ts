export function textResponse(text: string) {
  return { content: [{ type: "text" as const, text }] };
}

export function errorResponse(prefix: string, error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return textResponse(`${prefix}: ${message}`);
}
