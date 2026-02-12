import { useParams } from "react-router-dom";

import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";

import type { Question } from "@/types/question";
import QuestionDetail from "@/components/question-solve/QuestionDetail";
import { EXPRESS_BOILERPLATE } from "@/data/code-editor";
import CodeEditor from "@/components/question-solve/CodeEditor";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Result from "@/components/question-solve/Result";
import { getQuestionById } from "@/lib/api";
import { startPolling } from "@/lib/api";
import type { SubmitResult } from "@/types/submit";

export default function QuestionSolve() {
  const { id } = useParams();
  const [question, setQuestion] = useState<Question>();
  const [questionLoading, setQuestionLoading] = useState(false)
  const [submitResult, setSubmitResult] = useState<SubmitResult>();
  const [qWindow, setQWindow] = useState(true)
  const [code, setCode] = useState(EXPRESS_BOILERPLATE)
  const [submitLoading, setSubmitLoading] = useState(false)

  const language = "javascript"

  useEffect(() => {
    const fetchQuestions = async () => {
      setQuestionLoading(true)
      try {
        const q = await getQuestionById(id)
        setQuestion(q)
        console.log(q)
      } catch (e) {
        console.error(e)
      } finally {
        setQuestionLoading(false)
      }
    }

    fetchQuestions()
  }, [])

  const handleSubmit = async () => {
    setSubmitLoading(true);
    try {
      console.log("NOTE: UNCOMMENT THE SUBMISSION PIPELINE SO THAT IT WILL WORK")
      // const res = await pushToSubmiussionPipeline(id, language, code);
      // console.log("something in the way", res);
      const testRes: SubmitResult | null = await startPolling(id);
      if (testRes === null) {
        throw new Error("no test result")
      }
      console.log(testRes);
      setSubmitResult(testRes)
    } finally {
      setSubmitLoading(false);
    }
  };

  const setQuestionWindow = () => {
    setQWindow(true)
  }

  const setResultWindow = () => {
    setQWindow(false)
  }

  return (
    < div className="h-[90vh]" >
      <ResizablePanelGroup>
        {/* LEFT – QUESTION */}
        <ResizablePanel defaultSize="40%" minSize="30%">
          <div className="py-3.5 border-b bg-background">
            <Button variant={"ghost"} className="rounded-none" onClick={setQuestionWindow}>Question</Button>
            <Button variant={"ghost"} className="rounded-none" onClick={setResultWindow}>Result</Button>
          </div>
          {
            qWindow ? <QuestionDetail questionLoading={questionLoading} question={question} /> : <Result result={submitResult} />
          }

        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* RIGHT – EDITOR */}
        <ResizablePanel defaultSize="60%" minSize="30%">
          <CodeEditor language={language} code={code} setCode={setCode} handleSubmit={handleSubmit} submitLoading={submitLoading} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div >
  );
}
