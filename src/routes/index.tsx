import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import News from "~/components/news/news";

export default component$(() => {
  return (
    <div>
      <h3>Welcome to Dashboard!</h3>
      <News></News>
    </div>
  );
});
export const head: DocumentHead = {
  title: "Dashboard",
};
