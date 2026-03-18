export function formatWorkoutDate(
  dateString: string,
  style: "short" | "long" = "short"
) {
  if (!dateString) return "";

  const [year, month, day] = dateString.split("-").map(Number);
  if (!year || !month || !day) return dateString;

  const localDate = new Date(year, month - 1, day);

  if (style === "long") {
    return localDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  const monthName = localDate.toLocaleString("en-US", { month: "short" });
  const dayNum = localDate.getDate();
  const yearNum = localDate.getFullYear();

  const suffix =
    dayNum % 10 === 1 && dayNum !== 11
      ? "st"
      : dayNum % 10 === 2 && dayNum !== 12
      ? "nd"
      : dayNum % 10 === 3 && dayNum !== 13
      ? "rd"
      : "th";

  return `${monthName} ${dayNum}${suffix}, ${yearNum}`;
}