import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Question } from "@/types/question";

export default function QuestionDetail({ question }: { question: Question }) {
  return (
    <div className="h-full p-6 overflow-auto space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-mono font-semibold">
            {question.title}
          </h1>

          {question.difficulty && (
            <Badge variant="secondary" className="font-mono">
              {question.difficulty.toUpperCase()}
            </Badge>
          )}
        </div>

        <Separator />
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed">
        {question.description}
      </p>

      {question.api_spec && (
        <div className="space-y-2">
          <h2 className="font-mono text-muted-foreground">
            api_spec
          </h2>

          <pre className="rounded-md bg-accent text-accent-foreground p-3 font-mono overflow-x-auto">
            {JSON.stringify(question.api_spec, null, 2)}
          </pre>
        </div>
      )}

      <div className="space-y-1 text-xs font-mono text-muted-foreground">
        {question.entry_point && (
          <div>entry_point: {question.entry_point}</div>
        )}
        <div>
          created_at: {new Date(question.created_at).toISOString()}
        </div>
      </div>
    </div>
  );
}
