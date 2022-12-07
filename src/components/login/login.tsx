import { component$, useStore, useStylesScoped$, $ } from "@builder.io/qwik";
import styles from "./login.css?inline";
import { Link, useNavigate } from "@builder.io/qwik-city";
import { logInWithEmailAndPassword, signInWithGoogle } from "~/firebase";

export default component$(() => {
  useStylesScoped$(styles);
  const nav = useNavigate();

  const state = useStore({
    email: "",
    password: "",
  });

  const setEmail = $((value: string) => {
    state.email = value;
  });
  const setPassword = $((value: string) => {
    state.password = value;
  });

  const authWithEmail = $(async () => {
    await logInWithEmailAndPassword(state.email, state.password);
    nav.path = "/nutrition";
  });

  return (
    <div class="login">
      <div class="login__container">
        <input
          type="text"
          class="login__textBox"
          value={state.email}
          onChange$={(e) => setEmail(e.target.value)}
          placeholder="E-mail Address"
        />
        <input
          type="password"
          class="login__textBox"
          value={state.password}
          onChange$={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button class="login__btn" type="submit" onClick$={authWithEmail}>
          Login
        </button>
        <div>
          Don't have an account? <Link href="/register">Register</Link> now.
        </div>
      </div>
    </div>
  );
});
