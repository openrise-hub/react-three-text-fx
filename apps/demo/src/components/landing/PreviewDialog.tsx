import React from "react";
import { Dialog } from "@/components/retroui/Dialog";
import { TextPreviewCanvas } from "@/components/landing/TextPreviewCanvas";

export type PreviewDialogProps = {
  text: string;
};

export function PreviewDialog({ text }: PreviewDialogProps) {
  return (
    <Dialog>
      <Dialog.Trigger asChild>
        <div className="group relative mt-4 h-[320px] cursor-pointer rounded-md border-2 border-dashed border-[var(--border)] bg-[var(--background)]">
          <div className="flex h-full items-center justify-center">
            <TextPreviewCanvas
              text={text}
              fontSize={160}
              cameraZ={600}
              className="h-full w-full"
            />
          </div>
          <div className="pointer-events-none absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
            <span className="rounded-md border-2 border-[var(--border)] bg-[var(--primary)] px-3 py-1 text-xs font-semibold uppercase">
              Click to expand
            </span>
          </div>
        </div>
      </Dialog.Trigger>

      <Dialog.Content
        size="4xl"
        className="grid-rows-[auto_minmax(0,1fr)] h-[90vh] w-[90vw] overflow-hidden p-0"
      >
        <Dialog.Header className="border-b-2 border-[var(--border)] px-4 py-3">
          <div>
            <p className="text-xs font-semibold uppercase">Fullscreen preview</p>
          </div>
        </Dialog.Header>
        <div className="relative flex-1 min-h-0 w-full bg-[var(--background)]">
          <TextPreviewCanvas
            text={text}
            fontSize={140}
            cameraZ={800}
            className="h-full w-full"
          />
        </div>
      </Dialog.Content>
    </Dialog>
  );
}
