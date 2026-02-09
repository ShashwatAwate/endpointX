export type Question = {
  id: string;
  title: string;
  description: string;
  difficulty?: string;
  api_spec?: Record<string, any>;
  entry_point?: string;
  created_at: string;
};

export const questions: Question[] = [
  {
    id: "b1c1a7e2-1a2b-4d3e-9f10-111111111111",
    title: "Build a REST API",
    description:
      "Create a REST API that supports CRUD operations for a blog application.",
    difficulty: "Easy",
    api_spec: {
      method: "POST",
      endpoint: "/api/posts",
    },
    entry_point: "index.js",
    created_at: "2026-02-01T10:30:00Z",
  },
  {
    id: "c2d2a7e2-2b3c-4d3e-9f10-222222222222",
    title: "Authentication System",
    description:
      "Implement JWT-based authentication with login and signup endpoints.",
    difficulty: "Medium",
    api_spec: {
      method: "POST",
      endpoint: "/api/auth/login",
    },
    entry_point: "server.ts",
    created_at: "2026-02-03T14:00:00Z",
  },
  {
    id: "d3e3a7e2-3c4d-4d3e-9f10-333333333333",
    title: "Rate Limiter",
    description:
      "Design and implement a rate limiter for an API using Redis.",
    difficulty: "Hard",
    api_spec: {
      algorithm: "token-bucket",
    },
    entry_point: "main.go",
    created_at: "2026-02-05T18:45:00Z",
  },
];
