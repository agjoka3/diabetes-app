import { component$, Slot, useClientEffect$, $ } from "@builder.io/qwik";
import { Link, useNavigate } from "@builder.io/qwik-city";
import { onAuthStateChanged } from "firebase/auth";
import Header from "~/components/header/header";
import { auth } from "~/firebase";

export default component$(() => {
  const nav = useNavigate();
  useClientEffect$(() => {
    onAuthStateChanged(auth, (user: any) => {
      if (!user) {
        nav.path = "/login";
      }
    });
  });
  return (
    <>          <div style={{ height: "300px" }}>
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
                  <Link href="/weight">Weight</Link>
                </li>
                <li>
                  <Link href="/blood-sugar">Blood Sugar</Link>
                </li>
                <li>
                  <Link href="/appointment">Appointments</Link>
                </li>
              </ul>
            </div>
            <div style={{ marginLeft: "170px"}}>
                    <Slot></Slot>
            </div>
      </div>
    </>
  );
});
