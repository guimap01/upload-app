import { motion } from "motion/react";
import { useDropzone } from "react-dropzone";
import { CircularProgressBar } from "./ui/CircularProgressBar";

const isThereAnyPendingUpload = true;
const uploadGlobalPercentage = 66;
export function UploadWidgetDropzone() {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: true,
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
    onDrop(acceptedFiles, fileRejections, event) {
      console.log(acceptedFiles);
    },
  });
  return (
    <motion.div
      className="px-3 flex flex-col gap-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div
        data-active={isDragActive}
        className="cursor-pointer text-zinc-400 bg-black/20 p-5 rounded-lg border border-zinc-700 border-dashed h-32 flex flex-col items-center justify-center gap-1 hover:border-zinc-600 transition-colors data-[active=true]:bg-indigo-500/10 data-[active=true]:border-indigo-500 data-[active=true]:text-indigo-400"
        {...getRootProps()}
      >
        <input type="file" {...getInputProps()} />
        {isThereAnyPendingUpload ? (
          <div className="flex flex-col gap-2.5 items-center">
            <CircularProgressBar
              progress={uploadGlobalPercentage}
              size={56}
              strokeWidth={4}
            />
            <span>Uploading 2 files...</span>
          </div>
        ) : (
          <>
            <span className="text-xs">Drop you files here or</span>
            <span className="text-xs underline">Click to open picker</span>
          </>
        )}
      </div>

      <span className="text-xs text-zinc-400">
        Only PNG and JPG files are supported.
      </span>
    </motion.div>
  );
}
