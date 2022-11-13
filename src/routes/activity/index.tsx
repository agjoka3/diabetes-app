import { component$ } from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";
import { Activities } from "~/components/activities/activities";

export default component$(() => {
  return (
    <div>
      <h3>Welcome to Activity Module!</h3>
      <Activities></Activities>
    </div>
  );
});
export const head: DocumentHead = {
  title: "Activity Module",
};
