import { component$ } from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";
import { Nutritions } from "~/components/nutritions/nutrition";

export default component$(() => {
  return (
    <div>
      <h3>Welcome to Nutrition!</h3>
      <Nutritions></Nutritions>
    </div>
  );
});
export const head: DocumentHead = {
  title: "Dashboard",
};
