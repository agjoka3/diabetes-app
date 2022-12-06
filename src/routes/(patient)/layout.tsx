import { component$, Slot, useClientEffect$, $ } from "@builder.io/qwik";
import { Link, useNavigate } from "@builder.io/qwik-city";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "~/firebase";

export default component$(() => {
  const nav = useNavigate();
  useClientEffect$(() => {
    onAuthStateChanged(auth, (user: any) => {
      console.log("USER: ", user);
      if (!user) {
        nav.path = "/login";
      }
    });
  });
  return (
    <>
      <Slot></Slot>
    </>
  );
});
