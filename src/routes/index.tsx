import { component$ } from "@builder.io/qwik";
import { DocumentHead, useNavigate } from "@builder.io/qwik-city";
import { onAuthStateChanged } from "firebase/auth";
import News from "~/components/news/news";
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
      <h3>Welcome to Dashboard!</h3>
      <News></News>
      <p>Reminders</p>
      <Reminders displayAddReminder={false} limitReminders={5} showOnlyFutureReminder={true}></Reminders>
    </div>
  );
});
export const head: DocumentHead = {
  title: "Dashboard",
};
