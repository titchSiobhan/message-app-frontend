import { useContext, useEffect, useState, useRef } from 'react';
import { UserContext } from './context/userContext';
import { Link, useParams, useNavigate } from 'react-router';

function GetChat() {
	const { conversationId } = useParams();
	const { user, authFetch } = useContext(UserContext);
	const [messages, setMessages] = useState([]);
    const [sendMessage, setSendMessage] = useState('');
    const bottomRef = useRef(null);
    const navigate = useNavigate();
    const [conversations, setConversations] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    

	
		async function getMessages() {
			const response = await authFetch(
				`http://localhost:3000/conversation/messages/${conversationId}`,
			);

			const data = await response.json();

			setMessages(data);
		}
useEffect(() => {
    if (!conversationId) return;

    // still loading user → do nothing
    if (user === undefined) return;

    // user finished loading but is not authenticated → redirect
    if (user === null) {
        navigate('/login');
        return;
    }

    // user is valid → fetch messages
    getMessages();
}, [conversationId, user]);

function openSidebar() {
    setSidebarOpen(true);
   
  }
  function closeSidebar() {
    setSidebarOpen(false);
  }
  

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    async function postMessage(event) {
        event.preventDefault();
        const messageText = sendMessage

       await authFetch(`http://localhost:3000/conversation/${conversationId}/send`, {
            method: 'POST',
            body: JSON.stringify({ messageText }),
        });
        setSendMessage('');
        getMessages();

    }
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


	console.log('messages:', messages);
	return (
		<>
        
			<nav className="nav">
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
            <div className='open' onClick={() => setSidebarOpen(prev => !prev)}>
                <i className="fa-solid fa-inbox"></i>
            </div>
 <aside className={sidebarOpen ? "conversations sidebar open" : "conversations sidebar"}>
    
				<h3>Conversations</h3>

				{conversations.map((convo) => (
					<div key={convo.id} onClick={() => selectChat(convo.id)} className="conversation">
						<p className="name">
							{convo.participants
								.filter((p) => p.user.id !== user.id)
								.map((p) => p.user.userName)
								.join(', ')}
						</p>
						
					</div>
				))}
                
			</aside>
<main>
			<h1>Chat</h1>

			<div>
				{messages.length === 0 && <p>No messages yet</p>}

				{messages.map((msg) => (
					<div key={msg.id} className="message">
						<p className="sender"> 
							{msg.sender?.userName}
						</p>
                        <p className="message-text">{msg.message}</p>
                        
					</div>
				))}
                <div ref={bottomRef}></div>
			</div>
			<form onSubmit={postMessage}>
    <textarea
        value={sendMessage}
        onChange={(e) => setSendMessage(e.target.value)}
    />
    <button type="submit">Send</button>
</form>
</main>


		</>
	);
}

export default GetChat;
