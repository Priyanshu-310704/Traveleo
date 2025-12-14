export const formatDate = (dateString) => {
  if (!dateString) return "";

  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};
