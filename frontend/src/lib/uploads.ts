/**
 * Direct-to-storage upload helpers. Server returns presigned credentials,
 * the browser uploads directly. Bytes never touch our API.
 */

export async function uploadToR2(args: {
  uploadUrl: string;
  headers: Record<string, string>;
  file: File;
  onProgress?: (pct: number) => void;
}): Promise<void> {
  if (!args.onProgress) {
    const res = await fetch(args.uploadUrl, {
      method: "PUT",
      headers: args.headers,
      body: args.file,
    });
    if (!res.ok) {
      throw new Error(`Upload failed: ${res.status} ${await res.text().catch(() => "")}`);
    }
    return;
  }

  // XHR for progress reporting (fetch doesn't expose upload progress yet).
  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", args.uploadUrl);
    Object.entries(args.headers).forEach(([k, v]) => xhr.setRequestHeader(k, v));
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) args.onProgress!(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error(`Upload failed: ${xhr.status} ${xhr.responseText}`));
    };
    xhr.onerror = () => reject(new Error("Network error during upload"));
    xhr.send(args.file);
  });
}

/**
 * Upload a video file to VdoCipher using credentials returned by our server.
 * VdoCipher expects multipart form-data with their signed fields plus the file.
 */
export async function uploadToVdoCipher(args: {
  uploadLink: string;
  clientPayload: {
    policy: string;
    key: string;
    "x-amz-signature": string;
    "x-amz-algorithm": string;
    "x-amz-date": string;
    "x-amz-credential": string;
  };
  file: File;
  onProgress?: (pct: number) => void;
}): Promise<void> {
  const form = new FormData();
  form.append("policy", args.clientPayload.policy);
  form.append("key", args.clientPayload.key);
  form.append("x-amz-signature", args.clientPayload["x-amz-signature"]);
  form.append("x-amz-algorithm", args.clientPayload["x-amz-algorithm"]);
  form.append("x-amz-date", args.clientPayload["x-amz-date"]);
  form.append("x-amz-credential", args.clientPayload["x-amz-credential"]);
  form.append("success_action_status", "201");
  form.append("success_action_redirect", "");
  form.append("file", args.file);

  if (!args.onProgress) {
    const res = await fetch(args.uploadLink, { method: "POST", body: form });
    if (!res.ok) {
      throw new Error(`VdoCipher upload failed: ${res.status} ${await res.text().catch(() => "")}`);
    }
    return;
  }

  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", args.uploadLink);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) args.onProgress!(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error(`VdoCipher upload failed: ${xhr.status} ${xhr.responseText}`));
    };
    xhr.onerror = () => reject(new Error("Network error during VdoCipher upload"));
    xhr.send(form);
  });
}
