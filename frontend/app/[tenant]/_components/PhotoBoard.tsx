"use client";

import PostPhotoModal from "../_components/PostPhotoModal";
import { PhotoListResponse } from "@/lib/api/photos";
import { useState } from "react";

export default function PhotosClient({
  tenant,
  photos,
}: {
  tenant: string;
  photos: PhotoListResponse;
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">photo board</h1>
        <PostPhotoModal tenant={tenant} />
      </div>

      {photos.items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">まだ写真が投稿されていません。</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {photos.items.map((photo) => (
            <div key={photo.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="aspect-square">
                <ImgWithFallback src={photo.src} alt='写真一覧' />

              </div>
              <div className="p-3">
                <p className="text-sm text-gray-600">
                  投稿日: {new Date(photo.published_at).toLocaleDateString("ja-JP")}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ImgWithFallback({ src, alt }: { src: string; alt: string }) {
  const [cur, setCur] = useState(src);
  return (
    <img
      src={cur}
      alt={alt}
      className="w-full h-full object-cover"
      onError={() => {
        console.error("画像の読み込みに失敗しました:", src);
        setCur("/placeholder-image.png");
      }}
      loading="lazy"
      decoding="async"
    />
  );
}
