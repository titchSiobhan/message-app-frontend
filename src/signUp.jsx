import {useState} from "react";
import {useNavigate, Link} from "react-router";

function SignUp() {
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();


    async function signUpPost(event) {
        event.preventDefault();
        const {userName, email, password} = event.target.elements;
        const createAccount = await fetch('https://message-app-backend-jfnx.onrender.com/sign-up', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
             body: JSON.stringify({
                userName: userName.value,
                email: email.value,
                password: password.value
            })
        })
        navigate('/');

    }


    return (
        <div>
           <nav>
                <Link to="/">Home</Link>
                <Link to="/login">Login</Link>
                
            </nav>
            <form onSubmit={signUpPost}>
                {password !== confirmPassword && <p>passwords do not match</p>}
                <label htmlFor="userName">Username</label>
                <input type="text" name="userName"  onChange={e => setUserName(e.target.value)}/>
                <label htmlFor="email">Email</label>
                <input type="email" name="email"  onChange={e => setEmail(e.target.value)} />
                <label htmlFor="password">Password</label>
                <input type="password" name="password"  onChange={e => setPassword(e.target.value)}/>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input type="password" name="confirmPassword"  onChange={e => setConfirmPassword(e.target.value)} />
                <button type="submit">Sign Up</button>
            </form>
        </div>
    )
}

export default SignUp