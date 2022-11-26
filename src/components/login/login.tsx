import { component$, useStore, useStylesScoped$, $ } from "@builder.io/qwik";
import styles from "./login.css?inline";
import { Link } from "@builder.io/qwik-city";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, signInWithGoogle, logInWithEmailAndPassword } from "~/firebase";

export default component$(() => {
  useStylesScoped$(styles);

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
  //const authWithEmail = (() => logInWithEmailAndPassword(state.email, state.password))

  return (
    <div className="login">
      <div className="login__container">
        <input
          type="text"
          className="login__textBox"
          value={state.email}
          onChange$={(e) => setEmail(e.target.value)}
          placeholder="E-mail Address"
        />
        <input
          type="password"
          className="login__textBox"
          value={state.password}
          onChange$={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button
          className="login__btn"
          // onClick$={() => $(authWithEmail)} FIXME
        >
          Login
        </button>
        <button
          className="login__btn login__google"
          onClick$={() => $(signInWithGoogle)}
        >
          Login with Google
        </button>
        <div>
          <Link href="/reset">Forgot Password</Link>
        </div>
        <div>
          Don't have an account? <Link href="/register">Register</Link> now.
        </div>
      </div>
    </div>
  );
});
