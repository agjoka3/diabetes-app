import {
  component$,
  Resource,
  useMount$,
  useResource$,
  useStore,
  $,
  useStylesScoped$,
} from "@builder.io/qwik";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { Unit } from "../models/unit.model";
import { Food } from "./food.model";
import { Nutrition, NutritionRow } from "./nutrition.model";
import styles from "./nutrition.css?inline";
import { db } from "~/firebase";

export const Nutritions = component$(() => {
  useStylesScoped$(styles);
  const state = useStore({
    foods: [] as Food[],
    nutritions: [] as NutritionRow[],
    units: [] as Unit[],
    selectedFood: undefined,
    quantity: undefined,
    unit: undefined,
    meal: undefined,
    date: new Date(),
  });

  const handleInputChange = $((event: any) => {
    const target = event.target;
    const value =
      target.type === "checkbox"
        ? target.checked
        : target.type === "date"
        ? new Date(target.value)
        : target.value;
    const name: "selectedFood" | "quantity" | "unit" | "meal" = target.name;
    state[name] = value;
  });

  useMount$(async () => {
    const colRefUnits = collection(db, "units");
    (await getDocs(colRefUnits)).forEach((r) => {
      // TODO: Filter quantity units in query
      if ((r.data() as Unit).type === "quantity") {
        state.units.push(r.data() as Unit);
      }
    });

    const colRefFoods = collection(db, "foods");
    (await getDocs(colRefFoods)).forEach((r) =>
      state.foods.push(r.data() as Food)
    );
  });

  const submitNutrition = $(async () => {
    try {
      const foodCalories = state.foods.find((e) => e.id === state.selectedFood);
      const calories =
        (Number(state?.quantity) / Number(foodCalories?.calories)) *
        Number(foodCalories?.quantity);

      await addDoc(collection(db, "nutrition"), {
        foodId: state.selectedFood,
        calories,
        quantity: state.quantity,
        meal: state.meal,
        unitId: state.unit, // default to min
        userId: "TUJztX9XaaIsM7EiEZp3", // TODO: set user id,
        date: state.date.valueOf(),
      });
    } catch (err) {
      alert(err);
    }
  });

  const nutritionResource: any = useResource$(async () => {
    const colRef = collection(db, "nutrition");
    const res = await getDocs(colRef);
    res.forEach((r) => {
      const nutrition = r.data() as Nutrition;
      const food = String(
        state.foods.find((f) => f.id == nutrition.foodId)?.name
      );
      const unit = String(
        state.units.find((u) => u.unit == nutrition.unitId)?.unit
      );
      state.nutritions.push({ ...nutrition, food, unit });
    });
    return state.nutritions;
  });
  // TODO: Add new Food
  return (
    <div>
      <p>Add new food</p>
      <Resource
        value={nutritionResource}
        onPending={() => <>Loading...</>}
        onRejected={(error) => <>Error: {error.message}</>}
        onResolved={() => {
          return (
            <form>
              <div style="float:left;margin-right:10px; margin-bottom: 20px">
                <label style="font-size: 12px" for="food">
                  Food
                </label>
                <select
                  style="width: 100px;"
                  name="selectedFood"
                  id="selectedFood"
                  value={state.selectedFood}
                  onChange$={handleInputChange}
                >
                  <option value="">-Select--</option>
                  {state.foods.map((food) => {
                    return <option value={food.id}>{food.name}</option>;
                  })}
                </select>
              </div>
              <div style="float:left;margin-right:10px; margin-bottom: 20px">
                <label style="font-size: 12px" for="quantity">
                  Quantity
                </label>
                <input
                  style="width: 50px"
                  type="number"
                  id="quantity"
                  value={state.quantity}
                  name="quantity"
                  onChange$={handleInputChange}
                />
              </div>
              <div style="float:left;margin-right:10px; margin-bottom: 20px">
                <label style="font-size: 12px" for="unit">
                  Unit
                </label>
                <select
                  style="width: 100px;"
                  name="unit"
                  id="unit"
                  value={state.unit}
                  onChange$={handleInputChange}
                >
                  <option value="">-Select--</option>
                  {state.units.map((unit) => {
                    return (
                      <option value={unit.unit}>{unit.description}</option>
                    );
                  })}
                </select>
              </div>
              <div style="float:left;margin-right:10px; margin-bottom: 20px">
                <label style="font-size: 12px" for="date">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  value={state.date.toISOString().substring(0, 10)}
                  name="date"
                  onChange$={handleInputChange}
                />
              </div>
              <div style="float:left;margin-right:10px; margin-bottom: 20px">
                <label style="font-size: 12px" for="meal">
                  Meal
                </label>
                <select
                  style="width: 100px;"
                  name="meal"
                  id="meal"
                  value={state.meal}
                  onChange$={handleInputChange}
                >
                  <option value="">-Select--</option>
                  {["breakfast", "brunch", "lunch", "dinner"].map((meal) => {
                    return <option value={meal}>{meal}</option>;
                  })}
                </select>
              </div>
              <div style="float: rigth, border: 1px solid black; width: 30px">
                <button
                  onClick$={submitNutrition}
                  style={"background: white;  border: none;"}
                >
                  Submit
                </button>
              </div>
            </form>
          );
        }}
      />
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
