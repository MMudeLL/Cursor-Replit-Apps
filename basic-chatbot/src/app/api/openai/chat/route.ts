import { openai } from "@ai-sdk/openai";
import { convertToCoreMessages, streamText } from "ai";

export const runtime = "edge";

type IncomingBody = {
  messages: unknown[];
  model?: string;
  system?: string;
};

export async function POST(req: Request) {
  try {
    const { messages, model, system }: IncomingBody = await req.json();

    const selectedModel = model === "gpt-3.5" || model === "gpt-3.5-turbo" ? "gpt-3.5-turbo" : "gpt-4o";

    const result = await streamText({
      model: openai(selectedModel),
      messages: convertToCoreMessages(messages as any),
      system: system ?? "You are a helpful AI assistant.",
    });

    return result.toDataStreamResponse();
  } catch (error: any) {
    const status = error?.status ?? 500;
    const message = error?.message ?? "Unknown error";
    return new Response(
      JSON.stringify({ error: { message }, ok: false }),
      { status, headers: { "content-type": "application/json" } }
    );
  }
}
