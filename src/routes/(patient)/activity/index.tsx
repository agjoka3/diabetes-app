import { component$, $ } from "@builder.io/qwik";
import { DocumentHead, useNavigate } from "@builder.io/qwik-city";
import { onAuthStateChanged } from "firebase/auth";
import { Activities } from "~/components/activities/activities";
import { auth } from "~/firebase";

export default component$(() => {
  /*   const nav = useNavigate();
  const authHandler = $((user: any) => {
      if (!user) {
          nav.path = '/login'
      }
  });

  onAuthStateChanged(auth, authHandler);  */

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
