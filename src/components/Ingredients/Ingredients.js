import React, { useReducer, useCallback, useMemo } from 'react';
import axios from "axios"

import IngredientForm from './IngredientForm';
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";
import Search from './Search';

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case "SET":
      return action.ingredients;
    case "ADD":
      return [...currentIngredients, action.newIngredient];
    case "DELETE":
      return currentIngredients.filter((ing) => ing.id !== action.id)
    default:
      throw new Error("Should not get there!");
  }
}

const httpReducer = (httpState, action) => {
  switch (action.type) {
    case "SEND":
      return { ...httpState, loading: true }
    case "RESPONSE":
      return { ...httpState, loading: false }
    case "ERROR":
      return { loading: false, error: action.errorMessage }
    case "CLEAR":
      return { loading: false, error: null}
    default:
      throw new Error("Should not get there!")
  }
}

function Ingredients() {
  const [ingredients, dispatch] = useReducer(ingredientReducer, []);
  const [httpState, dispatchHttp] = useReducer(httpReducer, {loading: false, error: null});
  // const [ingredients, setIngredients] = useState([]);
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState()

  const addIngredientHandler = useCallback(ingredient => {
    dispatchHttp({type: "SEND"})
    // setLoading(true);
    axios.post("https://southern-shade-281705.firebaseio.com/ingredients.json", ingredient)
      .then(response => {
        dispatchHttp({type: "RESPONSE"})
        const newIngredient = {
          id: response.data.name,
          ...ingredient
        }
        dispatch({type: "ADD", newIngredient})
        // setLoading(false)
        // setIngredients(prevState => [
        //   ...prevState,
        //   {
        //     id: response.name,
        //     ...ingredient
        //   }
        // ])
      })
  }, [])

  const filteredIngredientHandler = useCallback(filteredIngredients => {
    dispatch({type: "SET", ingredients: filteredIngredients})
    // setIngredients(filteredIngredients)
  }, [])

  const onRemoveItem = useCallback(id => {
    dispatchHttp({type: "SEND"})
    // setLoading(true)
    axios.delete(`https://southern-shade-281705.firebaseio.com/ingredients/${id}.json`)
      .then(() => {
        dispatchHttp({type: "RESPONSE"})
        dispatch({type: "DELETE", id})
        // setLoading(false)
        // setIngredients(prevState => prevState.filter((ingredient) => ingredient.id !== id))
      })
      .catch(err => {
        dispatchHttp({type: "ERROR", errorMessage: "Something went wrong!"})
        // setError("Something went wrong!")
      })
  }, [])

  const clearError = useCallback(() => {
    dispatchHttp({type: "CLEAR"})
    // setError(null);
    // setLoading(false);
  }, [])

  const ingredientList = useMemo(() => {
    return (
      <IngredientList ingredients={ingredients} onRemoveItem={onRemoveItem} />
    )
  }, [ingredients, onRemoveItem])

  return (
    <div className="App">
      {httpState.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>}
      <IngredientForm onAddingIngredient={addIngredientHandler} loading={httpState.loading}/>

      <section>
        <Search onLoadIngredients={filteredIngredientHandler} />
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
