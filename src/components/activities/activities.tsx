import {
  component$,
  Resource,
  useMount$,
  useResource$,
  useStore,
  useStylesScoped$,
} from "@builder.io/qwik";
import { collection, getDocs } from "firebase/firestore";
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
  // TODO: Add new Food
  return (
    <div>
      <p>Add new activity</p>
      <p>List of activities</p>
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
                    <th style={{ width: 100 }}>Exercise</th>
                    <th style={{ width: 100 }}>Time</th>
                    <th>Calories</th>
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
