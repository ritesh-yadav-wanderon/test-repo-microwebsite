"use client";

import { PaymentsView } from "../../src/views/Payments";
import { useAppNav } from "../../src/hooks/useAppNav";
import { exitToMainPage } from "../../src/utils/lastMainPage";

export default function PaymentsPageClient() {
  const nav = useAppNav();

  return (
    <PaymentsView
      onBack={() => nav.push("/profile")}
      onExit={() => exitToMainPage(nav)}
    />
  );
}
