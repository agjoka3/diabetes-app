import { component$ } from "@builder.io/qwik";
import { DocumentHead, useNavigate } from "@builder.io/qwik-city";
import { onAuthStateChanged } from "firebase/auth";
import { Reminders } from "~/components/reminders/reminders";
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
      <Reminders displayAddReminder={true} limitReminders={null} showOnlyFutureReminder={false}></Reminders>
    </div>
  );
});
export const head: DocumentHead = {
  title: "Reminders Module",
};
