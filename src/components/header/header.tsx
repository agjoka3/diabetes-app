import { component$, useStylesScoped$ } from "@builder.io/qwik";
import styles from "./header.css?inline";

export default component$(() => {
  useStylesScoped$(styles);

  return (
    <header>
      <h3>Welcome to Diabetes App!</h3>

      <button
        style={{ height: "25px", marginTop: "20px", marginLeft: "350px" }}
      >
        Log out
      </button>
    </header>
  );
});
