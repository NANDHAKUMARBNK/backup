export const createEvent = (events: any) => {
  console.log(events);
  const formatDate = (date: Date): string => {
    if (!date) {
      return "";
    }
    const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    const month =
      date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    const year = date.getFullYear();
    const hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    const minutes =
      date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    const seconds =
      date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    return `${year}${month}${day}T${hour}${minutes}${seconds}`;
  };
  let VCALENDAR = `BEGIN:VCALENDAR
  PRODID:-//Events Calendar//HSHSOFT 1.0//DE
  VERSION:2.0
  `;
  let a: any = "";
  for (const event of events) {
    a =
      "BEGIN:VCALENDAR\n" +
      "CALSCALE:GREGORIAN\n" +
      "METHOD:PUBLISH\n" +
      "PRODID:-//Test Cal//EN\n" +
      "VERSION:2.0\n" +
      "BEGIN:VEVENT\n" +
      "UID:test-1\n" +
      "DTSTART;VALUE=DATE:" +
      event.start.toISOString() +
      "\n" +
      "DTEND;VALUE=DATE:" +
      event.end.toISOString() +
      "\n" +
      "SUMMARY:" +
      event.summary +
      "\n" +
      "DESCRIPTION:" +
      event.description +
      "\n" +
      "LOCATION:" +
      event.location +
      "\n" +
      "URL:" +
      event.url +
      "\n" +
      "END:VEVENT\n" +
      "END:VCALENDAR";
  }
  VCALENDAR += `END:VCALENDAR`;
  return a;
};
export const download = (filename: any, text: any) => {
  const element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);
  element.setAttribute("target", "_blank");
  element.style.display = "none";
  element.click();
};
