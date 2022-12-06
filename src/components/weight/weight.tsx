import {
  component$,
  useStore,
  useStylesScoped$,
  $,
  useResource$,
  Resource,
  useClientEffect$,
} from "@builder.io/qwik";
import styles from "./weight.css?inline";
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "~/firebase";
import { Measurement } from "../models/measurement.model";

export const Weights = component$(() => {
  useStylesScoped$(styles);

  const state = useStore({
    weight: undefined,
    mDate: new Date().valueOf(),
    submitCount: 0,
    user: "",
  });

  useClientEffect$(() => {
    state.user = String(localStorage.getItem("uid"));
    state.submitCount += 1;
  });

  const handleInputChange = $((event: any) => {
    const target = event.target;
    const value =
      target.type === "date" ? new Date(target.value).valueOf() : target.value;
    const name: "weight" = target.name;
    state[name] = value;
  });

  const submitWeight = $(async (event: any) => {
    event.preventDefault();
    state.submitCount += 1;
    try {
      await addDoc(collection(db, "weight"), {
        mDate: state.mDate,
        value: Number(state.weight),
        userId: state.user,
      });
    } catch (err) {
      alert(err);
    }
  });

  const weightResource: any = useResource$(async ({ track }) => {
    track(() => state.submitCount);

    const colRef = collection(db, "weight");
    const res = await getDocs(query(colRef, orderBy("mDate", "desc")));

    const newData = [] as Measurement[];
    res.forEach((r) => {
      // TODO: Fix query - composite indexes
      if (r.data().userId == state.user) {
        newData.push({ ...r.data(), id: r.id } as any);
      }
    });

    return newData;
  });

  return (
    <div>
      <div style="float:left;margin-right:10px; margin-bottom: 20px">
        <label style="font-size: 12px" for="weight">
          Weight in kg
        </label>
        <input
          style="width: 80px"
          type="number"
          id="weight"
          value={state.weight}
          name="weight"
          onChange$={handleInputChange}
        />
      </div>
      <div style="float:left;margin-right:10px; margin-bottom: 20px">
        <label style="font-size: 12px" for="mDate">
          Date
        </label>
        <input
          type="date"
          id="mDate"
          value={new Date(state.mDate).toISOString().substring(0, 10)}
          name="mDate"
          onChange$={handleInputChange}
        />
      </div>
      <div style="float: right; margin-right:15px; margin-top: 7px; width: 50px">
        <button
          id="submitBtn"
          onClick$={submitWeight}
          style={{
            "background-color": "#04AA6D",
            border: "none",
            color: "white",
            padding: "4px 8px",
            "text-decoration": "none",
            margin: "4px 2px",
            cursor: "pointer",
          }}
          type="submit"
        >
          Submit
        </button>
      </div>
      <Resource
        value={weightResource}
        onPending={() => <>Loading...</>}
        onRejected={(error) => <>Error: {error.message}</>}
        onResolved={(repos: Measurement[]) => {
          return (
            <div
              style={{ maxHeight: "250px", overflow: "scroll", clear: "both" }}
            >
              <table id="weight" style={{ width: 700 }}>
                <thead>
                  <tr>
                    <th style={{ width: 150 }}>Weight</th>
                    <th style={{ width: 100 }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {(repos || []).map((repo) => {
                    return (
                      <tr key={repo.id}>
                        <td>{repo.value}</td>
                        <td>
                          {new Date(repo.mDate).toISOString().substring(0, 10)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        }}
      />
    </div>
  );
});
