import { component$ } from "@builder.io/qwik";
import { DocumentHead, useNavigate } from "@builder.io/qwik-city";
import { onAuthStateChanged } from "firebase/auth";
import Bslevel from "~/components/bslevel/bslevel";
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
      <h3>Welcome to Blood Sugar Module!</h3>
      <Bslevel></Bslevel>
    </div>
  );
});
export const head: DocumentHead = {
  title: "Blood Sugar Module",
};
