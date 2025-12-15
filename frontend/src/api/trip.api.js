import api from "./api";

export const createTrip = (data) => {
  return api.post("/trips", {
    title: data.title,
    destination: data.destination,
    start_date: data.start_date,
    end_date: data.end_date,
    total_budget: data.total_budget, // 🔥 REQUIRED
  });
};
