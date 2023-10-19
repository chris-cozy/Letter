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
    console.log(context.user)
    const currentId = context.user._id
    

    const messagesEndRef = useRef(null);

    useEffect(() => {
        setMessages([])
        if (selectedUser){
            axios.get(`/v1/messages/${currentId}/${selectedUser}`).then((res) => {
                const messages = res.data;
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
    }, [selectedUser]) //eslint-disable-line react-hooks/exhaustive-deps

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
    }, [onlineUsers])

    function connectWebSocket(){

        const token = localStorage.getItem('token');

        if (!token){
            return;
        }

        const socket = new WebSocket('ws://127.0.0.1:4040')
        setWs(socket);

        

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
            if (token) {
                console.log("Disconnected. Trying to reconnect...");
                setTimeout(() => {connectWebSocket()}, 1000)
            }
            
        })

        socket.onerror = (error) => {
            console.error('WebSocket Error: ', error);
        };
    }

    const uniqueMessageIds = new Set();
    function handleMessage(event) {
        const messageData = JSON.parse(event.data);
        if (messageData.type === 'online'){
            showOnlineUsers(messageData.online);
        } else if (messageData.type === 'message') {
            console.log(messageData.message.sender === selectedUser)

            if (messageData.message.sender === selectedUser){
                if (!uniqueMessageIds.has(messageData.messageId)){
                    uniqueMessageIds.add(messageData.messageId);
                    console.log(messageData);
                    setMessages(prev => ([...prev, {messageData: messageData}]));
                } else {
                    console.log('Duplicate message ID found. Message ignored.');
                }
            }

            
            
        } else if (messageData.type == 'tokenExpired') {
            logout();
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

    function logout(){
        if (ws) {
            ws.send(JSON.stringify({ type: 'logout' })); // Notify the server about logout
            //ws.close(); // Close the WebSocket connection
        }
        context.setUser(null);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setWs(null);
        // Force a page reload
        window.location.reload();
        
    }

    function sendFile(ev) {
        const file = ev.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        
        // Use Axios or Fetch API to upload the file to the server
        axios.post('/v1/messages/file', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then((response) => {
            // Handle the response, which may contain the file URL on the server
            const fileUrl = response.data.fileUrl;
            
            // Send the file URL to the server along with other message data
            const userMessage = {
                type: 'message',
                message: {
                    sender: currentId,
                    recipient: selectedUser,
                    text: `${fileUrl}`, // You can format the message text as needed
                },
            };
            
            ws.send(JSON.stringify(userMessage));
            setMessages(prev => ([...prev, {messageData: userMessage}]));
        }).catch((error) => {
            console.error(error)
        });
    }

    function parseMultimediaUrls(text) {
        const multimediaRegex = /\.(jpg|jpeg|png|gif|mp4)$/i;
        const urlRegex = /(https?:\/\/[^\s]+)/g;
    
        const urls = text.match(urlRegex) || [];
        const multimediaUrls = urls.filter(url => multimediaRegex.test(url));
    
        return multimediaUrls;
    }

    function renderMultimediaElements(message) {
        const multimediaUrls = parseMultimediaUrls(message.text);

        if (multimediaUrls.length === 0){
            return null;
        }
        
    
        return multimediaUrls.map((url, index) => {
            let element = null;
            if (/\.(jpg|jpeg|png|gif)$/i.test(url)) {
                element = <img key={index} src={url} alt="Image" className="multimedia-element" style={{ height: "200px" }} onLoad={handleImageLoad}/>;
            } else if (/\.(mp4)$/i.test(url)) {
                
                element = (
                    <video key={index} controls className="multimedia-element" style={{ height: "200px" }} onLoad={handleImageLoad}>
                        <source src={url} type="video/mp4" />
                    </video>
                );
            } 
            return element;
        });
    }

    function handleImageLoad() {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
    }

    return (
        <>
            <div className="flex h-screen">
                {/** SIDE BAR */}
                <div className="bg-blue-50 w-1/3 flex flex-col">
                    <div className="flex-grow">
                        <Logo />
                        {Object.keys(onlineUsers).map((id, index) => (
                            <User key={index} id={id} username={onlineUsers[id]} online={true} selected={selectedUser === id} onClick={() => setSelectedUser(id)}/>
                        ))}
                        {Object.keys(offlineUsers).map((id, index) => (
                            <User key={index} id={id} username={offlineUsers[id]} online={false} selected={selectedUser === id} onClick={() => setSelectedUser(id)}/>
                        ))}
                    </div>
                    
                    <div className="p-2 text-center flex items-center justify center">
                        <span className="m-4 text-sm text-gray-500 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
                            </svg>
                            {context.user.username}
                        </span>
                        <button className="text-sm bg-blue-500 py-2 px-8 text-white border rounded-lg" onClick={logout}>
                            Logout
                        </button>
                    </div>
                </div>
                {/** MAIN BAR */}
                <div className="flex flex-col bg-blue-200 w-2/3 p-4">
                    {/** MESSAGES */}
                    <div className="flex-grow">
                        {!selectedUser && (
                            <div className="flex h-full items-center justify-center">
                                <div className="text-gray-500">Select a user to start messaging</div>
                            </div>
                        )}
                        {!!selectedUser && (
                            <div className="relative h-full">
                                <div className="flex flex-col items-end overflow-y-scroll absolute inset-0">
                                    {messages.map(function (msg, index) {
                                        const multimediaElement = renderMultimediaElements(msg.messageData.message)

                                        return (
                                            <div key={index} className={`p-2 mb-2 rounded-lg max-w-sm ${msg.messageData.message.sender === currentId ? 'bg-blue-500 text-white self-end' : 'bg-gray-200 text-gray-700 self-start'}`}>
                                                {multimediaElement === null ? (
                                                    <div>
                                                        {msg.messageData.message.text}
                                                    </div>
                                                ) : (
                                                    <div>
                                                        {multimediaElement}
                                                    </div>
                                                )}
                                            </div>
                                            
                                        )
                                    })}
                                    <div ref={messagesEndRef} />
                                 </div>
                            </div>
                        )}
                    </div>
                    {/** FORM */}
                    {!!selectedUser && (
                        <Form onSubmit={sendMessage} onChange={(ev) => {setMessageText(ev.target.value)}} value={messageText} sendFile={sendFile}/>
                    )}
                    
                </div>
            </div>
        </>
    )
}