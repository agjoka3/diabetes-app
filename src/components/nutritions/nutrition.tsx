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
import { Food } from "./food.model";
import { Nutrition, NutritionRow } from "./nutrition.model";
import styles from "./nutrition.css?inline";

export const Nutritions = component$(() => {
  useStylesScoped$(styles);
  const state = useStore({
    foods: [] as Food[],
    nutritions: [] as NutritionRow[],
    units: [] as Unit[],
  });

  useMount$(async () => {
    const colRefUnits = collection(db, "units");
    (await getDocs(colRefUnits)).forEach((r) => state.units .push(r.data() as Unit));

    const colRefFoods = collection(db, "foods");
    (await getDocs(colRefFoods)).forEach((r) => state.foods.push(r.data() as Food));
  })

  const nutritionResource: any = useResource$(async () => {
    const colRef = collection(db, "nutrition");
    const res = await getDocs(colRef);
    res.forEach((r) => {
      const nutrition = r.data() as Nutrition;
      const food = String(
        state.foods.find((f) => f.id == nutrition.foodId)?.name
      );
      const unit = String(
        state.units.find((u) => u.id == nutrition.unitId)?.unit
      );
      state.nutritions.push({ ...nutrition, food, unit });
    });
    return state.nutritions;
  });
  // TODO: Add new Food
  return (
    <div>
      <p>Add new food</p>
      <p>List of foods consumed</p>
      <Resource
        value={nutritionResource}
        onPending={() => <>Loading...</>}
        onRejected={(error) => <>Error: {error.message}</>}
        onResolved={(repos: Nutrition[]) => {
          return (
            <div>
              <table id="nutritions" style={{ width: 700 }}>
                <thead>
                  <tr>
                    <th style={{ width: 100 }}>Food</th>
                    <th style={{ width: 100 }}>Quantity</th>
                    <th>Unit</th>
                    <th>Calories</th>
                    <th>Meal</th>
                  </tr>
                </thead>
                <tbody>
                  {repos.map((repo) => {
                    return (
                      <tr>
                        <td>{repo.food}</td>
                        <td>{repo.quantity}</td>
                        <td>{repo.unit}</td>
                        <td>{repo.calories}</td>
                        <td>{repo.meal}</td>
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
