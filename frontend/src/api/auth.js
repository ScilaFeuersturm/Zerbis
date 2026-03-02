import { http } from "./http.js";

export async function login({ email, password }) {
  return http("/auth/login", { method: "POST", body: { email, password } });
}

export async function register(payload) {
  return http("/auth/register", { method: "POST", body: payload });
}

export async function me(token) {
  return http("/users/me", { token });
}
