import { component$, Slot } from "@builder.io/qwik";

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
