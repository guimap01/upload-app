import { uploadServer } from "../api";

interface UploadFileToStorageParams {
  file: File;
  signal?: AbortSignal;
}

export async function uploadFileToStorage({
  file,
  signal,
}: UploadFileToStorageParams) {
  const data = new FormData();

  data.append("file", file);

  const response = await uploadServer.post<{ url: string }>("/uploads", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    signal,
  });

  return { url: response.data.url };
}
