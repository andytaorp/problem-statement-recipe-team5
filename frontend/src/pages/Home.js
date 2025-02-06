import { useEffect, useState } from "react"
import {useRecipesContext} from '../hooks/useRecipesContext'
import { useAuthContext } from '../hooks/useAuthContext'

// components
import RecipeDetails from "../components/RecipeDetails"
import RecipeForm from "../components/RecipeForm"

const Home = () => {
  const {recipes, dispatch} = useRecipesContext()
  const {user} = useAuthContext()

  // Search Function
  const [searchName, setSearchName] = useState('')
  const filteredName = recipes ? recipes.filter((recipe) => recipe.title.toLowerCase().includes(searchName.toLowerCase())) : [];

  useEffect(() => {
    const fetchRecipes = async () => {
      // const response = await fetch(`${process.env.REACT_APP_API_URL}/api/recipes`);
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/recipes`, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        }
      );
      const json = await response.json()

      if (response.ok) {
        dispatch({type: 'SET_RECIPES', payload: json})
      }
    }

    if (user) {
      fetchRecipes()
    }

  }, [dispatch, user])

  return (
    <div>
      <label style={{fontSize:"20px",color:"#127475"}}>Search Recipes:</label>
      <input
        type="text"
        placeholder="Enter a recipe"
        value={searchName}
        onChange = {(e) => setSearchName(e.target.value)}
        style={{
          padding: "10px",
          fontSize: "16px",
          width: "35%",
          borderRadius: "5px",
          border: "1px solid #127475",
        }}
      />
      
      <div className="home">
        <div className="recipes">
          {filteredName.map(recipe => (
            <RecipeDetails recipe={recipe} key={recipe._id} />
          ))}
        </div>
        <RecipeForm />
      </div>
      
    </div>
  )
}

export default Home
