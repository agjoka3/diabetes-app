import { component$, useStore, useStylesScoped$, $ } from "@builder.io/qwik";
import styles from "./register.css?inline";
import { Link } from "@builder.io/qwik-city";
import { registerWithEmailAndPassword } from "~/firebase";

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
  const register = $(() => {
    alert('Registering user')
     $(() => registerWithEmailAndPassword(state.name, state.email, state.password));
  });
  return (
    <div className="register">
    <div className="register__container">
      <input
        type="text"
        className="register__textBox"
        value={state.name}
        onChange$={(e) => setName(e.target.value)}
        placeholder="Full Name"
      />
      <input
        type="text"
        className="register__textBox"
        value={state.email}
        onChange$={(e) => setEmail(e.target.value)}
        placeholder="E-mail Address"
      />
      <input
        type="password"
        className="register__textBox"
        value={state.password}
        onChange$={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button className="register__btn" 
        onClick$={register}>
        Register
      </button>
      <button
        className="register__btn register__google"
       // onClick$={() => $(signInWithGoogle)}
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
