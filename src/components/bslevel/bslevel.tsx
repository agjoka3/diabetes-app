import {
  component$,
  useStore,
  useStylesScoped$,
  $,
  useResource$,
  Resource,
} from "@builder.io/qwik";
import styles from "./bslevel.css?inline";
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "~/firebase";
import { Measurement } from "../models/measurement.model";

export default component$(() => {
  useStylesScoped$(styles);
  const state = useStore({
    bslevel: undefined,
    mDate: new Date().valueOf(),
    submitLevel: 0
  });

  const handleInputChange = $((event: any) => {
    const target = event.target;
    const value =
      target.type === "date" ? new Date(target.value).valueOf() : target.value;
    const name: "bslevel" = target.name;
    state[name] = value;
  });

  const submit = $(async () => {
    state.submitLevel += 1;
    try {
      await addDoc(collection(db, "bslevel"), {
        mDate: state.mDate,
        value: Number(state.bslevel),
        userId: "TUJztX9XaaIsM7EiEZp3", // TODO: set user id
      });
    } catch (err) {
      alert(err);
    }
  });

  const resource: any = useResource$(async ( {track} ) => {
    track(() => state.submitLevel);
    const colRef = collection(db, "bslevel");
    const res = await getDocs(query(colRef, orderBy("mDate", "desc")));
    const data = [] as Measurement[];
    res.forEach((r) => {
      data.push(r.data() as Measurement);
    });

    return data;
  });

  return (
    <div>
      <Resource
        value={resource}
        onPending={() => <>Loading...</>}
        onRejected={(error) => <>Error: {error.message}</>}
        onResolved={(repos: Measurement[]) => {
          return (
            <div>
                <div style="float:left;margin-right:10px; margin-bottom: 20px">
                  <label style="font-size: 12px" for="bslevel">
                    Blood sugar level
                  </label>
                  <input
                    style="width: 100px"
                    type="number"
                    id="bslevel"
                    value={state.bslevel}
                    name="bslevel"
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
                    onClick$={submit}
                    style={"background: white;  border: none;"}
                  >
                    Submit
                  </button>
                </div>
              <table id="bslevel" style={{ width: 700 }}>
                <thead>
                  <tr>
                    <th style={{ width: 150 }}>Blood Sugar Level</th>
                    <th style={{ width: 100 }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {(repos || []).map((repo) => {
                    return (
                      <tr>
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
