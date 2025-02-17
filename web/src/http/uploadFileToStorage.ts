import { uploadServer } from "../api";

interface UploadFileToStorageParams {
  file: File;
  signal?: AbortSignal;
  onProgress: (sizeInBytes: number) => void;
}

export async function uploadFileToStorage({
  file,
  signal,
  onProgress,
}: UploadFileToStorageParams) {
  const data = new FormData();

  data.append("file", file);

  const response = await uploadServer.post<{ url: string }>("/uploads", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    signal,
    onUploadProgress(progressEvent) {
      onProgress(progressEvent.loaded);
    },
  });

  return { url: response.data.url };
}
