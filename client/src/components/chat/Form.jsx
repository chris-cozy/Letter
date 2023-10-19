
export default function Form({onSubmit, onChange, value}) {

    return (
        <form className="flex gap-2" onSubmit={onSubmit}>
            <input type="text" placeholder="Write a message..." className="bg-white border p-2 rounded-lg flex-grow" value={value} onChange={onChange}/>
            <button type='submit' className="bg-blue-500 p-2 text-white rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
            </button>
        </form>
    )
}