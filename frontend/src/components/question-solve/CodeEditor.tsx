import { useState, type Dispatch, type SetStateAction } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "../ui/button";
import { useTheme } from "../theme-provider";
import { Play } from "lucide-react";
import { Spinner } from "../ui/spinner";

type CodeEditorProps = {
  language: string;
  code: string;
  setCode: Dispatch<SetStateAction<string>>;
  handleSubmit: () => Promise<void>;
  submitLoading: boolean;
};

export default function CodeEditor({
  language = "javascript",
  code,
  setCode,
  handleSubmit,
  submitLoading,
}: CodeEditorProps) {
  const { theme } = useTheme()

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
