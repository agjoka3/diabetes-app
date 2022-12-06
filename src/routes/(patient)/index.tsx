import { component$ } from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";
import News from "~/components/news/news";
import { Reminders } from "~/components/reminders/reminders";

export default component$(() => {

  return (
    <div>
      <h3>Welcome to Dashboard!</h3>
      <News></News>
      <h4 style={{ margin: "5px" }}>Reminders</h4>
      <Reminders
        displayAddReminder={false}
        limitReminders={5}
        showOnlyFutureReminder={true}
      ></Reminders>
    </div>
  );
});
export const head: DocumentHead = {
  title: "Dashboard",
};
