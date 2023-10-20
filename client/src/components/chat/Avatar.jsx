

export default function Avatar({online, username, id}) {
    const colors = [
        'bg-teal-200', 
        'bg-red-200', 
        'bg-green-200', 
        'bg-purple-200', 
        'bg-blue-200', 
        'bg-yellow-200',
        'bg-gray-200',
        'bg-indigo-200',
        'bg-pink-200',
        'bg-orange-200',
        'bg-teal-300',
        'bg-red-300',
        'bg-green-300',
        'bg-purple-300',
        'bg-blue-300',
        'bg-yellow-300',
        'bg-gray-300',
        'bg-indigo-300',
        'bg-pink-300',
        'bg-orange-300',
        'bg-teal-400',
        'bg-red-400',
        'bg-green-400',
        'bg-purple-400',
        'bg-blue-400',
        'bg-yellow-400',
        'bg-gray-400',
        'bg-indigo-400',
        'bg-pink-400',
        'bg-orange-400',
    ];

    // Take the first 6 characters of the hexadecimal ID for color variation
    const colorIndex = parseInt(id.slice(0, 6), 16) % colors.length;
    const color = colors[colorIndex];
    return (
        <div className={"w-10 h-10 relative rounded-full border border-sidebar_contact_bottom_border flex items-center " + color}>
            <div className="text-center w-full opacity-70 text-lg">
                {username[0]}
            </div>
            {/** If online, green dot. If offline, grey dot  */}
            {online ? (<div className="absolute w-3 h-3 bg-green-500 rounded-full bottom-0 right-0 border border-sidebar_background">
            </div>) : (<div className="absolute w-3 h-3 bg-gray-500 rounded-full bottom-0 right-0 border-2 border-sidebar_background">
            </div>)}
        </div>
    )
}