import { useEffect, useState } from "react"


export default function Chat() {
    const [ws, setWs] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);

    useEffect(() => {
    
        const socket = new WebSocket('ws://127.0.0.1:4040')
        setWs(socket);

        const token = localStorage.getItem('token');

        socket.onopen = (event) => {
            // Send the JWT token to the server after the WebSocket connection is established
            const authMessage = {
                type: 'auth',
                token: token,
            };
              
            socket.send(JSON.stringify(authMessage));
          };

        socket.addEventListener('message', handleMessage)

        socket.onerror = (error) => {
            console.error('WebSocket Error: ', error);
          };
          
    }, []) //eslint-disable-line react-hooks/exhaustive-deps

    function handleMessage(event) {
        const messageData = JSON.parse(event.data);
        if ('online' in messageData){
            showOnlineUsers(messageData.online)
        }
    
    }

    function showOnlineUsers(users){
        // Clear duplicates
        const uniqueUsers = {};
        users.forEach(({id, username}) => {
            if (id){
                uniqueUsers[id] = username;
            }
        });
        console.log(uniqueUsers)
        setOnlineUsers(uniqueUsers);
    }

    

    return (
        <>
            <div className="flex h-screen">
                <div className="bg-blue-50 w-1/3 pl-4 pt-4">
                    <div className="text-blue-600 font-bold border-b py-2 flex gap-2 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                    <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                    </svg>

                        Letter
                    </div>
                    {Object.keys(onlineUsers).map((id) => (
                        <div className="border-b py-2">
                            {onlineUsers[id]}
                        </div>
                    ))}
                </div>
                <div className="flex flex-col bg-blue-300 w-2/3 p-4">
                    <div className="flex-grow">Messages with selected user</div>
                    <div className="flex gap-2">
                        <input type="text" placeholder="Write a message..." className="bg-white border p-2 rounded-lg flex-grow"/>
                        <button className="bg-blue-500 p-2 text-white rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}