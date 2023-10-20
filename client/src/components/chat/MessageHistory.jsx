
export default function MessageHistory({selectedUser, messages, renderMultimediaElements, currentId, messagesEndRef}){

    return (
        <div className="flex flex-grow items-center justify-center overflow-y-auto overflow-x-hidden">
            {selectedUser === null ? (
                <div className="flex h-full items-center justify-center text-sidebar_contact_name">
                    Select a user to start messaging
                </div>
            ): (
                messages.length === 0 ? (
                    <div className="flex h-full items-center justify-center">
                        <div className="text-sidebar_contact_name">Send a message to begin chatting</div>
                    </div>
                ) : (
                    <div className="relative h-full w-4/5">
                        <div className="flex flex-col items-end absolute inset-0 mb-3">
                                {messages.map(function (msg, index) {
                                    const multimediaElement = renderMultimediaElements(msg.messageData.message)
        
                                    return (
                                        <div key={index} className={` mb-2 rounded-2xl max-w-sm ${msg.messageData.message.sender === currentId ? 'bg-user_message_bubble text-user_message_text self-end lg:mr-28' : 'bg-sender_message_bubble text-sender_message_text self-start lg:ml-28'}`}>
                                            {multimediaElement === null ? (
                                                <div className="font-semibold text-lg px-4 py-2">
                                                    {msg.messageData.message.text}
                                                </div>
                                            ) : (
                                                <div className="">
                                                    {multimediaElement}
                                                </div>
                                            )}
                                        </div>
                                        
                                    )
                                })}
                            
                            <div ref={messagesEndRef} />
                        </div>
                     </div>
                )
                
               
            )}
        </div>
    )

}