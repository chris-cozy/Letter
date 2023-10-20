import { useContext, useState } from "react"
import axios from "axios"
import { UserContext } from "../UserContext";


export default function Authentication() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const {setUser} = useContext(UserContext); 


    async function handleSubmit(ev) {
        const endpoint = isLogin ? '/v1/auth/login' : '/v1/auth/register'
        ev.preventDefault();
        const {data} = await axios.post(endpoint, {username, password});
        
        localStorage.setItem('token', data);
        axios.defaults.headers.common['Authorization'] = `Bearer ${data}`
        await axios.get('/v1/auth/profile').then(res => {
            setUser(res.data)
        })
    }

    return (
            <div className="bg-gradient-to-br from-page_background to-login_button_hover min-h-screen flex flex-col items-center justify-center">
                <div className="items-center justify-center flex flex-col p-6 rounded-lg">
                    <div className="text-app_title flex items-center justify-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
                            <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                            <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                        </svg>
                        <h1 className="text-4xl font-bold mb-1 text-app_title">
                        Letter
                        </h1>
                    </div>
                    
                    <p className="text-lg mb-10 text-app_slogan text-center">Messages that matter - Moments that connect</p>
                    <div className="bg-form_background/80 shadow-lg items-center justify-center flex flex-col p-10 rounded-2xl w-full max-w-sm">
                    <form className="w-full mx-auto" onSubmit={handleSubmit}>
                        <input value={username} onChange={ev => setUsername(ev.target.value)} type="text" placeholder="username" className="block w-full rounded-2xl p-2 mb-4 border border-login_button transition delay-50 duration-300 ease-in-out transform hover:border-app_slogan bg-form_background caret-app_slogan text-app_slogan" />
                        <input value={password}  onChange={ev => setPassword(ev.target.value)} type="password" placeholder="password" className="block w-full rounded-2xl p-2 mb-8 border border-login_button transition delay-50 duration-300 ease-in-out transform hover:border-app_slogan bg-form_background caret-app_slogan text-app_slogan" />
                        <button className="button mb-6 bg-login_button text-login_button_text block w-full rounded-2xl p-2 transition delay-50 duration-300 ease-in-out transform hover:bg-login_button_hover hover:scale-105">{isLogin ? 'Login' : 'Register'}</button>
                        <div className="text-center text-app_slogan flex flex-col">
                        {isLogin ? (
                            <>Don't have an account?
                            <button className='text-app_slogan transition delay-50 duration-300 ease-in-out transform hover:text-app_title hover:scale-105' onClick={() => setIsLogin(!isLogin)}>{`Register Here`}</button>
                            </>
                        ) : (
                            <>
                            Already a member?
                            <button className='text-app_slogan transition delay-50 duration-300 ease-in-out transform hover:text-app_title hover:scale-105' onClick={() => setIsLogin(!isLogin)}>{`Login Here`}</button>
                            </>
                        )}
                        </div>
                    </form>
                    </div>
                </div>
                
            </div>
        
    )
}