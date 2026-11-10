"use client";

import { MyProfileView } from "../../src/views/MyProfile";
import { useAppNav } from "../../src/hooks/useAppNav";

export default function MyProfilePageClient() {
  const nav = useAppNav();
  return <MyProfileView onBack={() => nav.push("/profile")} />;
}
