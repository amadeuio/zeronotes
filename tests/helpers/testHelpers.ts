import request from "supertest";
import { v4 as uuidv4 } from "uuid";
import { createApp } from "../../src/app";

export const app = createApp();
export const api = request(app);

export async function registerUser(
  email: string = "test@example.com",
  password: string = "password123"
) {
  const response = await api.post("/api/auth/register").send({
    email,
    password,
  });
  return response;
}

export async function loginUser(
  email: string = "test@example.com",
  password: string = "password123"
) {
  const response = await api.post("/api/auth/login").send({
    email,
    password,
  });
  return response;
}

export async function getAuthToken(
  email: string = `test${Date.now()}@example.com`,
  password: string = "password123"
): Promise<string> {
  await registerUser(email, password);
  const loginResponse = await loginUser(email, password);
  return loginResponse.body.token;
}

export async function createNote(
  token: string,
  noteData: { id?: string; title?: string; content?: string } = {}
) {
  const response = await api
    .post("/api/notes")
    .set("Authorization", `Bearer ${token}`)
    .send({
      id: noteData.id || uuidv4(),
      title: noteData.title || "Test Note",
      content: noteData.content || "Test Content",
    });
  return response;
}

export async function createLabel(
  token: string,
  labelData: { id?: string; name: string; color?: string }
) {
  const response = await api
    .post("/api/labels")
    .set("Authorization", `Bearer ${token}`)
    .send({
      id: labelData.id || uuidv4(),
      name: labelData.name,
    });
  return response;
}

export function corruptTokenSignature(token: string): string {
  // JWT format: header.payload.signature
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid JWT token format");
  }

  const signature = parts[2];
  // Change the last character of the signature
  const modifiedSignature =
    signature.slice(0, -1) +
    (signature[signature.length - 1] === "a" ? "b" : "a");

  return `${parts[0]}.${parts[1]}.${modifiedSignature}`;
}
