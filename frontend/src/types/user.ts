export type User = {
  id: string;
  email: string;
  name?: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  email: string;
  password: string;
  name?: string;
};
