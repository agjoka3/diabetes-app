import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import News from "~/components/news/news";
import { Reminders } from "~/components/reminders/reminders";

export default component$(() => {
  return (
    <div>
      <h3>Welcome to Dashboard!</h3>
      <News></News>
      <p>Reminders</p>
      <Reminders displayAddReminder={false} limitReminders={5} showOnlyFutureReminder={true}></Reminders>
    </div>
  );
});
export const head: DocumentHead = {
  title: "Dashboard",
};
