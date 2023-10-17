import { useContext, useState } from "react"
import axios from "axios"
import { UserContext } from "../UserContext";


export default function Authentication() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const {setUsername:setContextUsername, setId} = useContext(UserContext); 


    async function handleSubmit(ev) {
        const endpoint = isLogin ? '/v1/auth/login' : '/v1/auth/register'
        ev.preventDefault();
        const {data} = await axios.post(endpoint, {username, password});
        setContextUsername(username);
        setId(data._id)
    }

    return (
        <>
            <div className="bg-background h-screen flex flex-col items-center justify-center">
                <h1 className="text-4xl font-bold mb-8 text-primary">Letter</h1>
                <p className="text-lg mb-8 text-text">messages that matter, moments that connect</p>
                <form className="w-64 mx-auto mb-12" onSubmit={handleSubmit}>
                    <input value={username} onChange={ev => setUsername(ev.target.value)} type="text" placeholder="username" className="block w-full rounded-lg p-2 mb-2 border" />
                    <input value={password}  onChange={ev => setPassword(ev.target.value)} type="password" placeholder="password" className="block w-full rounded-lg p-2 mb-2 border" />
                    <button className="bg-blue-500 hover:bg-secondary text-white block w-full rounded-lg p-2">{isLogin ? 'Login' : 'Register'}</button>
                    {isLogin ? <div className="text-center mt-2">Don't have an account?
                        <button onClick={() => setIsLogin(!isLogin)}>Register Here</button>
                    </div> : <div className="text-center mt-2">Already a member? 
                        <button onClick={() => setIsLogin(!isLogin)}>Login Here</button>
                    </div>}
                </form>
            </div>
        </>
        
    )
}