'use server';

export async function getPrompt(text: string) {
  console.log(text);
  return "Prompt received!";
}