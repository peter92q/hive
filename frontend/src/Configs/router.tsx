import { Navigate, createBrowserRouter } from "react-router-dom";
import App from "../App";
import Homepage from "../Pages/Homepage";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import ProfilePage from "../Pages/ProfilePage";
import Cookies from "js-cookie";
import Messages from "../Pages/Messages";
import EditProfilePage from "../Pages/EditProfilePage";

const isAuthenticated = () => {
    const user = Cookies.get("user");
    return user !== undefined && user !== null;
}; 
  
const ProtectedRoute = ({ element: Element, ...rest }: any) => {
  return isAuthenticated() ? (
    <Element {...rest} />
  ) : (
    <Navigate to="/login" replace />
  );
};

const SignIn = () => {
  return isAuthenticated() ? <Navigate to="/" replace /> : <Login />;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>,
    children:[
        {path: '', element: <ProtectedRoute element={Homepage} />},
        {path: "login", element: <SignIn/> },
        {path: 'register', element: <Register/>},
        {path: 'user/:id', element: <ProfilePage/>},
        {path: 'messages', element: <ProtectedRoute element={Messages}/>},
        {path: 'editprofile', element: <ProtectedRoute element={EditProfilePage}/>}
    ]
  }
])
