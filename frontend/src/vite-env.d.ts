/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly REACT_APP_API_URL: string;
  readonly REACT_APP_NAME: string;
  readonly REACT_APP_VERSION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
