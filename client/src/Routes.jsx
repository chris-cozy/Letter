import { useContext } from "react";
import Register from "./components/auth/Register";
import { UserContext } from "./components/UserContext";



export default function Routes() {
    const {username, id} = useContext(UserContext);

    if (username) {
        return 'logged in'
    }
    return (
        <Register />
    )
}