import axios from "axios";

// This file will interact with our backend

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export async function register({ username, email, password }) {
  try {
    const response = await api.post("/api/auth/register", {
      username,
      email,
      password, // the data which we have to sent
    });

    return response.data;
  } catch (err) {
    console.log("Error during register (F) : " + err);
  }
}

export async function login({ email, password }) {
  try {
    const response = await api.post("/api/auth/login", {
      email,
      password, // the data which we want to sent
    });

    return response.data;
  } catch (err) {
    console.log("Error during login (F) : " + err);
    throw err;
  }
}

export async function logout() {
  try {
    const response = await api.get("/api/auth/logout");

    return response.data;
  } catch (err) {
    console.log("Error during logout (F) : " + err);
  }
}

export async function getMe() {
  try {
    const response = await api.get("/api/auth/get-me");

    return response.data;
  } catch (err) {
    console.log("Error during getMe (F) : " + err);
  }
}
