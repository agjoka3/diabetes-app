import { component$ } from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";
import Login from "~/components/login/login";

export default component$(() => {
  return (
    <div>
      <h3>Welcome to Login!</h3>
      <Login></Login>
    </div>
  );
});
export const head: DocumentHead = {
  title: "Login",
};
