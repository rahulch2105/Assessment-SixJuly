export function splitWords(text: string): string[] {
  return text.split(/(\s+)/).filter((s) => s.length > 0);
}
