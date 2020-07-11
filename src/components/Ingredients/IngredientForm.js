import React, { useState } from 'react';

import Card from '../UI/Card';
import './IngredientForm.css';
import LoadingIndicator from "../UI/LoadingIndicator";

const IngredientForm = React.memo(props => {
  const [inputState, setInputState] = useState({ title: "", amount: ""})

  const handleChange = event => {
    const {name, value} = event.target
    setInputState(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const submitHandler = event => {
    event.preventDefault();
    props.onAddingIngredient(inputState)
    setInputState({ title: "", amount: ""})
  };

  return (
    <section className="ingredient-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            <input onChange={handleChange} name="title" type="text" id="title" value={inputState.title} />
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input onChange={handleChange} name="amount" type="number" id="amount" value={inputState.amount} />
          </div>
          <div className="ingredient-form__actions">
            <button type="submit">Add Ingredient</button>
            {props.loading && <LoadingIndicator/>}
          </div>
        </form>
      </Card>
    </section>
  );
});

export default IngredientForm;
