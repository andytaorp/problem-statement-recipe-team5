import React, {useState} from 'react'

import {useRecipesContext} from '../hooks/useRecipesContext'
import { useAuthContext } from '../hooks/useAuthContext'

// date-fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const RecipeDetails = ({ recipe }) => {
  const {dispatch}= useRecipessContext()
  const {user} = useAuthContext()

  const [showModal, setShowModal] = useState(false)
  const [title, setTitle] = useState(recipe.title)
  const [load, setLoad] = useState(recipe.load)
  const [reps, setReps] = useState(recipe.reps)

  const handleClick = async () => {

    if (!user) {
      return
    }

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/recipes/${recipe._id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    })
    const json = await response.json()

    if (response.ok) {
      dispatch({type: 'DELETE_RECIPE', payload: json})
    }
  }

  const handleChange = async (e) => {
    e.preventDefault()

    if (!user) {
      return
    }

    const updatedRecipe = {title, load, reps}

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/recipes/${recipe._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type' : 'application/json',
        'Authorization': `Bearer ${user.token}`
      },
      body: JSON.stringify(updatedRecipe) // to send updated data
    })
    const json = await response.json()

    if (response.ok) {
      dispatch({type: 'EDIT_RECIPE', payload: json})
      setShowModal(false) // to close modal after an update
    }
  }

    return (
      <div className="recipe-details">
        <h4>{recipe.title}</h4>
        <p><strong>Load (kg): </strong>{recipe.load}</p>
        <p><strong>Number of reps: </strong>{recipe.reps}</p>
        <p>{formatDistanceToNow(new Date(recipe.createdAt), {addSuffix: true})}</p>

        <div className="editAndDelete">
          <span className="material-symbols-outlined" onClick={() => setShowModal(true)}>edit</span>
          <span className="material-symbols-outlined" onClick={handleClick}>delete</span>
        </div>

        {showModal && (
          <div className='modal-overlay'>
            <div className='modal-content'>
              <h2>Edit Recipe</h2>
              <form onSubmit={handleChange}>
                <label>Title:</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}/>
                
                <label>Load (kg):</label>
                <input type="number" value={load} onChange={(e) => setLoad(e.target.value)}/>
                
                <label>Reps:</label>
                <input type="number" value={reps} onChange={(e) => setReps(e.target.value)}/>

                <button type="submit">Save Changes</button>
                <button type="button" onClick={()=>setShowModal(false)}>Cancel</button>
              </form>
            </div>
          </div>
        )}
      </div>
    )
}

export default RecipeDetails
