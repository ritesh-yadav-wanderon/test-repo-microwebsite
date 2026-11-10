"use client";

import { SearchResultsView } from "../../src/views/SearchResults";
import type { ProductListResult } from "../../src/repositories";
import NextSearchParamsProvider from "../NextSearchParamsProvider";

export default function SearchResultsPageClient({
  initialData,
}: {
  initialData: ProductListResult;
}) {
  return (
    <NextSearchParamsProvider>
      <SearchResultsView initialData={initialData} />
    </NextSearchParamsProvider>
  );
}
