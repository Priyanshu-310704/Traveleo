import api from "./api";

export const getBudgetByTrip = (tripId) =>
  api.get(`/trips/${tripId}/budget`);

export const getTrips = () =>
  api.get("/trips");

export const getExpensesByTrip = (tripId) =>
  api.get(`/trips/${tripId}/expenses`);
