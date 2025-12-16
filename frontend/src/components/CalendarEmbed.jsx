export default function CalendarEmbed() {
  return (
    <div className="w-full flex justify-center mt-10">
      <iframe
        src="https://calendar.google.com/calendar/embed?src=6f398d7d0a6f98b5503eb1b0872ad4b8c83af1467534879a24d046bd04e5bbb8%40group.calendar.google.com&ctz=Asia%2FKolkata"
        style={{ border: 0 }}
        width="1000"
        height="600"
        frameBorder="0"
        scrolling="no"
      ></iframe>
    </div>
  );
}
