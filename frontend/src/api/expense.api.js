import api from "./api";

export const createExpense = (data) =>
  api.post("/expenses", data);
