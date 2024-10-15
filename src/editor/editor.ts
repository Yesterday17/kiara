import { AffineEditorContainer } from "@blocksuite/presets";
import { Schema } from "@blocksuite/store";
import { DocCollection } from "@blocksuite/store";
import { AffineSchemas } from "@blocksuite/blocks";
import "@blocksuite/presets/themes/affine.css";
import { IndexedDBBlobSource } from "@blocksuite/sync";

export interface EditorContextType {
  editor: AffineEditorContainer | null;
  collection: DocCollection | null;
  updateCollection: (newCollection: DocCollection) => void;
}

export function initEditor() {
  const schema = new Schema().register(AffineSchemas);
  const collection = new DocCollection({
    schema,
    blobSources: {
      main: new IndexedDBBlobSource("kiara"),
      shadows: [],
    },
  });
  collection.meta.initialize();

  const editor = new AffineEditorContainer();
  return { editor, collection };
}
