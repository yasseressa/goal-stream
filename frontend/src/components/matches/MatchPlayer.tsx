import Link from "next/link";

import { Button } from "@/components/ui/Button";
import type { Messages } from "@/i18n";
import type { StreamLink } from "@/lib/api/types";

export function MatchPlayer({ stream, canShowPlayer, messages }: { stream?: StreamLink | null; canShowPlayer: boolean; messages: Messages }) {
  if (!canShowPlayer || !stream) {
    return (
      <div className="mx-auto w-full max-w-[860px] rounded-[1.25rem] border border-dashed border-[#5a431d] bg-[#17120d] p-4 text-[#d1bf99] min-[420px]:rounded-[1.5rem] min-[420px]:p-6">
        {messages.noStreamAvailable}
      </div>
    );
  }

  if (stream.stream_type === "iframe" || stream.stream_type === "embed") {
    return (
      <div className="mx-auto w-full max-w-[860px] overflow-hidden rounded-[1.25rem] border border-[#4b3818] bg-[#0d0d0d] shadow-card min-[420px]:rounded-[1.5rem]">
        <iframe
          src={stream.stream_url}
          className="aspect-[16/9] w-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title={messages.playerTitle}
        />
      </div>
    );
  }

  if (stream.stream_type === "external") {
    return (
      <div className="mx-auto w-full max-w-[860px] rounded-[1.25rem] border border-[#4b3818] bg-[#17120d] p-4 shadow-card min-[420px]:rounded-[1.5rem] min-[420px]:p-6">
        <Link href={stream.stream_url} target="_blank" rel="noreferrer" data-disable-global-redirect>
          <Button>{messages.watchMatch}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[860px] overflow-hidden rounded-[1.25rem] border border-[#4b3818] bg-[#0d0d0d] shadow-card min-[420px]:rounded-[1.5rem]">
      <video src={stream.stream_url} controls className="aspect-[16/9] w-full" />
    </div>
  );
}
