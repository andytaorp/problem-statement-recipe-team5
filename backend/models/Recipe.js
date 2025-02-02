// models/Recipe.js
const mongoose = require("mongoose");

const RecipeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    ingredients: { type: [String], required: true },
    instructions: { type: String, required: true },
    prepTime: { type: Number, required: true },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Recipe", RecipeSchema);
