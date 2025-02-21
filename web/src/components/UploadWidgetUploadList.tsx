import { useUploads } from "../store/uploads";
import { UploadWidgetItem } from "./UploadWidgetItem";
import * as ScrollArea from "@radix-ui/react-scroll-area";

export function UploadWidgetUploadList() {
  const uploads = useUploads((store) => store.uploads);

  const isUploadListEmpty = uploads.size === 0;

  return (
    <div className="px-3 flex flex-col gap-3">
      <span className="text-xs font-medium">
        Uploaded files
        <span className="text-zinc-400">({uploads.size})</span>
      </span>

      <ScrollArea.Root type="always" className="overflow-hidden">
        <ScrollArea.Viewport className="h-[220px]">
          {isUploadListEmpty ? (
            <span>No uploads added </span>
          ) : (
            <div className="flex flex-col gap-2">
              {Array.from(uploads.entries()).map(([uploadId, upload]) => (
                <UploadWidgetItem key={uploadId} upload={upload} />
              ))}
            </div>
          )}
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar
          className="flex touch-none select-none bg-zinc-400 p-0.5 transition-colors duration-[160ms] ease-out hover:bg-zinc-400 data-[orientation=horizontal]:h-2.5 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col"
          orientation="horizontal"
        >
          <ScrollArea.Thumb className="relative flex-1 rounded-[10px] bg-zinc-200 before:absolute before:left-1/2 before:top-1/2 before:size-full before:min-h-[44px] before:min-w-[44px] before:-translate-x-1/2 before:-translate-y-1/2" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </div>
  );
}
