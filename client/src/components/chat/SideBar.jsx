import Logo from "./Logo"
import User from "./User"

export default function SideBar({onlineUsers, offlineUsers, selectedUser, setSelectedUser, context, logout}) {

    return (
        
        <div className="bg-blue-50 w-1/4 flex flex-col">
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
    )

}