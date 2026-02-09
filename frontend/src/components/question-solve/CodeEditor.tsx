import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "../ui/button";
import { useTheme } from "../theme-provider";

type CodeEditorProps = {
  language?: string;
  initialCode?: string;
};

const EXPRESS_BOILERPLATE = `const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

/*
| Start writing your handlers from here 
| Example:
| app.post("/api/example", (req, res) => {
|   res.json({ message: "Hello World" });
| });
*/

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
`;

export default function CodeEditor({
  language = "javascript",
  initialCode = EXPRESS_BOILERPLATE,
}: CodeEditorProps) {
  const { theme } = useTheme()

  const [code, setCode] = useState(initialCode);

  const handleSubmit = () => {
    console.log("Submitted code:");
    console.log(code);
  };

  return (
    <div className="h-full flex flex-col">
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-4 border-b bg-background">
        <div className="text-sm font-mono text-muted-foreground">
          src/app.js
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleSubmit}
          className="font-mono"
        >
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
