import { useState } from 'react'
import {useRecipesContext} from '../hooks/useRecipesContext'
import { useAuthContext } from '../hooks/useAuthContext'

const RecipeForm = () => {

    const {dispatch} = useRecipesContext()
    const {user} = useAuthContext()

    const [name, setName] = useState('')
    const [ingredients, setIngredients] = useState('')
    const [instructions, setInstructions] = useState('')
    const [preparation, setPreparation] = useState('')
    const [difficulty, setDifficulty] = useState('')
    const [error, setError] = useState(null)
    const [emptyFields, setEmptyFields] = useState([])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!user) {
            setError('You must be logged in')
            return
        }

        const recipe = {name, ingredients, instructions, preparation}
    
        const response = await fetch(
            `${process.env.REACT_APP_API_URL}/api/recipes`, {
            method: 'POST',
            body: JSON.stringify(recipe),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if (!response.ok) {
            setError(json.error)
            setEmptyFields(json.emptyFields)
        }
        if (response.ok) {
            setError(null)
            setName('')
            setIngredients('')
            setInstructions('')
            setPreparation('')
            setDifficulty('')
            setError(null)
            setEmptyFields([])
            // console.log('new recipe added:', json)
            dispatch({type: 'CREATE_RECIPE', payload: json})
        }

    }

    return (
        <form className="create" style={{color:"#3e2020"}} onSubmit={handleSubmit}>
            <h3>Add a New Recipe</h3>

            <label>Recipe Name:</label>
            <input 
                type="text" 
                placeholder="e.g. Soup"
                onChange={(e) => setName(e.target.value)} 
                value={name}
                className={emptyFields.includes('name') ? 'error': ''}
            />

            <label>Ingredients:</label>
            <input 
                type="text" 
                placeholder="e.g. Carrots, Chicken, etc."
                onChange={(e) => setIngredients(e.target.value)} 
                value={ingredients}
                className={emptyFields.includes('ingredients') ? 'error': ''}
            />

            <label>Cooking Instructions:</label>
            <input 
                type="text" 
                placeholder="e.g. Boil, Fry, etc."
                onChange={(e) => setInstructions(e.target.value)} 
                value={instructions}
                className={emptyFields.includes('instructions') ? 'error': ''}
            />

            <label>Preparation Time:</label>
            <input 
                type="text" 
                placeholder="e.g. 30 minutes"
                onChange={(e) => setPreparation(e.target.value)} 
                value={preparation}
                className={emptyFields.includes('preparation') ? 'error': ''}
            />

            <label>Difficulty Level:</label>
            <input 
                type="text" 
                placeholder="e.g. Easy, Medium, Hard"
                onChange={(e) => setDifficulty(e.target.value)} 
                value={difficulty}
                className={emptyFields.includes('difficulty') ? 'error': ''}
            />

            <button className="btnForm">Add Recipe</button>
            {error && <div className="error">{error}</div>}
        </form>
    )
}

export default RecipeForm
