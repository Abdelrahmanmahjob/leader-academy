export type ContactFormData = {
  name: string;
  phone: string;
  email: string;
  message: string;
  website: string;
};

export async function submitContactForm(data: ContactFormData): Promise<void> {
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok)
    throw new Error(`Contact request failed (${response.status})`);
}
