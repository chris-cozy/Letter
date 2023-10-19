
export default function MessageHistory({selectedUser, messages, renderMultimediaElements, currentId, messagesEndRef}){

    return (
        <div className="flex-grow">
            {selectedUser === null ? (
                <div className="flex h-full items-center justify-center">
                    <div className="text-gray-500">Select a user to start messaging</div>
                </div>
            ): (
                <div className="relative h-full ">
                    <div className="flex flex-col items-end overflow-y-scroll scrollbar-hide absolute inset-0 mb-3">
                        {messages.map(function (msg, index) {
                            const multimediaElement = renderMultimediaElements(msg.messageData.message)

                            return (
                                <div key={index} className={`p-2 mb-2 rounded-lg max-w-sm ${msg.messageData.message.sender === currentId ? 'bg-blue-500 text-white self-end mr-32' : 'bg-gray-200 text-gray-700 self-start ml-32'}`}>
                                    {multimediaElement === null ? (
                                        <div>
                                            {msg.messageData.message.text}
                                        </div>
                                    ) : (
                                        <div>
                                            {multimediaElement}
                                        </div>
                                    )}
                                </div>
                                
                            )
                        })}
                        <div ref={messagesEndRef} />
                    </div>
                </div>
            )}
        </div>
    )

}