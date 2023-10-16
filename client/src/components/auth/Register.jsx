import { useContext, useState } from "react"
import axios from "axios"
import { UserContext } from "../UserContext";


export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const {setUsername:setContextUsername, setId} = useContext(UserContext); 
    async function register(ev) {
        ev.preventDefault();
        const {data} = await axios.post("/v1/auth/register", {username, password});
        setContextUsername(username);
        setId(data._id)
    }

    return (
        <div className="bg-blue-50 h-screen flex items-center">
            <form className="w-64 mx-auto mb-12" onSubmit={register}>
                <input value={username} onChange={ev => setUsername(ev.target.value)} type="text" placeholder="username" className="block w-full rounded-lg p-2 mb-2 border" />
                <input value={password}  onChange={ev => setPassword(ev.target.value)} type="password" placeholder="password" className="block w-full rounded-lg p-2 mb-2 border" />
                <button className="bg-blue-500 text-white block w-full rounded-lg p-2">Register</button>
            </form>
        </div>
    )
}