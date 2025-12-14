import api from "./api";

/* GET categories */
export const getCategories = async () => {
  const res = await api.get("/categories");
  return res;
};
