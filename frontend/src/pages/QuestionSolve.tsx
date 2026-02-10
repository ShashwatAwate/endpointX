import { useParams } from "react-router-dom";

import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";

import { questions } from "@/data/questions";
import QuestionDetail from "@/components/question-solve/QuestionDetail";
import CodeEditor from "@/components/question-solve/CodeEditor";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Result from "@/components/question-solve/Result";

export default function QuestionSolve() {
  const { id } = useParams();
  const question = questions.find((q) => q.id === id);
  const [qWindow, setQWindow] = useState(true)

  const setQuestionWindow = () => {
    setQWindow(true)
  }

  const setResultWindow = () => {
    setQWindow(false)
  }

  if (!question) {
    return (
      <div className="p-6 text-muted-foreground">
        Question not found
      </div>
    );
  }

  return (
    <div className="h-[90vh]">
      <ResizablePanelGroup>
        {/* LEFT – QUESTION */}
        <ResizablePanel defaultSize="40%" minSize="30%">
          <div className="py-3.5 border-b bg-background">
            <Button variant={"ghost"} className="rounded-none" onClick={setQuestionWindow}>Question</Button>
            <Button variant={"ghost"} className="rounded-none" onClick={setResultWindow}>Result</Button>
          </div>
          {
            qWindow ? <QuestionDetail question={question} /> : <Result />
          }

        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* RIGHT – EDITOR */}
        <ResizablePanel defaultSize="60%" minSize="30%">
          <CodeEditor />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
