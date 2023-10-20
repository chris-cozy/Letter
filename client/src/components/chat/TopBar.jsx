
export default function TopBar({selectedUser, onClick, allUsers}){


    return (
        <div className="flex bg-sidebar_background h-16 md:border-l-2 border-message_history_background text-white justify-center items-center text-center">
            {selectedUser == null ? (
                <div>
                </div>
            ) : (
                <button className="md:hidden" onClick={onClick}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                </svg>
            </button>
            )}
            <div className="w-4/5">
            {selectedUser == null ? (
                <div></div>
                ) : (
                    <div className="text-sidebar_contact_name font-bold text-xl">
                    {allUsers[selectedUser]}
                </div>
                )}
            </div>
    </div>
    )
}