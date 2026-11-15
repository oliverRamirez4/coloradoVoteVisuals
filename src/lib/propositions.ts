import { Proposition } from '@/types/propdata';
import { withBase } from '@/lib/paths';

export async function fetchProposition(id: string | number): Promise<Proposition | null> {
  const response = await fetch(withBase(`/api/propositions/${id}`));
  if (!response.ok) return null;
  return response.json();
}
