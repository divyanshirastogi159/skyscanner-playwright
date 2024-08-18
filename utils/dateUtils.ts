export function parseDate(dateString: string): Date {
  const today = new Date();
  let resultDate: Date;

  if (dateString === "today") {
    resultDate = today;
  } else if (dateString.startsWith("today+")) {
    const daysToAdd = parseInt(dateString.split("+")[1], 10);
    resultDate = new Date(today);
    resultDate.setDate(today.getDate() + daysToAdd);
  } else {
    throw new Error(`Unsupported date format: ${dateString}`);
  }

  return resultDate;
}

export function formatDateForPicker(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString("en-GB", options);
}
