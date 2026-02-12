import { Card, CardContent } from "../ui/card";

export default function Summary({
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
