import { mockProvider } from './mockProvider';
import type { DataProvider } from './types';

// Backend handoff: replace this binding with an implementation of DataProvider.
export const dataProvider: DataProvider = mockProvider;

export async function askRagEngine(question: string) {
  const response = await fetch("http://127.0.0.1:8000/api/query", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: question }),
  });

  const data = await response.json();
  console.log("RAG Response:", data);
  return data;
}
