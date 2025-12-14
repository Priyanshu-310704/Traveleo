export default function Brand({ light = false, size = "md" }) {
  const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-4xl",
    xl: "text-5xl",
  };

  return (
    <h1
      className={`font-bold tracking-wide ${
        sizeClasses[size]
      } ${light ? "text-white" : "text-emerald-600"}`}
    >
      Trave<span className="text-green-400">Leo</span>
    </h1>
  );
}