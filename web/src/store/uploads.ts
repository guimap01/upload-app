import { enableMapSet } from "immer";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { uploadFileToStorage } from "../http/uploadFileToStorage";

export enum UploadStatus {
  progress = "progess",
  success = "success",
  error = "error",
  canceled = "canceled",
}

export interface Upload {
  name: string;
  file: File;
  abortController: AbortController;
  status: UploadStatus;
  uploadId: string;
}

interface UploadState {
  uploads: Map<string, Upload>;
  addUploads: (files: File[]) => void;
  cancelUpload: (uploadId: string) => void;
}

enableMapSet();
export const useUploads = create<UploadState, [["zustand/immer", never]]>(
  immer((set, get) => {
    async function processUploads(uploadId: string) {
      const upload = get().uploads.get(uploadId);
      if (!upload) {
        return;
      }
      await uploadFileToStorage({
        file: upload.file,
        signal: upload.abortController.signal,
      });
    }
    function addUploads(files: File[]) {
      for (const file of files) {
        const uploadId = crypto.randomUUID();
        const abortController = new AbortController();
        const upload: Upload = {
          uploadId,
          name: file.name,
          file,
          abortController,
          status: UploadStatus.progress,
        };

        set((state) => {
          state.uploads.set(uploadId, upload);
        });
        processUploads(uploadId);
      }
    }
    function cancelUpload(uploadId: string) {
      const upload = get().uploads.get(uploadId);
      if (!upload) {
        return;
      }
      upload.abortController.abort();
      set((state) => {
        state.uploads.set(uploadId, {
          ...upload,
          status: UploadStatus.canceled,
        });
      });
    }
    return {
      uploads: new Map(),
      addUploads,
      cancelUpload,
    };
  })
);
