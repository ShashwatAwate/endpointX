import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const mockResult = {
  status: "passed",
  language: "JavaScript",
  framework: "Express",
  submittedAt: "2026-02-11 10:30 AM",
  summary: { total: 20, passed: 10, failed: 12 },
  tests: Array.from({ length: 20 }).map((_, i) => ({
    status: i % 3 !== 0 ? "passed" : "failed",
    name: `PUT /products/{sku} › Returns 404 for non-existent product #${i + 1}`,
    message: "Product not found for the given SKU.",
  })),
};

export default function Result() {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* HEADER */}
      <div className="p-3 border-b shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Submission Result</h2>
          <Badge variant="destructive">{mockResult.status}</Badge>
        </div>

        <div className="mt-1 text-[11px] text-muted-foreground flex gap-3">
          <span>{mockResult.language}</span>
          <span>{mockResult.framework}</span>
          <span>{mockResult.submittedAt}</span>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="px-3 py-2 grid grid-cols-3 gap-2 text-center shrink-0">
        <Summary label="Total" value={mockResult.summary.total} />
        <Summary label="Passed" value={mockResult.summary.passed} color="green" />
        <Summary label="Failed" value={mockResult.summary.failed} color="red" />
      </div>

      <Separator />

      {/* TESTS (ONLY THIS SCROLLS) */}
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          <div className="px-3 py-3">
            <Accordion type="multiple" className="space-y-2 pb-2">
              {mockResult.tests.map((test, index) => (
                <AccordionItem
                  key={index}
                  value={`test-${index}`}
                  className="border rounded-md"
                >
                  <AccordionTrigger className="px-3 py-2 hover:no-underline">
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-medium text-left">
                        {test.name}
                      </span>
                      <Badge
                        variant="outline"
                        className={`ml-2 ${test.status === "passed"
                          ? "border-green-500 text-green-600"
                          : "border-red-500 text-red-600"
                          }`}
                      >
                        {test.status.toUpperCase()}
                      </Badge>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="px-3 pb-3">
                    <pre className="text-[11px] whitespace-pre-wrap bg-muted p-2 rounded text-red-600 dark:text-red-300">
                      {test.message}
                    </pre>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

/* ---------------- SMALL SUMMARY CARD ---------------- */

function Summary({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color?: "red" | "green";
}) {
  return (
    <Card>
      <CardContent className="py-2">
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <p
          className={`text-sm font-semibold ${color === "red"
            ? "text-red-600"
            : color === "green"
              ? "text-green-600"
              : ""
            }`}
        >
          {value}
        </p>
      </CardContent>
    </Card>
  );
}
