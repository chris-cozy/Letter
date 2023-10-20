import {UserContextProvider } from "./components/UserContext";
import Routes from "./components/Routes";
import axios from "axios"

function App() {
  axios.defaults.baseURL = 'https://letter-webserver.onrender.com';
  axios.defaults.withCredentials = true;
  return (
    <>
      <UserContextProvider>
        <Routes />
      </UserContextProvider>
    </>
  )
}

export default App
