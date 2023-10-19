import Avatar from "./Avatar";

export default function User({id, username, online, selected, onClick}) {

    return (
        <div key={id} className={"flex border-b cursor-pointer " + (selected ? 'bg-blue-200 font-semibold' : '')} onClick={onClick}>
            {selected && (
                <div className="w-1 bg-blue-500 h-half rounded-r-lg"></div>
            )}
            <div className="pl-4 py-2 flex gap-2 items-center">
                <Avatar online={online} username={username} id={id}/>
                <span className="text-md text-gray-800">{username}</span>
            </div>
        </div>
    )
    
}