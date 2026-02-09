import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Question } from "@/data/questions";
import { useNavigate } from "react-router-dom";

type Props = {
  question: Question;
};

export function QuestionCard({ question }: Props) {
  const navigate = useNavigate();

  return (
    <Card className="group border-border/60 hover:border-primary/40 transition-all" onClick={() => navigate(`/question/${question.id}`)}>
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-base font-mono tracking-tight">
            {question.title}
          </CardTitle>

          {question.difficulty && (
            <Badge
              variant={
                question.difficulty === "Easy"
                  ? "secondary"
                  : question.difficulty === "Medium"
                    ? "default"
                    : "destructive"
              }
              className="font-mono text-xs"
            >
              {question.difficulty.toUpperCase()}
            </Badge>
          )}
        </div>

        <Separator />
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          {question.description}
        </p>

        {/* API-style meta */}
        <div className="rounded-md bg-muted px-3 py-2 text-xs font-mono space-y-1">
          {question.entry_point && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">entry_point</span>
              <span className="text-foreground">
                {question.entry_point}
              </span>
            </div>
          )}

          <div className="flex justify-between">
            <span className="text-muted-foreground">created_at</span>
            <span className="text-foreground">
              {new Date(question.created_at).toISOString().slice(0, 10)}
            </span>
          </div>
        </div>

        {/* CTA-ish hint */}
        <div className="text-xs text-muted-foreground group-hover:text-primary transition-colors font-mono">
          → view spec
        </div>
      </CardContent>
    </Card>
  );
}
