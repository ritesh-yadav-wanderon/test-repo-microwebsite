/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CMS_BASE?: string;
  readonly VITE_LF_BASE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
