import { useContext } from "react";
import Authentication from "./auth/Authentication";
import Chat from "./chat/Chat"
import { UserContext } from "./UserContext";



export default function Routes() {

    const {user} = useContext(UserContext);

    if (!user) {
        return <Authentication />
    }
    
    return <Chat />
}