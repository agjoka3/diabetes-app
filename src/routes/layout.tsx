import { component$, Slot } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import Header from "../components/header/header";

export default component$(() => {
  return (
    <>
      <main>
        <section>
          <div style={{ height: "500px" }}>
            <Header />
            <div
              class="sidebar"
              style={{
                marginBottom: "30px",
                height: "450px",
                border: "1px solid blue",
                width: "150px",
                display: "block",
                position: "absolute",
              }}
            >
              <ul>
                <li>
                  <Link href="/">Dashboard</Link>
                </li>
                <li>
                  <Link href="/nutrition">Nutrition</Link>
                </li>
                <li>
                  <Link href="/activity">Activity</Link>
                </li>
                <li>
                  <p>Measurements</p>
                  <ul>
                    <li><Link href="/measurement/weight">Weight</Link></li>
                    <li><Link href="/measurement/blood-sugar">Blood Sugar</Link></li>
                  </ul>
                </li>
              </ul>
            </div>

            <div
              style={{
                marginLeft: "150px",
                height: "450px",
                display: "block",
                border: "1px solid black",
                padding: "0 10px",
              }}
            >
              <Slot />
            </div>
          </div>
        </section>
      </main>
      <footer></footer>
    </>
  );
});
