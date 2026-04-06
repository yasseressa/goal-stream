import Link from "next/link";

import { Button } from "@/components/ui/Button";
import type { Messages } from "@/i18n";
import type { StreamLink } from "@/lib/api/types";

export function MatchPlayer({ stream, canShowPlayer, messages }: { stream?: StreamLink | null; canShowPlayer: boolean; messages: Messages }) {
  if (!canShowPlayer || !stream) {
    return <div className="rounded-[1.5rem] border border-dashed border-[#5a431d] bg-[#17120d] p-6 text-[#d1bf99]">{messages.noStreamAvailable}</div>;
  }

  if (stream.stream_type === "iframe" || stream.stream_type === "embed") {
    return (
      <div className="overflow-hidden rounded-[1.5rem] border border-[#4b3818] bg-[#0d0d0d] shadow-card">
        <iframe
          src={stream.stream_url}
          className="aspect-video w-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title={messages.playerTitle}
        />
      </div>
    );
  }

  if (stream.stream_type === "external") {
    return (
      <div className="rounded-[1.5rem] border border-[#4b3818] bg-[#17120d] p-6 shadow-card">
        <Link href={stream.stream_url} target="_blank" rel="noreferrer" data-disable-global-redirect>
          <Button>{messages.watchMatch}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-[#4b3818] bg-[#0d0d0d] shadow-card">
      <video src={stream.stream_url} controls className="aspect-video w-full" />
    </div>
  );
}
