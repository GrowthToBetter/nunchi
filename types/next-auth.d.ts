import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "STUDENT" | "TEACHER" | "PARENT" | "COUNSELOR";
    } & DefaultSession["user"];
  }
}
