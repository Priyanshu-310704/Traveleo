import api from "./api";

/* Create budget for a trip */
export const createBudget = (tripId, data) => {
  return api.post(`/trips/${tripId}/budget`, data);
};

/* Get budget for a trip */
export const getBudgetByTrip = (tripId) => {
  return api.get(`/trips/${tripId}/budget`);
};
