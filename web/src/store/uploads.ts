import { enableMapSet } from "immer";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { uploadFileToStorage } from "../http/uploadFileToStorage";
import { CanceledError } from "axios";
import { useShallow } from "zustand/shallow";
import { compressImage } from "../utils/compressImage";

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
  uploadSizeInBytes: number;
  originalSizeInBytes: number;
  compressedSizeInBytes?: number;
  remoteUrl?: string;
}

const MAX_WIDTH = 1000;
const MAX_HEIGHT = 1000;
const QUALITY = 0.8;

interface UploadState {
  uploads: Map<string, Upload>;
  addUploads: (files: File[]) => void;
  cancelUpload: (uploadId: string) => void;
  retryUpload: (uploadId: string) => void;
}

enableMapSet();
export const useUploads = create<UploadState, [["zustand/immer", never]]>(
  immer((set, get) => {
    function updateUpload(uploadId: string, data: Partial<Upload>) {
      const upload = get().uploads.get(uploadId);

      if (!upload) {
        return;
      }

      set((state) => {
        state.uploads.set(uploadId, { ...upload, ...data });
      });
    }
    async function processUploads(uploadId: string) {
      const upload = get().uploads.get(uploadId);
      if (!upload) {
        return;
      }
      const abortController = new AbortController();
      try {
        const compressedFile = await compressImage({
          file: upload.file,
          maxWidth: MAX_WIDTH,
          maxHeight: MAX_HEIGHT,
          quality: QUALITY,
        });
        updateUpload(uploadId, {
          compressedSizeInBytes: compressedFile.size,
          uploadSizeInBytes: 0,
          remoteUrl: undefined,
          abortController,
          status: UploadStatus.progress,
        });
        const { url } = await uploadFileToStorage({
          file: compressedFile,
          signal: upload.abortController.signal,
          onProgress(sizeInBytes) {
            updateUpload(uploadId, { uploadSizeInBytes: sizeInBytes });
          },
        });
        updateUpload(uploadId, {
          status: UploadStatus.success,
          remoteUrl: url,
        });
      } catch (error) {
        if (error instanceof CanceledError) {
          updateUpload(uploadId, {
            status: UploadStatus.canceled,
          });

          return;
        }
        updateUpload(uploadId, {
          status: UploadStatus.error,
        });
      }
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
          originalSizeInBytes: file.size,
          uploadSizeInBytes: 0,
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
      upload.abortController?.abort();

      updateUpload(upload.uploadId, {
        status: UploadStatus.canceled,
      });
    }
    function retryUpload(uploadId: string) {
      processUploads(uploadId);
    }
    return {
      uploads: new Map(),
      addUploads,
      cancelUpload,
      retryUpload,
    };
  })
);

export const usePendingUploads = () => {
  return useUploads(
    useShallow((store) => {
      const uploads = Array.from(store.uploads.values());
      const hasPendingUploads = uploads.some(
        (upload) => upload.status === UploadStatus.progress
      );

      if (!hasPendingUploads) {
        return {
          hasPendingUploads,
          globalPercentage: 100,
        };
      }

      const { total, uploaded } = uploads.reduce(
        (acc, upload) => {
          if (!upload.compressedSizeInBytes) {
            return acc;
          }
          acc.total += upload.compressedSizeInBytes || 0;
          acc.uploaded += upload.uploadSizeInBytes;
          return acc;
        },
        {
          total: 0,
          uploaded: 0,
        }
      );
      const globalPercentage = Math.min(Math.round(uploaded * 100) / total);
      return {
        globalPercentage,
        hasPendingUploads,
      };
    })
  );
};
