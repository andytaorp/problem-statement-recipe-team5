import {Link} from 'react-router-dom'
import { useLogout } from '../hooks/useLogout'
import { useAuthContext } from '../hooks/useAuthContext'

const Navbar = () => {
    const {logout} = useLogout()
    const { user } = useAuthContext()

    const handleClick = () => {
        logout()
    }

    return(
        <header>
            <div className="container">
                <Link to="/">
                    <h1>Workout Buddy</h1>
                </Link>

                <nav>
                    {user && (
                        <div>
                        <span style={{fontSize:"20px",color:"#FFF7EA", paddingRight:25,}}>👤 {user.email}</span>
                        <button className="logoutBtn" onClick={handleClick}>Log Out</button>
                    </div>
                    )}
                    
                    {!user && (
                        <div className="btnWelcomePage">
                            <Link to="/login">Log In</Link>
                            <Link to="/signup">Sign Up</Link>
                        </div>
                    )}
                </nav>

            </div>
        </header>
    )
}

export default Navbar;