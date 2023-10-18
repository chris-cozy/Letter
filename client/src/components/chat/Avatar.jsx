// This is for the user's avatar
export default function Avatar({username, id}) {
    const colors = ['bg-teal-200', 'bg-red-200', 'bg-green-200', 'bg-purple-200', 'bg-blue-200', 'bg-yellow-200']

    const idBase10 = parseInt(id, 16);
    const colorIndex = idBase10 % colors.length;
    const color = colors[colorIndex]
    console.log();
    return (
        <div className={"w-10 h-10 rounded-full border flex items-center " + color}>
            <div className="text-center w-full opacity-70 text-lg">{username[0]}</div>
        </div>
    )
}