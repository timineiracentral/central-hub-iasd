/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WEB3FORMS_ACCESS_KEY?: string;
  /** Chave da API ImgBB (upload gratuito de imagens; https://api.imgbb.com/) */
  readonly VITE_IMGBB_API_KEY?: string;
}
