import { component$ } from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";
import Weight from "~/components/weight/weight";

export default component$(() => {
  return (
    <div>
      <h3>Welcome to Weight Module!</h3>
      <Weight></Weight>
    </div>
  );
});
export const head: DocumentHead = {
  title: "Weight Module",
};
