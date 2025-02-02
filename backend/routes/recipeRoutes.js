// routes/recipeRoutes.js
const express = require("express");
const {
  getAllRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} = require("../controllers/recipeController");

const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.use(authMiddleware);

// Create Recipe
router.post("/", createRecipe);

// Get All Recipes
router.get("/", getAllRecipes);

// Get Single Recipe
router.get("/:id", getRecipe);

// Update Recipe
router.patch("/:id", updateRecipe);

// Delete Recipe
router.delete("/:id", deleteRecipe);

module.exports = router;
