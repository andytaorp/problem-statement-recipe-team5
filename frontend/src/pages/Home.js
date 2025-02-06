import { useEffect, useState } from "react"
import {useWorkoutsContext} from '../hooks/useWorkoutsContext'
import { useAuthContext } from '../hooks/useAuthContext'

// components
import WorkoutDetails from "../components/WorkoutDetails"
import WorkoutForm from "../components/WorkoutForm"

const Home = () => {
  const {workouts, dispatch} = useWorkoutsContext()
  const {user} = useAuthContext()

  // Search Function
  const [searchName, setSearchName] = useState('')
  const filteredName = workouts ? workouts.filter((workout) => workout.title.toLowerCase().includes(searchName.toLowerCase())) : [];

  useEffect(() => {
    const fetchWorkouts = async () => {
      // const response = await fetch(`${process.env.REACT_APP_API_URL}/api/workouts`);
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/workouts`, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        }
      );
      const json = await response.json()

      if (response.ok) {
        dispatch({type: 'SET_WORKOUTS', payload: json})
      }
    }

    if (user) {
      fetchWorkouts()
    }

  }, [dispatch, user])

  return (
    <div>
      <label style={{fontSize:"20px",color:"#127475"}}>Search Workouts:</label>
      <input
        type="text"
        placeholder="Enter a workout"
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
        <div className="workouts">
          {filteredName.map(workout => (
            <WorkoutDetails workout={workout} key={workout._id} />
          ))}
        </div>
        <WorkoutForm />
      </div>
      
    </div>
  )
}

export default Home
