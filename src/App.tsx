import { EditorProvider } from "./components/EditorProvider";
import Sidebar from "./components/Sidebar";
import EditorContainer from "./components/EditorContainer";
import "./index.css";

function App() {
  return (
    <EditorProvider>
      <div className="flex full">
        <Sidebar />
        <EditorContainer />
      </div>
    </EditorProvider>
  );
}

export default App;
