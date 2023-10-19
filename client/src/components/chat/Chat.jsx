import { useContext, useEffect, useRef, useState } from "react"
import Avatar from "./Avatar";
import Logo from "./Logo"
import { UserContext } from "../UserContext";
import axios from 'axios';


export default function Chat() {
    const [ws, setWs] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messageText, setMessageText] = useState('');
    const [messages, setMessages] = useState([])
    const context = useContext(UserContext);
    const currentId = context.user._id
    const uniqueMessageIds = new Set();

    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (selectedUser){
            axios.get(`/v1/messages/${currentId}/${selectedUser}`).then((res) => {
                const messages = res.data;
                let formattedMessages = [];
                messages.forEach((message) => {
                    const prevMessage = {
                        type: 'message',
                        message: message,
                    }
                    setMessages(prev => ([...prev, {messageData: prevMessage}]))
                })
            } )
        }

    }, [selectedUser])

    useEffect(() => {
        
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]); // Trigger effect whenever messages change

    useEffect(() => {
        connectWebSocket();

    }, []) //eslint-disable-line react-hooks/exhaustive-deps

    function connectWebSocket(){
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
            console.log('auth message sent')
          };

        socket.addEventListener('message', handleMessage)

        // Auto reconnect to socket once it disconnects
        socket.addEventListener('close', () => {
            setTimeout(() => {connectWebSocket()}, 1000)
        })

        socket.onerror = (error) => {
            console.error('WebSocket Error: ', error);
          };
    }

    function handleMessage(event) {
        const messageData = JSON.parse(event.data);
        console.log(messageData);
        if (messageData.type == 'online'){
            showOnlineUsers(messageData.online);
        }
        if (messageData.type == 'message') {
            if (!uniqueMessageIds.has(messageData.messageId)){
                uniqueMessageIds.add(messageData.messageId);
                setMessages(prev => ([...prev, {messageData: messageData}]));
            } else {
                console.log('Duplicate message ID found. Message ignored.');
            }
            
        }
    
    }

    function showOnlineUsers(users){
        // Clear duplicates
        const uniqueUsers = {};
        users.forEach(({id, username}) => {
            if (id && id != currentId){
                uniqueUsers[id] = username;
            }
        });
        setOnlineUsers(uniqueUsers);
    }

    function sendMessage(ev) {
        ev.preventDefault();
        const userMessage = {
            type: 'message',
            message: {
                sender: currentId,
                recipient: selectedUser,
                text: messageText,
            },
        };
          
        ws.send(JSON.stringify(userMessage))
        setMessages(prev => ([...prev, {messageData: userMessage}]))
        setMessageText('');
        
    }

    return (
        <>
            <div className="flex h-screen">
                {/** CONTACTS */}
                <div className="bg-blue-50 w-1/3">
                    <Logo />
                    {Object.keys(onlineUsers).map((id) => (
                        <div key={id} className={"flex border-b cursor-pointer " + (id === selectedUser ? 'bg-blue-200 font-semibold' : '')} onClick={() => setSelectedUser(id)}>
                            {id === selectedUser && (
                                <div className="w-1 bg-blue-500 h-half rounded-r-lg"></div>
                            )}
                            <div className="pl-4 py-2 flex gap-2 items-center">
                                <Avatar online={true} username={onlineUsers[id]} id={id}/>
                                <span className="text-md text-gray-800">{onlineUsers[id]}</span>
                            </div>
                            
                        </div>
                    ))}
                </div>
                {/** MESSAGES */}
                <div className="flex flex-col bg-blue-200 w-2/3 p-4">
                    <div className="flex-grow">
                        {!selectedUser && (
                            <div className="flex h-full items-center justify-center">
                                <div className="text-gray-500">Select a user to start messaging</div>
                            </div>
                        )}
                        {!!selectedUser && (
                            <div className="relative h-full">
                                <div className="flex flex-col items-end overflow-y-scroll absolute inset-0">
                                    {messages.map((message, index) => (

                                        <div key={index} className={`p-2 rounded-lg max-w-sm ${
                                            message.messageData.message.sender === currentId
                                                ? 'bg-blue-500 text-white self-end'
                                                : 'bg-gray-200 text-gray-700 self-start'
                                        } mb-2`}>
                                            {message.messageData.message.text}
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                 </div>
                            </div>
                        )}
                    </div>
                    {/** MESSAGE SENDING */}
                    {!!selectedUser && (
                        <form className="flex gap-2" onSubmit={sendMessage}>
                            <input type="text" placeholder="Write a message..." className="bg-white border p-2 rounded-lg flex-grow" value={messageText} onChange={ev => setMessageText(ev.target.value)}/>
                            <button type='submit' className="bg-blue-500 p-2 text-white rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                                </svg>
                            </button>
                         </form>
                    )}
                    
                </div>
            </div>
        </>
    )
}