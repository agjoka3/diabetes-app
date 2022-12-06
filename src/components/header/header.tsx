import { component$, useStylesScoped$, $ } from "@builder.io/qwik";
import { logout } from "~/firebase";
import styles from "./header.css?inline";

export default component$(() => {
  useStylesScoped$(styles);

  const logUserOut = $(() => {
    logout();
  });

  return (
    <header>
      <h3>Welcome to Diabetes App!</h3>

      <button
        style={{ height: "25px", marginTop: "20px", marginLeft: "350px" }}
        onClick$={logUserOut}
      >
        Log out
      </button>
    </header>
  );
});
