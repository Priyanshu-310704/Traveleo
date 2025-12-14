import api from "./api";

export const createTrip = (data) =>
  api.post("/trips", data);
