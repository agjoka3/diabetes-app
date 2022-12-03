import { component$ } from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";
import { Reminders } from "~/components/reminders/reminders";

export default component$(() => {
  return (
    <div>
      <Reminders displayAddReminder={true} limitReminders={null} showOnlyFutureReminder={false}></Reminders>
    </div>
  );
});
export const head: DocumentHead = {
  title: "Reminders Module",
};
