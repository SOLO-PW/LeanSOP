import type { SopDocument } from "../types/sop";

const DRAFT_KEY = "leansop_draft";

export function loadDraft(): SopDocument | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return null;
}

export function saveDraft(doc: SopDocument): boolean {
  try {
    const data = JSON.stringify(doc, null, 2);
    localStorage.setItem(DRAFT_KEY, data);
    return true;
  } catch {
    return false;
  }
}
