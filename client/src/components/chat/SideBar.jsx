import Logo from "./Logo"
import User from "./User"

export default function SideBar({onlineUsers, offlineUsers, selectedUser, setSelectedUser, context, logout}) {

    return (
        
        <div className="bg-sidebar_background w-full flex flex-col">
            <div>
                <Logo />
            </div>
            <div className="flex-grow overflow-y-auto scrollbar-left">
                
                {Object.keys(onlineUsers).map((id, index) => (
                    <User key={index} id={id} username={onlineUsers[id]} online={true} selected={selectedUser === id} onClick={() => setSelectedUser(id)}/>
                ))}
                {Object.keys(offlineUsers).map((id, index) => (
                    <User key={index} id={id} username={offlineUsers[id]} online={false} selected={selectedUser === id} onClick={() => setSelectedUser(id)}/>
                ))}
            </div>
            
            <div className="pb-6 text-center flex items-center justify-center gap-3">
                <span className="p-4 text-sm text-sidebar_current_user flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
                    </svg>
                    {context.user.username}
                </span>
                <button className="text-sm bg-login_button transition delay-50 duration-300 ease-in-out transform hover:bg-login_button_hover hover:scale-105 py-2 px-8 text-login_button_text rounded-2xl" onClick={logout}>
                    Logout
                </button>
            </div>
        </div>
    )

}