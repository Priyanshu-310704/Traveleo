import api from "./api";

/* Trips */
export const getTrips = () => api.get("/trips");

/* Expenses by trip */
export const getExpensesByTrip = (tripId) =>
  api.get(`/expenses/${tripId}`);

/* Budget by trip */
export const getBudgetByTrip = (tripId) =>
  api.get(`/budgets/trip/${tripId}`);
