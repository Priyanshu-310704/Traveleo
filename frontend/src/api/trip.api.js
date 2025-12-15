import api from "./api";

/* ================= TRIPS ================= */

export const createTrip = (data) => {
  return api.post("/trips", {
    title: data.title,
    destination: data.destination,
    start_date: data.start_date,
    end_date: data.end_date,
    total_budget: data.total_budget, // REQUIRED
  });
};

export const deleteTrip = (tripId) => {
  return api.delete(`/trips/${tripId}`);
};

export const getTripById = (tripId) => {
  return api.get(`/trips/${tripId}`);
};

/* ================= EXPENSES ================= */

export const getExpensesByTrip = (tripId) => {
  return api.get(`/trips/${tripId}/expenses`);
};

export const addExpense = (data) => {
  return api.post("/expenses", {
    trip_id: data.trip_id,
    category_id: data.category_id,
    amount: data.amount,
    description: data.description,
    expense_date: data.expense_date,
  });
};
