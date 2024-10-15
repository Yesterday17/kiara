import { useCallback, useEffect, useState } from "react";
import { Doc, Job } from "@blocksuite/store";
import { useEditor } from "../editor/context";
import clsx from "clsx";
import { MarkdownAdapter } from "@blocksuite/blocks";

export default function Sidebar() {
  const { collection, editor } = useEditor();
  const [docs, setDocs] = useState<Doc[]>([]);

  useEffect(() => {
    if (!collection || !editor) return;
    const updateDocs = () => {
      const docs = [...collection.docs.values()].map((blocks) =>
        blocks.getDoc()
      );
      setDocs(docs);
    };
    updateDocs();

    const disposable = [
      collection.slots.docUpdated.on(updateDocs),
      editor.slots.docLinkClicked.on(updateDocs),
    ];

    return () => disposable.forEach((d) => d.dispose());
  }, [collection, editor]);

  const addDocument = useCallback(() => {
    const slug = prompt("Input the slug of the document");
    if (!slug) return;

    const doc = collection.createDoc({ id: slug });
    doc.load(() => {
      const pageBlockId = doc.addBlock("affine:page", {});
      doc.addBlock("affine:surface", {}, pageBlockId);
      const noteId = doc.addBlock("affine:note", {}, pageBlockId);
      doc.addBlock("affine:paragraph", {}, noteId);
      collection.setDocMeta(doc.id, { password: "test" });
    });
    doc.blobSync;
    editor.doc = doc;
  }, [collection, editor]);

  const exportToMarkdown = async () => {
    const doc = editor.doc;
    const job = new Job({
      collection: doc.collection,
      middlewares: [(opt) => {}],
    });
    const snapshot = await job.docToSnapshot(doc);
    const adapter = new MarkdownAdapter(job);
    const markdownResult = await adapter.fromDocSnapshot({
      snapshot,
      assets: job.assetsManager,
    });
    console.log(markdownResult, job.assetsManager);
  };

  return (
    <div className="h-full border-r-2 border-r-black/60 w-80 p-4">
      <div className="flex justify-between items-center py-4">
        <h2 className="text-xl">All Docs</h2>
        <button
          className="ring-2 rounded-md px-2 py-[0.5] hover:bg-gray-200 transition-all"
          onClick={addDocument}
        >
          +&nbsp;Add
        </button>
      </div>
      <hr className="border-2 pb-2" />
      <div>
        {docs.map((doc) => (
          <div
            className={clsx("flex", editor?.doc === doc && "active")}
            key={doc.id}
            onClick={() => {
              if (editor) editor.doc = doc;
              const docs = [...collection.docs.values()].map((blocks) =>
                blocks.getDoc()
              );
              setDocs(docs);
            }}
          >
            <span className="flex-1">{doc.meta?.title || "Untitled"}</span>
            <span>{doc.id}</span>
            <button onClick={exportToMarkdown}>E</button>
          </div>
        ))}
      </div>
    </div>
  );
}
