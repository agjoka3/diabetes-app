import { component$ } from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";
import { Activities } from "~/components/activities/activities";

export default component$(() => {
  return (
    <div>
      <h3>Welcome to Weight Module!</h3>
    </div>
  );
});
export const head: DocumentHead = {
  title: "Weight Module",
};
