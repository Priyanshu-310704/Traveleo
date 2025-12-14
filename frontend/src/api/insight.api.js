import api from "./api";

export const getTripInsights = (tripId) =>
  api.get(`/trips/${tripId}/insights`);
