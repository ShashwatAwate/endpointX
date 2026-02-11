import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "../ui/button";
import { useTheme } from "../theme-provider";
import { Play } from "lucide-react";
import { EXPRESS_BOILERPLATE } from "@/data/code-editor";
import { Spinner } from "../ui/spinner";
import { pushToSubmiussionPipeline, startPolling } from "@/lib/api";
import { useParams } from "react-router-dom";
import type { BackendResult } from "@/types/submit";

type CodeEditorProps = {
  language?: string;
  initialCode?: string;
  result: BackendResult
};

export default function CodeEditor({
  language = "javascript",
  initialCode = EXPRESS_BOILERPLATE,
}: CodeEditorProps) {
  const { theme } = useTheme()
  const { id } = useParams();
  const [code, setCode] = useState(initialCode);
  const [submitLoading, setSubmitLoading] = useState(false)

  const handleSubmit = async () => {
    setSubmitLoading(true);
    try {
      const res = await pushToSubmiussionPipeline(id, language, code);
      console.log("something in the way", res);
      const testRes = await startPolling(id);
      console.log(testRes);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-4 border-b bg-background">
        <div className="text-sm font-mono text-muted-foreground">
          src/app.js
        </div>

        <Button
          variant={"default"}
          size="sm"
          onClick={handleSubmit}
          className="font-mono bg-green-600 hover:bg-green-500 text-secondary"
          disabled={submitLoading}
        >
          {
            submitLoading ? <Spinner data-icon="inline-start" /> : <Play />
          }
          {" "}
          Submit
        </Button>
      </div>

      {/* EDITOR */}
      <div className="flex-1">
        <Editor
          height="100%"
          language={language}
          value={code}
          theme={theme === "light" ? "vs-light" : "vs-dark"}
          onChange={(value) => setCode(value ?? "")}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  );
}
