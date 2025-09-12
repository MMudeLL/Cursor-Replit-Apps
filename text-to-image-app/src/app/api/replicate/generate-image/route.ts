import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

// Create a prediction and return its id for client-side polling
export async function POST(request: Request) {
  if (!process.env.REPLICATE_API_TOKEN) {
    return NextResponse.json({ error: "Missing REPLICATE_API_TOKEN" }, { status: 500 });
  }

  const body = await request.json();
  const {
    prompt,
    negative_prompt,
    image_dimensions = "512x512",
    num_outputs = 1,
    num_inference_steps = 50,
    guidance_scale = 7.5,
    scheduler = "DPMSolverMultistep",
    model = "stability-ai/stable-diffusion:db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf",
  } = body || {};

  if (!prompt || typeof prompt !== "string") {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  try {
    const prediction = await replicate.predictions.create({
      version: model,
      input: {
        prompt,
        negative_prompt,
        image_dimensions,
        num_outputs,
        num_inference_steps,
        guidance_scale,
        scheduler,
      },
    } as any);

    return NextResponse.json({ id: prediction.id, status: prediction.status }, { status: 202 });
  } catch (error: any) {
    console.error("Error creating prediction:", error);
    return NextResponse.json({ error: error?.message || "Replicate error" }, { status: 500 });
  }
}

// Poll prediction status by id: /api/replicate/generate-image?id=...
export async function GET(request: Request) {
  if (!process.env.REPLICATE_API_TOKEN) {
    return NextResponse.json({ error: "Missing REPLICATE_API_TOKEN" }, { status: 500 });
  }
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });
  try {
    const prediction = await replicate.predictions.get(id);
    return NextResponse.json(
      {
        id: prediction.id,
        status: prediction.status,
        output: prediction.output,
        error: prediction.error,
        logs: (prediction as any).logs,
        metrics: (prediction as any).metrics,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching prediction:", error);
    return NextResponse.json({ error: error?.message || "Replicate error" }, { status: 500 });
  }
}
