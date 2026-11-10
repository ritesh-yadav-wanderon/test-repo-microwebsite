"use client";

import { useRouter } from "next/navigation";
import { LegalView } from "../../src/views/Legal";
import EndMark from "../../src/components/ui/EndMark";

export default function LegalPageClient() {
  const router = useRouter();
  return (
    <LegalView
      onBack={() => router.back()}
      onNavigate={(to) => router.push(to)}
      endMark={<EndMark variant="mobile" />}
    />
  );
}
