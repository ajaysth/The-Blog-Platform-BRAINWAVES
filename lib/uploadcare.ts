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

export async function deleteFromUploadcare(fileUrl: string) {
  const publicKey = process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY;
  const secretKey = process.env.UPLOADCARE_SECRET_KEY;

  if (!publicKey || !secretKey) {
    throw new Error("Missing Uploadcare API keys. Cannot delete file.");
  }

  // Extract UUID from https://.../UUID/
  const uuid = fileUrl.split('/')[3];
  if (!uuid) {
    throw new Error(`Invalid Uploadcare file URL: ${fileUrl}`);
  }

  const res = await fetch(`https://api.uploadcare.com/files/${uuid}/`, {
    method: "DELETE",
    headers: {
      "Authorization": `Uploadcare.Simple ${publicKey}:${secretKey}`,
      "Accept": "application/vnd.uploadcare-v0.7+json",
    },
  });

  if (!res.ok && res.status !== 404) {
    const text = await res.text();
    throw new Error(`Uploadcare delete error: ${res.status} ${text}`);
  }
}