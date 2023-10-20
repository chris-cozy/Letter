

export default function Logo() {

    return (
        <div className="h-16 text-app_title font-bold text-2xl flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 transition delay-50 duration-300 ease-in-out transform hover:scale-125 cursor-default">
                <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
            </svg>
            <div className="flex">
                <span className="text-2xl font-bold mb-1 text-app_title transition delay-50 duration-300 ease-in-out transform hover:scale-125 cursor-default">
                L
                </span>
                <span className="text-2xl font-bold mb-1 text-app_title transition delay-50 duration-300 ease-in-out transform hover:scale-125 cursor-default">
                e
                </span>
                <span className="text-2xl font-bold mb-1 text-app_title transition delay-50 duration-300 ease-in-out transform hover:scale-125 cursor-default">
                t
                </span>
                <span className="text-2xl font-bold mb-1 text-app_title transition delay-50 duration-300 ease-in-out transform hover:scale-125 cursor-default">
                t
                </span>
                <span className="text-2xl font-bold mb-1 text-app_title transition delay-50 duration-300 ease-in-out transform hover:scale-125 cursor-default">
                e
                </span>
                <span className="text-2xl font-bold mb-1 text-app_title transition delay-50 duration-300 ease-in-out transform hover:scale-125 cursor-default">
                r
                </span>
            </div>
        </div>
    )
}