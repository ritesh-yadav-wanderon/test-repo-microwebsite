"use client";

import { NotificationsView } from "../../src/views/Notifications";
import { useAppNav } from "../../src/hooks/useAppNav";
import { exitToMainPage } from "../../src/utils/lastMainPage";

export default function NotificationsPageClient() {
  const nav = useAppNav();

  return (
    <NotificationsView
      onBack={() => nav.push("/profile")}
      onExit={() => exitToMainPage(nav)}
    />
  );
}
