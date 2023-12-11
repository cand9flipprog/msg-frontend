import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CreateChat from "./components/CreateChat";
import Contacts from "./components/Contacts";
import Login from "./components/Login";
import NavBar from "./components/NavBar";
import Registration from "./components/Registration";
import Settings from "./components/Settings";
import Chat from "./components/Chat";
import "./index.css";

const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token;
};


function App() {
    return (
        <div className="bg-zinc-800 flex">
            <BrowserRouter>
                <NavBar />
                <Routes>
                    <Route path="/" element={<Navigate to="/login"/>}/>
                    <Route path="/login" element={isAuthenticated() ? <Navigate to="/home" /> : <Login />} />
                    <Route path="/register" element={isAuthenticated() ? <Navigate to="/home" /> : <Registration />} />
                    <Route path="/chat" element={isAuthenticated() ? <CreateChat /> : <Navigate to="/login" />} />
                    <Route path="/contacts" element={isAuthenticated() ? <Contacts /> : <Navigate to="/login" />} />
                    <Route path="/settings" element={isAuthenticated() ? <Settings /> : <Navigate to="/login" />} />
                    <Route path="/home" element={isAuthenticated() ? <div>Home Page</div> : <Navigate to="/login" />} />
                    <Route path={`/chat/:id`} element={isAuthenticated() ? <Chat /> : <Navigate to="/login" />} />
                    <Route path="*" element={"Page not found 404."}/>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;

