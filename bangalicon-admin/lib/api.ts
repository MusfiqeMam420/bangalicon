const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function fetchIcons() {
  const res = await fetch(`${API_URL}/icons`);
  return res.json();
}

export async function createIcon(data: any) {
  const res = await fetch(`${API_URL}/icons`, {
    method: "POST",
    body: data,
  });

  return res.json();
}
