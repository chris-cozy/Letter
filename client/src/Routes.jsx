import { useContext } from "react";
import Authentication from "./components/auth/Authentication";
import { UserContext } from "./components/UserContext";



export default function Routes() {

    const {username, id} = useContext(UserContext);

    if (username) {
        return `logged in as ${username}`
    }
    return (
        <Authentication />
    )
}