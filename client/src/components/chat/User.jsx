import Avatar from "./Avatar";

export default function User({id, username, online, selected, onClick}) {

    return (
        <div className="items-center">
            <div key={id} className={"flex py-2 cursor-pointer " + (selected ? 'bg-message_history_background font-semibold' : 'hover:bg-form_background')} onClick={onClick}>
                {selected && (
                    <div className="w-1 bg-sidebar_logo h-half rounded-r-2xl"></div>
                )}
                <div className="pl-4 py-2 flex gap-4">
                    <Avatar online={online} username={username} id={id}/>
                    <div className="flex flex-col">
                    <span className="text-lg text-sidebar_contact_name">{username}</span>
                    <span className="text-sm text-app_slogan w-full px-4">message previews coming soon</span>
                    </div>
                </div>
            </div>
            <div className="mx-auto w-11/12 border-b-2 border-sidebar_contact_bottom_border">

            </div>
        </div>
    )
    
}