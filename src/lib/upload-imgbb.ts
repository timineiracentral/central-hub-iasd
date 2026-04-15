/** Upload via API v1 do ImgBB (plano gratuito). Retorna URL direta da imagem. */

const IMGBB_UPLOAD = "https://api.imgbb.com/1/upload";

type ImgbbSuccess = {
  success: true;
  data: { url?: string; display_url?: string };
};

type ImgbbErrorBody = {
  success?: false;
  status?: number;
  error?: { message?: string; code?: string };
};

export async function uploadImageToImgbb(file: File, apiKey: string): Promise<string> {
  const fd = new FormData();
  fd.append("key", apiKey.trim());
  fd.append("image", file);

  const response = await fetch(IMGBB_UPLOAD, { method: "POST", body: fd });
  const json = (await response.json()) as ImgbbSuccess | ImgbbErrorBody;

  if ("success" in json && json.success && json.data) {
    const url = json.data.url ?? json.data.display_url;
    if (url) return url;
  }

  const err = json as ImgbbErrorBody;
  const msg =
    err.error?.message ??
    (typeof err.status === "number" ? `ImgBB retornou status ${err.status}.` : null) ??
    "Não foi possível enviar a imagem.";
  throw new Error(msg);
}
