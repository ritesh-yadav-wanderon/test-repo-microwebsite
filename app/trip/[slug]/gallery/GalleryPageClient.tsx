"use client";

import { TripGalleryView } from "../../../../src/views/TripGallery";
import NextSearchParamsProvider from "../../../NextSearchParamsProvider";

export default function GalleryPageClient({ slug }: { slug: string }) {
  return (
    <NextSearchParamsProvider>
      <TripGalleryView slug={slug} />
    </NextSearchParamsProvider>
  );
}
