import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { UserProvider } from './context/userContext';
import './index.css';
import HomePage from './homePage';
import Login from './login';
import GetChat from './chat';
import SignUp from './signUp';

const router = createBrowserRouter([
	{
		path: '/',
		element: <HomePage />,
	},
	{
		path: '/login',
		element: <Login />,
	},
	{ 
    path: '/chat/:conversationId', 
    element: <GetChat /> 
  },
  {
    path: '/signUp',
    element: <SignUp />
  }
]);

createRoot(document.getElementById('root')).render(
	
		<UserProvider>
			<RouterProvider router={router} />
		</UserProvider>

);
