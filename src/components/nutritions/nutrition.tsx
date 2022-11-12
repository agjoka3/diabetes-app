import { component$, useWatch$ } from "@builder.io/qwik";
import { collection, onSnapshot, query } from "firebase/firestore";
import db from "~/firebase";


export const Nutritions = component$(() => {
    useWatch$(() => {
        const q = query(collection(db, 'foods'))
        onSnapshot(q, (querySnapshot) => {
          const r = querySnapshot.docs.map(doc => ({
            id: doc.id,
            data: doc.data()
          }))
        })
      })



    return (<div>
       connect to firestore
    </div>)
})