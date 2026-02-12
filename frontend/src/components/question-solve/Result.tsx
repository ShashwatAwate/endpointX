import Summary from "./Summary";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { SubmitResult } from "@/types/submit";

export default function Result({ result }: { result: SubmitResult | undefined }) {
  if (!result) {
    return <h1 className="text-xl">No Result</h1>
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* HEADER */}
      <div className="p-3 border-b shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Submission Result</h2>
          <Badge variant="destructive">{result.status}</Badge>
        </div>

        <div className="mt-1 text-[11px] text-muted-foreground flex gap-3">
          <span>{result.language}</span>
          <span>{result.framework}</span>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="px-3 py-2 grid grid-cols-3 gap-2 text-center shrink-0">
        <Summary label="Total" value={result.test_results.numTotalTests} />
        <Summary label="Passed" value={result.test_results.numPassedTests} color="green" />
        <Summary label="Failed" value={result.test_results.numFailedTests} color="red" />
      </div>

      <Separator />

      {/* TESTS (ONLY THIS SCROLLS) */}
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          <div className="px-3 py-3">
            <Accordion type="multiple" className="space-y-2 pb-2">
              {result.test_results.testResults[0].assertionResults?.map((test, i) => (
                <AccordionItem
                  key={i}
                  value={`test-${i}`}
                  className="border rounded-md"
                >
                  <AccordionTrigger className="px-3 py-2 hover:no-underline">
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-medium text-left">
                        {test.fullName}
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
                      {test.duration}
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
