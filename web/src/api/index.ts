import axios from "axios";

export const uploadServer = axios.create({
  baseURL: "http://localhost:3333",
});
