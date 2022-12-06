import { component$, Slot } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import Header from "../components/header/header";

export default component$(() => {
  return (
    <>
      <main>
        <section>
          <div style={{ height: "500px" }}>
              <Slot />
          </div>
        </section>
      </main>
      <footer></footer>
    </>
  );
});
