import { component$, useStore, useStylesScoped$, $ } from "@builder.io/qwik";
import styles from "./register.css?inline";
import { Link } from "@builder.io/qwik-city";
import { registerWithEmailAndPassword, signInWithGoogle } from "~/firebase";

export default component$(() => {
  useStylesScoped$(styles);

  const state = useStore({
    email: "",
    password: "",
    name: "",
    user: undefined,
  });

  const setName = $((value: string) => {
    state.name = value;
  });
  const setEmail = $((value: string) => {
    state.email = value;
  });
  const setPassword = $((value: string) => {
    state.password = value;
  });

  // TODO: Add Validation

  const registerWithEmail = $(() =>
    registerWithEmailAndPassword(state.name, state.email, state.password)
  );

  return (
    <div className="register">
      <div class="register__container">
        <input
          type="text"
          class="register__textBox"
          value={state.name}
          onChange$={(e) => setName(e.target.value)}
          placeholder="Full Name"
        />
        <input
          type="text"
          class="register__textBox"
          value={state.email}
          onChange$={(e) => setEmail(e.target.value)}
          placeholder="E-mail Address"
        />
        <input
          type="password"
          class="register__textBox"
          value={state.password}
          onChange$={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button class="register__btn" onClick$={() => registerWithEmail}>
          Register
        </button>
        <button
          class="register__btn register__google"
          onClick$={$(signInWithGoogle)}
        >
          Register with Google
        </button>
        <div>
          Already have an account? <Link href="/login">Login</Link> now.
        </div>
      </div>
    </div>
  );
});
