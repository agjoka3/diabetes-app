import {
  component$,
  useStore,
  useStylesScoped$,
  $,
  useResource$,
  Resource,
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
    weight: 1,
    mDate: new Date().valueOf(),
    submitCount: 0,
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
        userId: "TUJztX9XaaIsM7EiEZp3", // TODO: set user id
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
      newData.push({ ...r.data(), id: r.id } as any);
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
      <div style="float: rigth, border: 1px solid black; width: 30px">
        <button
          id="submitBtn"
          onClick$={submitWeight}
          style={"background: white;  border: none;"}
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
            <div style={{ maxHeight: "250px", overflow: "scroll" }}>
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
