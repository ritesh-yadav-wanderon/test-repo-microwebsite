/** Opens the global login sheet/modal (rendered by SiteChrome). Optionally
 *  navigates to `redirectTo` after a successful login. */
export function openLoginSheet(redirectTo?: string) {
  window.dispatchEvent(
    new CustomEvent("wanderon:open-login", { detail: { redirectTo } })
  );
}
