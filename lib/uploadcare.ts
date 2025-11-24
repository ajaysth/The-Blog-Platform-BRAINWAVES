// lib/uploadcare.ts
export async function uploadToUploadcare(file: File, { store = "1" } = {}) {
  const publicKey = process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY;
  if (!publicKey) throw new Error("Missing NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY");

  const fd = new FormData();
  fd.append("UPLOADCARE_PUB_KEY", publicKey);
  fd.append("file", file);
  // store immediately (1) or keep temporary (0). Passing store ensures permanent storage.
  fd.append("UPLOADCARE_STORE", store);

  const res = await fetch("https://upload.uploadcare.com/base/", {
    method: "POST",
    body: fd,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Uploadcare error: ${res.status} ${text}`);
  }

  const json = await res.json();
  if (!json.file) throw new Error("No file id returned from Uploadcare");

  // CDN URL pattern
  return `https://2l9nx4euxr.ucarecd.net/${json.file}/`;
}