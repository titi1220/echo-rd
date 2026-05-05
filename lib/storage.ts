import { createServerSupabaseClient, hasSupabaseServerEnv } from "@/lib/supabase";
import { isAllowedUpload } from "@/lib/security";

export async function uploadPrivateOrPublicFile({
  bucket,
  file,
  folder,
  mode = "image",
  isPublic = false
}: {
  bucket: string;
  file: File | null;
  folder: string;
  mode?: "image" | "media";
  isPublic?: boolean;
}) {
  if (!file || file.size === 0 || !hasSupabaseServerEnv()) return "";
  if (!isAllowedUpload(file, mode)) {
    throw new Error("Tipo de archivo no permitido o archivo demasiado grande.");
  }

  const extension = file.name.split(".").pop()?.toLowerCase() || "bin";
  const path = `${folder}/${crypto.randomUUID()}.${extension}`;
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    contentType: file.type,
    upsert: false
  });

  if (error) throw new Error("No se pudo subir el archivo.");

  if (isPublic) {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }

  return `private://${bucket}/${path}`;
}
