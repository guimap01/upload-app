import * as Collapsible from "@radix-ui/react-collapsible";
import { UploadWidgetDropzone } from "./UploadWidgetDropzone";
import { UploadWidgetHeader } from "./UploadWidgetHeader";
import { UploadWidgetUploadList } from "./UploadWidgetUploadList";
import { motion, useCycle } from "motion/react";
import { usePendingUploads } from "../store/uploads";

const widgetOpenWidth = 360;
const widgetClosedHeigh = 44;

export function UploadWidget() {
  const [isWidgetOpen, toggleWidgetOpen] = useCycle(false, true);
  const { hasPendingUploads } = usePendingUploads();
  return (
    <Collapsible.Root onOpenChange={() => toggleWidgetOpen()} asChild>
      <motion.div
        data-progress={hasPendingUploads}
        className="bg-zinc-900 overflow-hidden w-[360px] rounded-xl data-[state=open]:shadow-shape border border-transparent animate-border data-[state=closed]:rounded-3xl data-[state=closed]:data-[progress=false]:shadow-shape  data-[state=closed]:data-[progress=true]:[background:linear-gradient(45deg,#09090B,theme(colors.zinc.900)_50%,#09090B)_padding-box,conic-gradient(from_var(--border-angle),theme(colors.zinc.700/.48)_80%,_theme(colors.indigo.500)_86%,_theme(colors.indigo.300)_90%,_theme(colors.indigo.500)_94%,_theme(colors.zinc.600/.48))_border-box]"
        animate={isWidgetOpen ? "open" : "closed"}
        variants={{
          closed: {
            width: "max-content",
            height: widgetClosedHeigh,
          },
          open: {
            width: widgetOpenWidth,
            height: "auto",
            transition: {
              duration: 0.1,
            },
          },
        }}
      >
        <UploadWidgetHeader />
        <Collapsible.Content>
          <div className="flex flex-col gap-4 py-3">
            <UploadWidgetDropzone />
            <div className="h-px bg-zinc-800 border-t border-black/50 box-content" />
            <UploadWidgetUploadList />
          </div>
        </Collapsible.Content>
      </motion.div>
    </Collapsible.Root>
  );
}
