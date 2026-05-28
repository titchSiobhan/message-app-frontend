import { Outlet } from 'react-router';
import { Link, useNavigate } from 'react-router';
import { useContext, useState, useEffect } from 'react';
import { UserContext } from './context/userContext';

function HomePage() {
	const token = localStorage.getItem('token');
	const { user, authFetch } = useContext(UserContext);
	const [conversations, setConversations] = useState([]);
    const [search, setSearch] = useState('');
	const navigate = useNavigate();

	async function getConversation() {
		console.log(user.userName);
		const convos = user.participants.map(
			(participant) => participant.conversation,
		);
		setConversations(convos);
	}
	useEffect(() => {
		if (!user || !user.participants) {
			return console.log('User data not yet loaded');
		}
		getConversation();
	}, [user]);


    async function findUser(event) {
        event.preventDefault();
        const searchUser = search.trim();
       const response = await authFetch(`http://localhost:3000/chat`, {
        method: 'POST',
            body: JSON.stringify({searchUser}) ,
       });
        const data = await response.json();
        console.log(data);
        console.log(data.existing);
   
        if (data.participants) {
            navigate(`/chat/${data.participants[0].conversationId}`);
        }

    }

	function selectChat(conversationId) {
		if (!conversationId) return;
		navigate(`/chat/${conversationId}`);
	}
	
    if (!user) {
        return (
            <>
                <nav>
                    
                    <Link to="/login">Login</Link>
                    <Link to="/signUp">Sign Up</Link>
                </nav>
                <h1>Home Page</h1>
                <p className="loading">Log in or sign up</p>
            </>
        );
    }
    if ( !user.participants) {
		return (
			<>
				<nav>
					
					<Link to="/login">Login</Link>
					<Link to="/signUp">Sign Up</Link>
				</nav>
				<h1>Home Page</h1>
				<p className="loading">Loading conversations...</p>
			</>
		);
	}

	return (
		<>
			<nav>
				<Link to="/">Home</Link>
			<p className="logout"
									onClick={() => {
										localStorage.removeItem('token');
										window.location.reload();
									}}
								>
									Logout
								</p>
			</nav>
            

			<h1>Home Page</h1>
            <h2>{user.userName}</h2>
			<Outlet />
            <div>
                <form onSubmit={findUser} className='search'>
                    <input type="search" name="search" id="" onChange={(e) => setSearch(e.target.value)} />
                    <button type="submit">Search</button>
                </form>
            </div>
			<div className="conversations">
				<h3>Conversations</h3>

				{conversations.map((convo) => (
					<div key={convo.id} onClick={() => selectChat(convo.id)} className="conversation">
						<p className="name">
							{convo.participants
								.filter((p) => p.user.id !== user.id)
								.map((p) => p.user.userName)
								.join(', ')}
						</p>
						<p>{convo.messages[0]?.message || 'No messages'}</p>
					</div>
				))}
			</div >
		</>
	);
}

export default HomePage;
