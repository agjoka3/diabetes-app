import { component$ } from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";
import Register from "~/components/register/register";

export default component$(() => {
  return (
    <div>
      <Register></Register>
    </div>
  );
});
export const head: DocumentHead = {
  title: "Register",
};
