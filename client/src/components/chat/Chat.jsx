import { useContext, useEffect, useRef, useState } from "react"
import User from "./User";
import Logo from "./Logo";
import Form from "./Form";
import SideBar from "./SideBar";
import { UserContext } from "../UserContext";
import axios from 'axios';
import MessageHistory from "./MessageHistory";


export default function Chat() {
    const [ws, setWs] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState({});
    const [offlineUsers, setOfflineUsers] = useState({});
    const [selectedUser, setSelectedUser] = useState(null);
    const [messageText, setMessageText] = useState('');
    const [messages, setMessages] = useState([])
    const context = useContext(UserContext);
    const currentId = context.user._id
    const token = localStorage.getItem('token');
    const messagesEndRef = useRef(null);

    /** USE EFFECTS */

    useEffect(() => {
        if(messages.length > 0){
            scrollToCurrent();
        }
    }, [messages]);

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


        // If user logged in and selects a user, connect web socket
        if(token){
            connectWebSocket(token);
        }else{
            logout();
        }
    }, [selectedUser, token]) //eslint-disable-line react-hooks/exhaustive-deps

    // Handle online/offline users
    useEffect(() => {
        axios.get('/v1/user').then((res) => {
            const offlineUsers = res.data.filter(user => user._id !== currentId).filter(user => !Object.keys(onlineUsers).includes(user._id))
            const formattedUsers = {}
            offlineUsers.forEach((user) => {
                formattedUsers[user._id] = user.username
            })
            setOfflineUsers(formattedUsers);
        })
    }, [onlineUsers])


    /** HELPER FUNCTIONS */

    function connectWebSocket(token){
        const socket = new WebSocket('ws://127.0.0.1:4040')
        setWs(socket);

        socket.onopen = (event) => {
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
            console.log("Disconnected. Trying to reconnect...");
            setTimeout(() => {connectWebSocket()}, 1000)
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
        const otherOnlineUsers = {};
        users.forEach(({id, username}) => {
            if (id && id != currentId){
                otherOnlineUsers[id] = username;
            }
        });
        setOnlineUsers(otherOnlineUsers);
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
        setMessageText('');

        ws.send(JSON.stringify(userMessage))
        setMessages(prev => ([...prev, {messageData: userMessage}]))
    }

    function logout(){
        if (ws) {
            ws.send(JSON.stringify({ type: 'logout' })); // Notify the server about logout
            //ws.close(); // Close the WebSocket connection
        }
        setWs(null);
        localStorage.removeItem('token');
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
                element = <img key={index} src={url} alt="Image" className="multimedia-element" style={{ height: "200px" }} onLoad={scrollToCurrent}/>;
            } else if (/\.(mp4)$/i.test(url)) {
                element = (
                    <video key={index} controls className="multimedia-element" style={{ height: "200px" }} onLoad={scrollToCurrent}>
                        <source src={url} type="video/mp4" />
                    </video>
                );
            } 
            return element;
        });
    }

    function scrollToCurrent() {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
    }

    return (
        <>
            <div className="flex h-screen">
                {/** SIDE BAR */}
                    <SideBar onlineUsers={onlineUsers} offlineUsers={offlineUsers} selectedUser={selectedUser} setSelectedUser={setSelectedUser} context={context} logout={logout}/>
                {/** MAIN BAR */}
                <div className="flex flex-col bg-blue-200 w-3/4 p-4">
                    {/** MESSAGES */}
                    <MessageHistory selectedUser={selectedUser} messages={messages} renderMultimediaElements={renderMultimediaElements} currentId={currentId} messagesEndRef={messagesEndRef}/>
                    {/** FORM */}
                    {!!selectedUser && (
                        <Form onSubmit={sendMessage} onChange={(ev) => {setMessageText(ev.target.value)}} value={messageText} sendFile={sendFile}/>
                    )}
                    
                </div>
            </div>
        </>
    )
}