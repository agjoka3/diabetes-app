import { component$ } from "@builder.io/qwik";
import { DocumentHead, useNavigate } from "@builder.io/qwik-city";
import { onAuthStateChanged } from "firebase/auth";
import { Weights } from "~/components/weight/weight";
import { auth } from "~/firebase";

export default component$(() => {
  const nav = useNavigate();
  onAuthStateChanged(auth, ((user) => {
    if (!user) {
        nav.path = '/login'
    }
  })); 
  
  return (
    <div>
      <h3>Welcome to Weight Module!</h3>
      <Weights></Weights>
    </div>
  );
});
export const head: DocumentHead = {
  title: "Weight Module",
};
