import * as Collapsible from "@radix-ui/react-collapsible";
import { UploadWidgetDropzone } from "./UploadWidgetDropzone";
import { UploadWidgetHeader } from "./UploadWidgetHeader";
import { UploadWidgetUploadList } from "./UploadWidgetUploadList";

export function UploadWidget() {
  return (
    <Collapsible.Root>
      <div className="bg-zinc-900 w-[360px] overflow-hidden rounded-xl shadow-shape">
        <UploadWidgetHeader />
        <Collapsible.Content>
          <div className="flex flex-col gap-4 py-3">
            <UploadWidgetDropzone />
            <div className="h-px bg-zinc-800 border-t border-black/50 box-content" />
            <UploadWidgetUploadList />
          </div>
        </Collapsible.Content>
      </div>
    </Collapsible.Root>
  );
}
