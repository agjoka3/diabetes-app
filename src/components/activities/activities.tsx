import {
  component$,
  Resource,
  useMount$,
  useResource$,
  useStore,
  useStylesScoped$,
  $,
  useClientEffect$,
} from "@builder.io/qwik";
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "~/firebase";
import { Unit } from "../models/unit.model";
import { Activity, ActivityRow } from "./activity.model";
import { Exercise } from "./exercise.model";
import styles from "./activities.css?inline";

export const Activities = component$(() => {
  useStylesScoped$(styles);
  const state = useStore({
    activities: [] as ActivityRow[],
    exercises: [] as Exercise[],
    units: [] as Unit[],
    exercise: undefined,
    exerciseLength: undefined,
    exerciseDate: new Date(),
    submitActivity: 0,
    user: "",
  });

  useClientEffect$(() => {
    state.user = String(localStorage.getItem("uid"));
    state.submitActivity += 1;
  });

  const handleInputChange = $((event: any) => {
    const target = event.target;
    const value =
      target.type === "checkbox"
        ? target.checked
        : target.type === "date"
        ? new Date(target.value)
        : target.value;
    const name: "exercise" | "exerciseLength" = target.name;
    console.log("Set date: ", value, target.type);
    state[name] = value;
  });

  useMount$(async () => {
    const colRefUnits = collection(db, "units");
    (await getDocs(colRefUnits)).forEach((r) =>
      state.units.push(r.data() as Unit)
    );

    const colRefExercises = collection(db, "exercises");
    (await getDocs(colRefExercises)).forEach((r) =>
      state.exercises.push(r.data() as Exercise)
    );
  });

  const submitActivity = $(async () => {
    state.submitActivity += 1;
    try {
      const exerciseCalories = state.exercises.find(
        (e) => e.id === state.exercise
      );
      const calories =
        (Number(state?.exerciseLength) / Number(exerciseCalories?.time)) *
        Number(exerciseCalories?.calories);
      await addDoc(collection(db, "activity"), {
        exerciseId: state.exercise,
        calories: Math.floor(calories).toFixed(2),
        time: state.exerciseLength,
        timeUnitId: "mpxXv1SsnDx334cNs351", // default to min
        userId: state.user,
        date: state.exerciseDate.valueOf(),
      });
    } catch (err) {
      alert(err);
    }
  });

  const activityResource: any = useResource$(async ({ track }) => {
    track(() => state.submitActivity);
    const colRef = collection(db, "activity");
    const res = await getDocs(query(colRef, orderBy("date", "desc")));
    const data = [] as ActivityRow[];
    res.forEach((r) => {
      // TODO: Fix query - composite indexes
      if ((r.data() as Activity).userId == state.user) {
        const activity = r.data() as Activity;
        const exercise = String(
          state.exercises.find((f) => f.id == activity.exerciseId)?.name
        );
        const unit = String(
          state.units.find((u) => u.id == activity.timeUnitId)?.unit
        );
        data.push({ ...activity, exercise, unit });
      }
    });
    return data;
  });
  // TODO: Add new Activity
  return (
    <div>
      <Resource
        value={activityResource}
        onPending={() => <></>}
        onRejected={(error) => <>Error: {error.message}</>}
        onResolved={() => {
          return (
            <>
              <div style="float:left;margin-right:20px; margin-bottom: 10px">
                <label style="font-size: 12px" for="exercise">
                  Type
                </label>
                <select
                  style="width: 100px;"
                  name="exercise"
                  id="exercise"
                  value={state.exercise}
                  onChange$={handleInputChange}
                >
                  <option value="">-Select--</option>
                  {state.exercises.map((exercice) => {
                    return <option value={exercice.id}>{exercice.name}</option>;
                  })}
                </select>
              </div>
              <div style="float:left;margin-right:20px; width: 70px">
                <label style="font-size: 12px" for="exerciseLength">
                  Length
                </label>
                <input
                  style="width: 50px"
                  type="number"
                  id="exerciseLength"
                  value={state.exerciseLength}
                  name="exerciseLength"
                  onChange$={handleInputChange}
                />
              </div>
              <div style="float:left; margin-right:20px; width: 50px">
                <label style="font-size: 12px" for="exerciseDate">
                  Date
                </label>
                <input
                  type="date"
                  id="exerciseDate"
                  value={state.exerciseDate.toISOString().substring(0, 10)}
                  name="exerciseDate"
                  onChange$={handleInputChange}
                />
              </div>
              <div style="float: right; margin-right:15px; margin-top: 7px; width: 50px">
                <button
                  onClick$={submitActivity}
                  style={{
                    "background-color": "#04AA6D",
                    border: "none",
                    color: "white",
                    padding: "4px 8px",
                    "text-decoration": "none",
                    margin: "4px 2px",
                    cursor: "pointer",
                  }}
                >
                  Submit
                </button>
              </div>
            </>
          );
        }}
      ></Resource>
      <Resource
        value={activityResource}
        onPending={() => <>Loading...</>}
        onRejected={(error) => <>Error: {error.message}</>}
        onResolved={(repos: ActivityRow[]) => {
          return (
            <div
              style={{
                maxHeight: "250px",
                overflow: "scroll",
                clear: "both",
                marginTop: "20px",
              }}
            >
              <table id="acitivity" style={{ width: 700 }}>
                <thead>
                  <tr>
                    <th style={{ width: 100 }}>Activity</th>
                    <th style={{ width: 100 }}>Time</th>
                    <th>Calories</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {repos.map((repo) => {
                    return (
                      <tr>
                        <td>{repo.exercise}</td>
                        <td>
                          {repo.time} {repo.unit}
                        </td>
                        <td>{Math.floor(repo.calories).toFixed(2)}</td>
                        <td>
                          {new Date(repo.date).toISOString().substring(0, 10)}
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
