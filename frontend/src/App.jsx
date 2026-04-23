import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Home from "./pages/Home"
import Register from "./pages/Register"
import Login from "./pages/Login"
import Chat from "./pages/Chat"
import { AuthProvider } from "./context/AuthContext"

export default function App() {


    const router = createBrowserRouter([
        { path: "/", element: <Home /> },
        { path: "/register", element: <Register /> },
        { path: "/login", element: <Login /> },
        { path: "/chat", element: <Chat /> },
        { path: "/chat/:chatId", element: <Chat /> },
    ])

    return (
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>

    )
}