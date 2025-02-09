import { useState } from "react";
import axios from "axios";
import { useAuthContext } from "../hooks/useAuthContext";

const AIdetection = () => {
  const [image, setImage] = useState(null);
  const [foodData, setFoodData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { user } = useAuthContext(); // Get logged-in user

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  const handleSubmit = async () => {
    if (!image) return alert("Please upload an image!");
    if (!user) return alert("You must be logged in to analyze images!");

    setLoading(true);
    setError("");
    
    const formData = new FormData();
    formData.append("image", image);

    try {
      // Step 1: Upload Image to LogMeal (Food Recognition)
      const recognitionResponse = await axios.post(
        "https://api.logmeal.com/v2/image/segmentation/complete",
        formData,
        {
          headers: { 
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${process.env.REACT_APP_LOGMEAL_API_KEY}`, // Fixed env variable
          },
        }
      );

      const imageId = recognitionResponse.data.imageId;
      console.log("Image ID:", imageId);

      // Step 2: Get Ingredients Info using imageId (Fixed API Endpoint)
      const ingredientsResponse = await axios.post(
        "https://api.logmeal.com/v2/recipe/ingredients",
        { imageId: imageId }, // Pass the imageId from previous step
        {
          headers: {
            "Authorization": `Bearer ${process.env.REACT_APP_LOGMEAL_API_KEY}`,
          },
        }
      );

      console.log("Ingredients Response:", ingredientsResponse.data);

      //CHECKING
      console.log("Full API Response:", JSON.stringify(ingredientsResponse.data, null, 2));

      setFoodData(ingredientsResponse.data);
    } catch (err) {
      console.error("Error:", err.response ? err.response.data : err.message);
      setError("Failed to analyze image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="containerAI">
      <h2 className="title">Food Recognition App</h2>

      <div className="upload-section">
        <input type="file" accept="image/*" onChange={handleImageUpload} className="file-input" />
        <button onClick={handleSubmit} disabled={loading} className="analyze-button">
          {loading ? "Analyzing..." : "Analyze Food"}
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {loading && <div className="spinner"></div>}

      {foodData && foodData.recipe && foodData.recipe.length > 0 ? (
        <div className="results">
          <h3 className="results-title">Detected Recipe</h3>
          <div className="recipe-grid">
            {foodData.recipe.map((item, index) => (
              <div key={index} className="recipe-card">
                <p><strong>Ingredient Name:</strong> {item.name}</p>
                <p><strong>Quantity:</strong> {item.measure.metric.quantity} {item.measure.metric.name}</p>
                <p><strong>State:</strong> {item.measure.metric.state}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="no-results">No recipe details available.</p>
      )}
    </div>
  );
};

export default AIdetection;
