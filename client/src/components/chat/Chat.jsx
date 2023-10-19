import { useContext, useEffect, useRef, useState } from "react"
import User from "./User";
import Logo from "./Logo";
import Form from "./Form";
import { UserContext } from "../UserContext";
import axios from 'axios';


export default function Chat() {
    const [ws, setWs] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState({});
    const [offlineUsers, setOfflineUsers] = useState({});
    const [selectedUser, setSelectedUser] = useState(null);
    const [messageText, setMessageText] = useState('');
    const [messages, setMessages] = useState([])
    const context = useContext(UserContext);
    const currentId = context.user._id
    const uniqueMessageIds = new Set();

    const messagesEndRef = useRef(null);

    useEffect(() => {
        setMessages([])
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

    // Handle online/offline users
    useEffect(() => {
        axios.get('/v1/user').then((res) => {
            // Filter to only offline users
            const offlineUsers = res.data.filter(user => user._id !== currentId).filter(user => !Object.keys(onlineUsers).includes(user._id))
            const formattedUsers = {}
            offlineUsers.forEach((user) => {
                formattedUsers[user._id] = user.username
            })
            setOfflineUsers(formattedUsers);
        })
        console.log(onlineUsers);
        console.log(offlineUsers);
    }, [onlineUsers])

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
            console.log('Auth handshake message sent')
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
        //console.log(messageData);
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
                    {Object.keys(onlineUsers).map((id, index) => (
                        <User key={index} id={id} username={onlineUsers[id]} online={true} selected={selectedUser === id} onClick={() => setSelectedUser(id)}/>
                    ))}
                    {Object.keys(offlineUsers).map((id, index) => (
                        <User key={index} id={id} username={offlineUsers[id]} online={false} selected={selectedUser === id} onClick={() => setSelectedUser(id)}/>
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
                        <Form onSubmit={sendMessage} onChange={(ev) => {setMessageText(ev.target.value)}} value={messageText}/>
                    )}
                    
                </div>
            </div>
        </>
    )
}