import { useContext } from "react";
import Authentication from "./components/auth/Authentication";
import Chat from "./components/chat/Chat"
import { UserContext } from "./components/UserContext";



export default function Routes() {

    const {user} = useContext(UserContext);

    if (!user) {
        return <Authentication />
    }
    
    return <Chat />
}