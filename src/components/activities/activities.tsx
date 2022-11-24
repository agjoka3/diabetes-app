import {
  component$,
  Resource,
  useMount$,
  useResource$,
  useStore,
  useStylesScoped$,
  $,
} from "@builder.io/qwik";
import { addDoc, collection, getDocs } from "firebase/firestore";
import db from "~/firebase";
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
    try {
      const exerciseCalories = state.exercises.find(
        (e) => e.id === state.exercise
      );
      const calories =
        (Number(state?.exerciseLength) / Number(exerciseCalories?.time)) *
        Number(exerciseCalories?.calories);
      await addDoc(collection(db, "activity"), {
        exerciseId: state.exercise,
        calories,
        time: state.exerciseLength,
        timeUnitId: "mpxXv1SsnDx334cNs351", // default to min
        userId: " TUJztX9XaaIsM7EiEZp3", // TODO: set user id,
        date: state.exerciseDate.getMilliseconds(),
      });
    } catch (err) {
      alert(err);
    }
  });

  const activityResource: any = useResource$(async () => {
    const colRef = collection(db, "activity");
    const res = await getDocs(colRef);
    res.forEach((r) => {
      const activity = r.data() as Activity;
      const exercise = String(
        state.exercises.find((f) => f.id == activity.exerciseId)?.name
      );
      const unit = String(
        state.units.find((u) => u.id == activity.timeUnitId)?.unit
      );
      state.activities.push({ ...activity, exercise, unit });
    });
    return state.activities;
  });
  // TODO: Add new Activity
  return (
    <div>
      <p>Add new activity</p>
      <Resource
        value={activityResource}
        onPending={() => <>Loading...</>}
        onRejected={(error) => <>Error: {error.message}</>}
        onResolved={() => {
          return (
            <form>
              <div style="float:left;margin-right:20px; margin-bottom: 20px">
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
                  value={state.exerciseDate.toString()}
                  name="exerciseDate"
                  onChange$={handleInputChange}
                />
              </div>
              <div style="float: rigth, border: 1px solid black; width: 30px">
                <button
                  onClick$={submitActivity}
                  style={"background: white;  border: none;"}
                >
                  Submit
                </button>
                {/* <i class="fa fa-paper-plane"></i> */}
              </div>
            </form>
          );
        }}
      />

      <Resource
        value={activityResource}
        onPending={() => <>Loading...</>}
        onRejected={(error) => <>Error: {error.message}</>}
        onResolved={(repos: ActivityRow[]) => {
          return (
            <div>
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
                        <td>{repo.calories}</td>
                        <td>{new Date(repo.date).toString()}</td>
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
