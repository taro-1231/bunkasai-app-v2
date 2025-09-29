import PhotosClient from "../_components/PhotoBoard";
import { listPhotos, PhotoListResponse } from "@/lib/api/photos";

export default async function Page({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant } = await params;
  const photos = (await listPhotos(tenant)) as PhotoListResponse;
  return <PhotosClient tenant={tenant} photos={photos} />;
}
