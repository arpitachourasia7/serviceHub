// import { useState, useRef, useEffect, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { getConversations, getMessages, markMessagesRead } from '../services/chat';
// import './Chat.css';

// function Chat() {
//     const [conversations, setConversations] = useState([]);
//     const [selectedConversation, setSelectedConversation] = useState(null);
//     const [messages, setMessages] = useState([]);
//     const [newMessage, setNewMessage] = useState('');
//     const [user, setUser] = useState(null);
//     const [typingUser, setTypingUser] = useState(null);
//     const messagesEndRef = useRef(null);
//     const wsRef = useRef(null);
//     const typingTimeoutRef = useRef(null);
//     const navigate = useNavigate();

//     useEffect(() => {
//         const token = localStorage.getItem('access_token');
//         if (!token) { navigate('/login'); return; }
//         setUser({
//             id: localStorage.getItem('user_id'),
//             username: localStorage.getItem('username'),
//         });
//         fetchConversations();
//     }, []);

//     useEffect(() => {
//         messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     }, [messages]);

//     useEffect(() => {
//         if (!selectedConversation) return;
//         fetchMessages(selectedConversation.id);
//         connectWebSocket(selectedConversation.id);
//         return () => wsRef.current?.close();
//     }, [selectedConversation]);

//     const fetchConversations = async () => {
//         try {
//             const res = await getConversations();
//             // Handle both paginated and non-paginated responses
//             const data = res.data.results ?? res.data;
//             setConversations(data);
//             if (data.length > 0) setSelectedConversation(data[0]);
//         } catch (err) {
//             console.error('Error fetching conversations:', err);
//         }
//     };

//     const fetchMessages = async (conversationId) => {
//         try {
//             const res = await getMessages(conversationId);
//             const data = res.data.results ?? res.data;
//             const currentUserId = localStorage.getItem('user_id');
//             setMessages(data.map(msg => ({
//                 id: msg.id,
//                 text: msg.content,
//                 // Compare sender UUID (as string) to stored user_id
//                 isMine: String(msg.sender) === String(currentUserId),
//                 time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//                 sender_name: msg.sender_name,
//             })));
//             await markMessagesRead(conversationId);
//         } catch (err) {
//             console.error('Error fetching messages:', err);
//         }
//     };

//     const connectWebSocket = useCallback((conversationId) => {
//         wsRef.current?.close();
//         const token = localStorage.getItem('access_token');
//         // Pass JWT token as query param — handled by JwtAuthMiddleware





//         //const ws = new WebSocket(
//         `ws://localhost:8001/ws/chat/${conversationId}/?token=${token}`
//         );

//     ws.onopen = () => console.log('WebSocket connected');

//     ws.onmessage = (event) => {
//         const data = JSON.parse(event.data);
//         const currentUserId = localStorage.getItem('user_id');

//         if (data.type === 'message') {
//             setMessages(prev => [...prev, {
//                 id: data.message_id,
//                 text: data.content,
//                 // Use sender_id from server for reliable isMine check
//                 isMine: String(data.sender_id) === String(currentUserId),
//                 time: new Date(data.created_at).toLocaleTimeString([], {
//                     hour: '2-digit', minute: '2-digit'
//                 }),
//                 sender_name: data.sender_name,
//             }]);
//             setTypingUser(null);
//         } else if (data.type === 'typing') {
//             if (String(data.sender_id) !== String(currentUserId)) {
//                 setTypingUser(data.is_typing ? data.sender_name : null);
//             }
//         }
//     };

//     ws.onclose = (e) => console.log('WebSocket closed', e.code);
//     ws.onerror = (e) => console.error('WebSocket error', e);
//     wsRef.current = ws;
// }, []);

// const sendMessage = () => {
//     if (!newMessage.trim() || !wsRef.current) return;
//     wsRef.current.send(JSON.stringify({ type: 'message', content: newMessage }));
//     setNewMessage('');
// };

// const handleTyping = (e) => {
//     setNewMessage(e.target.value);
//     if (!wsRef.current) return;
//     wsRef.current.send(JSON.stringify({ type: 'typing', is_typing: true }));
//     clearTimeout(typingTimeoutRef.current);
//     typingTimeoutRef.current = setTimeout(() => {
//         wsRef.current?.send(JSON.stringify({ type: 'typing', is_typing: false }));
//     }, 1500);
// };

// const getOtherParty = (conv) => {
//     const myId = localStorage.getItem('user_id');
//     const isCustomer = String(conv.customer_detail?.id) === String(myId);
//     return isCustomer ? conv.provider_detail : conv.customer_detail;
// };

// const logout = () => { localStorage.clear(); window.location.href = '/login'; };

// return (
//     <div>
//         <div className="chat-header">
//             <h1>ServiceHub Chat</h1>
//             <div className="chat-nav">
//                 <button onClick={() => navigate('/')}>Home</button>
//                 <button onClick={() => navigate('/services')}>Services</button>
//                 <button onClick={() => navigate('/bookings')}>Bookings</button>
//                 <button onClick={() => navigate('/reviews')}>Reviews</button>
//                 <button onClick={logout}>Logout</button>
//             </div>
//         </div>

//         <div className="chat-container">
//             <div className="chat-sidebar">
//                 <h3>Conversations</h3>
//                 {conversations.map(conv => {
//                     const other = getOtherParty(conv);
//                     return (
//                         <div
//                             key={conv.id}
//                             className={`chat-conversation ${selectedConversation?.id === conv.id ? 'active' : ''}`}
//                             onClick={() => setSelectedConversation(conv)}
//                         >
//                             <div className="conv-avatar">👤</div>
//                             <div className="conv-info">
//                                 <div className="conv-name">{other?.username ?? '—'}</div>
//                                 <div className="conv-last-msg">
//                                     {conv.last_message?.content ?? 'No messages yet'}
//                                 </div>
//                             </div>
//                             <div className="conv-time">
//                                 {conv.updated_at
//                                     ? new Date(conv.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
//                                     : ''}
//                             </div>
//                             {conv.unread_count > 0 && (
//                                 <span className="unread-badge">{conv.unread_count}</span>
//                             )}
//                         </div>
//                     );
//                 })}
//             </div>

//             <div className="chat-area">
//                 {selectedConversation ? (
//                     <>
//                         <div className="chat-area-header">
//                             <div className="chat-with">
//                                 {getOtherParty(selectedConversation)?.username ?? '—'}
//                             </div>
//                         </div>
//                         <div className="chat-messages">
//                             {messages.map(msg => (
//                                 <div key={msg.id} className={`chat-message ${msg.isMine ? 'mine' : 'theirs'}`}>
//                                     {!msg.isMine && (
//                                         <div className="sender-name">{msg.sender_name}</div>
//                                     )}
//                                     <div className="message-bubble">
//                                         {msg.text}
//                                         <div className="message-time">{msg.time}</div>
//                                     </div>
//                                 </div>
//                             ))}
//                             {typingUser && (
//                                 <div className="chat-message theirs">
//                                     <div className="message-bubble typing-indicator">
//                                         <span>{typingUser} is typing</span>
//                                         <span className="dots">...</span>
//                                     </div>
//                                 </div>
//                             )}
//                             <div ref={messagesEndRef} />
//                         </div>
//                         <div className="chat-input-area">
//                             <input
//                                 type="text"
//                                 value={newMessage}
//                                 onChange={handleTyping}
//                                 onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
//                                 placeholder="Type a message..."
//                             />
//                             <button onClick={sendMessage}>Send</button>
//                         </div>
//                     </>
//                 ) : (
//                     <div className="no-chat-selected">Select a conversation to start chatting</div>
//                 )}
//             </div>
//         </div>
//     </div>
// );
// }

// export default Chat;




import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getConversations, getMessages, markMessagesRead } from '../services/chat';
import './Chat.css';

function Chat() {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [user, setUser] = useState(null);
    const [typingUser, setTypingUser] = useState(null);
    const messagesEndRef = useRef(null);
    const wsRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const navigate = useNavigate();

    // Load user info
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            navigate('/login');
            return;
        }
        setUser({
            id: localStorage.getItem('user_id'),
            username: localStorage.getItem('username'),
        });
        fetchConversations();
    }, []);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // WebSocket connection
    useEffect(() => {
        if (!selectedConversation) return;

        const token = localStorage.getItem('access_token');
        const wsUrl = `ws://localhost:8000/ws/chat/${selectedConversation.id}/?token=${token}`;

        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.close();
        }

        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            console.log('✅ WebSocket connected for conversation:', selectedConversation.id);
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log('📨 Message received:', data);

                const currentUserId = localStorage.getItem('user_id');

                // Only add message if it's NOT from the current user
                if (String(data.sender_id) !== String(currentUserId)) {
                    setMessages(prev => [...prev, {
                        id: data.message_id || Date.now(),
                        text: data.content,
                        isMine: false,
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        sender_name: data.sender_name
                    }]);
                }

                setTypingUser(null);
            } catch (err) {
                console.error('Error parsing message:', err);
            }
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        ws.onclose = (event) => {
            console.log('WebSocket closed:', event.code, event.reason);
            // Reconnect after 3 seconds
            setTimeout(() => {
                if (selectedConversation) {
                    console.log('Reconnecting...');
                    const newWs = new WebSocket(wsUrl);
                    wsRef.current = newWs;
                }
            }, 3000);
        };

        wsRef.current = ws;

        // Fetch messages when conversation changes
        fetchMessages(selectedConversation.id);
        markMessagesRead(selectedConversation.id);

        return () => {
            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                wsRef.current.close();
            }
        };
    }, [selectedConversation]);

    const fetchConversations = async () => {
        try {
            const res = await getConversations();
            const data = res.data.results ?? res.data;
            setConversations(data);
            if (data.length > 0) {
                setSelectedConversation(data[0]);
            }
        } catch (err) {
            console.error('Error fetching conversations:', err);
        }
    };

    const fetchMessages = async (conversationId) => {
        try {
            const res = await getMessages(conversationId);
            const data = res.data.results ?? res.data;
            const currentUserId = localStorage.getItem('user_id');
            setMessages(data.map(msg => ({
                id: msg.id,
                text: msg.content,
                isMine: String(msg.sender) === String(currentUserId),
                time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                sender_name: msg.sender_name,
            })));
        } catch (err) {
            console.error('Error fetching messages:', err);
        }
    };

    const sendMessage = () => {
        if (!newMessage.trim()) return;

        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            // Send to WebSocket
            wsRef.current.send(JSON.stringify({
                type: 'message',
                content: newMessage,
                sender_name: user?.username
            }));

            // Add message locally (optimistic update)
            setMessages(prev => [...prev, {
                id: Date.now(),
                text: newMessage,
                isMine: true,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                sender_name: user?.username
            }]);

            setNewMessage('');
        } else {
            console.error('WebSocket is not connected. State:', wsRef.current?.readyState);
            alert('WebSocket not connected. Please refresh the page.');
        }
    };

    const handleTyping = (e) => {
        setNewMessage(e.target.value);
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

        wsRef.current.send(JSON.stringify({ type: 'typing', is_typing: true }));
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            if (wsRef.current?.readyState === WebSocket.OPEN) {
                wsRef.current.send(JSON.stringify({ type: 'typing', is_typing: false }));
            }
        }, 1500);
    };

    const getOtherParty = (conv) => {
        const myId = localStorage.getItem('user_id');
        const isCustomer = String(conv.customer_detail?.id) === String(myId);
        return isCustomer ? conv.provider_detail : conv.customer_detail;
    };

    const logout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    return (
        <div>
            <div className="chat-header">
                <h1>ServiceHub Chat</h1>
                <div className="chat-nav">
                    <button onClick={() => navigate('/')}>Home</button>
                    <button onClick={() => navigate('/services')}>Services</button>
                    <button onClick={() => navigate('/bookings')}>Bookings</button>
                    <button onClick={() => navigate('/reviews')}>Reviews</button>
                    <button onClick={logout}>Logout</button>
                </div>
            </div>

            <div className="chat-container">
                <div className="chat-sidebar">
                    <h3>Conversations</h3>
                    {conversations.map(conv => {
                        const other = getOtherParty(conv);
                        return (
                            <div
                                key={conv.id}
                                className={`chat-conversation ${selectedConversation?.id === conv.id ? 'active' : ''}`}
                                onClick={() => setSelectedConversation(conv)}
                            >
                                <div className="conv-avatar">👤</div>
                                <div className="conv-info">
                                    <div className="conv-name">{other?.username ?? '—'}</div>
                                    <div className="conv-last-msg">
                                        {conv.last_message?.content ?? 'No messages yet'}
                                    </div>
                                </div>
                                <div className="conv-time">
                                    {conv.updated_at
                                        ? new Date(conv.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                        : ''}
                                </div>
                                {conv.unread_count > 0 && (
                                    <span className="unread-badge">{conv.unread_count}</span>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="chat-area">
                    {selectedConversation ? (
                        <>
                            <div className="chat-area-header">
                                <div className="chat-with">
                                    {getOtherParty(selectedConversation)?.username ?? '—'}
                                </div>
                            </div>
                            <div className="chat-messages">
                                {messages.map(msg => (
                                    <div key={msg.id} className={`chat-message ${msg.isMine ? 'mine' : 'theirs'}`}>
                                        {!msg.isMine && (
                                            <div className="sender-name">{msg.sender_name}</div>
                                        )}
                                        <div className="message-bubble">
                                            {msg.text}
                                            <div className="message-time">{msg.time}</div>
                                        </div>
                                    </div>
                                ))}
                                {typingUser && (
                                    <div className="chat-message theirs">
                                        <div className="message-bubble typing-indicator">
                                            <span>{typingUser} is typing...</span>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                            <div className="chat-input-area">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={handleTyping}
                                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                                    placeholder="Type a message..."
                                />
                                <button onClick={sendMessage}>Send</button>
                            </div>
                        </>
                    ) : (
                        <div className="no-chat-selected">Select a conversation to start chatting</div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Chat;