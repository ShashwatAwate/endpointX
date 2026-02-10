import { useParams } from "react-router-dom";

import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";

import { questions } from "@/data/questions";
import QuestionDetail from "@/components/question-solve/QuestionDetail";
import CodeEditor from "@/components/question-solve/CodeEditor";

export default function QuestionSolve() {
  const { id } = useParams();
  const question = questions.find((q) => q.id === id);

  if (!question) {
    return (
      <div className="p-6 text-muted-foreground">
        Question not found
      </div>
    );
  }

  return (
    <div className="h-screen">
      <ResizablePanelGroup>
        {/* LEFT – QUESTION */}
        <ResizablePanel defaultSize={40} minSize={25}>
          <QuestionDetail question={question} />
        </ResizablePanel>

        <ResizableHandle />

        {/* RIGHT – EDITOR */}
        <ResizablePanel defaultSize={60} minSize={30}>
          <CodeEditor />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
