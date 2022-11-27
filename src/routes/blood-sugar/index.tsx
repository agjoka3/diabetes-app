import { component$ } from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";
import Bslevel from "~/components/bslevel/bslevel";

export default component$(() => {
  return (
    <div>
      <h3>Welcome to Blood Sugar Module!</h3>
      <Bslevel></Bslevel>
    </div>
  );
});
export const head: DocumentHead = {
  title: "Blood Sugar Module",
};
