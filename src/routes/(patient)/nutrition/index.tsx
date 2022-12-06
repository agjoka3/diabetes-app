import { component$ } from "@builder.io/qwik";
import { DocumentHead, useNavigate } from "@builder.io/qwik-city";
import { onAuthStateChanged } from "firebase/auth";
import { Nutritions } from "~/components/nutritions/nutrition";
import { auth } from "~/firebase";

export default component$(() => {
  /*   const nav = useNavigate();
  onAuthStateChanged(auth, ((user) => {
    if (!user) {
        nav.path = '/login'
    }
  }));  */

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
