import api from "./api";

/* CREATE expense */
export const createExpense = (data) => {
  return api.post("/expenses", data);
};
