import type { ContactFormData } from "@/lib/contact";

function isContactFormData(value: unknown): value is ContactFormData {
  if (!value || typeof value !== "object") return false;
  const data = value as Record<string, unknown>;

  return ["name", "phone", "email", "message", "website"].every(
    (key) => typeof data[key] === "string",
  );
}

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return Response.json(
      { error: "Content-Type must be application/json." },
      { status: 415 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch (error) {
    if (error instanceof SyntaxError) {
      return Response.json({ error: "Invalid JSON body." }, { status: 400 });
    }
    throw error;
  }

  if (!isContactFormData(body)) {
    return Response.json(
      { error: "Contact form fields are missing or invalid." },
      { status: 400 },
    );
  }

  if (body.website) {
    return new Response(null, { status: 204 });
  }

  return Response.json(
    { error: "Contact submissions are not configured yet." },
    { status: 503 },
  );
}
