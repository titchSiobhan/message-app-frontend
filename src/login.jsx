import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router'
import { UserContext } from './context/userContext'

function Login() {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const { setUser, authFetch } = useContext(UserContext);
const navigate = useNavigate();

    async function handleSubmit(event) {
        event.preventDefault();
        const response = await fetch('https://message-app-backend-jfnx.onrender.com/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
       
        if (!response.ok) {
            return console.log('Login failed', data.error);
        }
        
        localStorage.setItem('token', data.token);
        const meResponse = await authFetch('https://message-app-backend-jfnx.onrender.com/me');
        const meData = await meResponse.json();
        setUser({ ...meData.user, token: data.token });

        navigate('/');
    }

    return(
        <>
        <nav>
                <Link to="/">Home</Link>
                
                <Link to="/signUp">Sign Up</Link>
            </nav>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email</label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <label htmlFor="password">Password</label>
                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">Login</button>
            </form>
        </>
    )
}


export default Login;