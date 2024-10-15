import { DocMeta } from "@blocksuite/store";

declare module "@blocksuite/store" {
  interface DocMeta {
    password: string;
  }
}
