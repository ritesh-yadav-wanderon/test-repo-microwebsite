"use client";

import type { NavigationBarProps, SiteFooterProps } from "@/components/layout/types";
import { NavigationBar } from "@/components/layout/NavigationBar/NavigationBar";
import { SiteFooter } from "@/components/layout/SiteFooter/SiteFooter";
import * as S from "./SiteChrome.styles";

export type SiteChromeProps = {
  navigation: NavigationBarProps;
  footer: SiteFooterProps;
  children: React.ReactNode;
};

export function SiteChrome({ navigation, footer, children }: SiteChromeProps) {
  return (
    <S.Page>
      <NavigationBar {...navigation} />
      <S.Main>{children}</S.Main>
      <S.FooterSlot>
        <SiteFooter {...footer} />
      </S.FooterSlot>
    </S.Page>
  );
}
