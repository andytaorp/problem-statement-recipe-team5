import { useState } from 'react'
import { useRecipesContext } from '../hooks/useRecipesContext'
import { useAuthContext } from '../hooks/useAuthContext'

// date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const RecipeDetails = ({ recipe }) => {
  const { dispatch } = useRecipesContext()
  const { user } = useAuthContext()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: recipe.name,
    ingredients: recipe.ingredients,
    instructions: recipe.instructions,
    prepTime: recipe.prepTime,
    difficulty: recipe.difficulty
  })

  const handleDelete = async () => {
    if (!user) {
      return
    }

    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/recipes/${recipe._id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${user.token}`
      }
    })
    const json = await response.json()

    if (response.ok) {
      dispatch({type: 'DELETE_RECIPE', payload: json})
    }
  }

  const handleEditToggle = () => {
    setIsEditing(!isEditing)
  }

  const handleUpdate = async () => {
    if (!user) {
      return
    }
  
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/recipes/${recipe._id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${user.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
  
    const json = await response.json()
  
    if (response.ok) {
      dispatch({ type: 'UPDATE_RECIPE', payload: json }) 
      setIsEditing(false)
    }
  }
  

  return (
    <div className="recipe-details">
      {isEditing ? (
        <div>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <textarea
            value={formData.ingredients}
            onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
          />
          <textarea
            value={formData.instructions}
            onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
          />
          <input
            type="number"
            value={formData.prepTime}
            onChange={(e) => setFormData({ ...formData, prepTime: e.target.value })}
          />
          <select
            value={formData.difficulty}
            onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <button onClick={handleUpdate}>Update</button>
          <button onClick={handleEditToggle}>Cancel</button>
        </div>
      ) : (
        <div>
          <h4>{recipe.name}</h4>
          <p><strong>Ingredients: </strong>{recipe.ingredients.join(', ')}</p>
          <p><strong>Instructions: </strong>{recipe.instructions}</p>
          <p><strong>Preparation Time: </strong>{recipe.prepTime} minutes</p>
          <p><strong>Difficulty: </strong>{recipe.difficulty}</p>
          <p>{formatDistanceToNow(new Date(recipe.createdAt), { addSuffix: true })}</p>
          <button onClick={handleEditToggle}>Edit</button>
          <span className="material-symbols-outlined" onClick={handleDelete}>delete</span>
        </div>
      )}
    </div>
  )
}

export default RecipeDetails