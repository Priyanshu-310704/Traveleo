import api from "./api";

/* ================================
   GET ALL CATEGORIES
================================ */
export const getCategories = () => {
  return api.get("/categories");
};

/* ================================
   CREATE NEW CATEGORY
================================ */
export const createCategory = (data) => {
  // data = { name: "Food" }
  return api.post("/categories", data);
};
