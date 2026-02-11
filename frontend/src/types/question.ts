export interface RequestField {
  type: "string" | "number" | "boolean";
  nullable: boolean;
  required: boolean;
  max_length: number | null;
  allow_empty: boolean;
}

export interface ApiSpec {
  path: string;
  title: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  request: Record<string, RequestField>;
}

export interface Question {
  id: string;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  api_spec: ApiSpec[];
  entry_point: string | null;
  created_at: string
}
