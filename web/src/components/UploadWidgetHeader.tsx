import { Minimize2 } from "lucide-react";
import * as Collapsible from "@radix-ui/react-collapsible";
import { UploadWidgetTitle } from "./UploadWidgetTitle";

export function UploadWidgetHeader() {
  return (
    <Collapsible.Trigger className="w-full bg-white/2 py-3 px-5 flex items-center justify-between gap-5">
      <UploadWidgetTitle />
      <Minimize2
        strokeWidth={1.5}
        className="size-4 text-zinc-400 group-hover:text-zinc-100"
      />
    </Collapsible.Trigger>
  );
}
