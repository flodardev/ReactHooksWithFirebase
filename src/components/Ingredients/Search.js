import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const { onLoadIngredients } = props
  const [filterInput, setFilterInput] = useState("")
  const inputRef = useRef();

  const handleChange = (event) => {
    setFilterInput(event.target.value)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (filterInput === inputRef.current.value) {
        const query = filterInput.length === 0 ? '' : `?orderBy="title"&equalTo="${filterInput}"`

        axios.get("https://southern-shade-281705.firebaseio.com/ingredients.json" + query)
          .then(response => {
            const loadedIngredients = []
            for (const key in response.data) {
              loadedIngredients.push({
                id: key,
                title: response.data[key].title,
                amount: response.data[key].amount
              })
            }
            onLoadIngredients(loadedIngredients)
          })
        }
      }, 500)
      // Clean up
      return () => {
        clearTimeout(timer)
      }
  }, [filterInput, onLoadIngredients, inputRef])

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input ref={inputRef} onChange={handleChange} type="text" value={filterInput} />
        </div>
      </Card>
    </section>
  );
});

export default Search;
