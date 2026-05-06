import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getConversations, getMessages, markMessagesRead, sendMessage as sendMessageAPI } from '../services/chat';
import './Chat.css';

function Chat() {
    const [conversations, setConversations] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [typing, setTyping] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [connectionError, setConnectionError] = useState(null);
    const messagesEndRef = useRef(null);
    const wsRef = useRef(null);
    const typingTimeout = useRef(null);
    const navigate = useNavigate();



    const location = useLocation();

    const userId = localStorage.getItem('user_id');
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('access_token');

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (!selectedChat) return;

        if (!token) {
            console.error('No auth token found');
            setConnectionError('No authentication token');
            return;
        }

        const conversationId = selectedChat.id;
        const wsUrl = `ws://localhost:8000/ws/chat/${conversationId}/?token=${token}`;
        console.log('Connecting to WebSocket:', wsUrl);

        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            console.log('✅ WebSocket connected successfully');
            console.log('Conversation ID:', conversationId);
            console.log('User:', username);
            console.log('User ID:', userId);
            setIsConnected(true);
            setConnectionError(null);
        };

        ws.onerror = (error) => {
            console.error('❌ WebSocket error:', error);
            setConnectionError('Connection error');
            setIsConnected(false);
        };

        ws.onclose = (event) => {
            console.log('WebSocket closed:', event.code, event.reason);
            setIsConnected(false);
        };

        ws.onmessage = (e) => {
            try {
                const data = JSON.parse(e.data);
                console.log('📨 Received message:', data);

                if (data.type === 'connection') {
                    console.log('✅ Connection info:', data);
                    setIsConnected(true);
                }
                else if (data.type === 'message') {
                    const currentUserId = String(userId);
                    const messageSenderId = String(data.sender_id);

                    const isMessageFromMe = (messageSenderId === currentUserId);

                    console.log('🔍 Message analysis:', {
                        isMessageFromMe,
                        currentUserId,
                        messageSenderId,
                        content: data.content
                    });


                    let senderName = data.sender;
                    if (!senderName || senderName === 'AnonymousUser') {
                        senderName = 'User';
                    }

                    const messageId = data.message_id || `${Date.now()}_${Math.random()}`;

                    const newMsg = {
                        id: messageId,
                        text: data.content,
                        isMine: isMessageFromMe,
                        time: data.created_at ? new Date(data.created_at).toLocaleTimeString() : new Date().toLocaleTimeString(),
                        sender: isMessageFromMe ? 'You' : senderName
                    };

                    console.log('➕ Adding new message:', newMsg);

                    setMessages(prev => {
                        const exists = prev.some(msg =>
                            msg.id === messageId ||
                            (msg.text === data.content && msg.time === newMsg.time)
                        );
                        if (exists) {
                            console.log('⚠️ Message already exists, skipping');
                            return prev;
                        }
                        return [...prev, newMsg];
                    });


                    setTyping(null);
                }
                else if (data.type === 'typing') {
                    const isFromOther = String(data.sender_id) !== String(userId);

                    if (data.is_typing && isFromOther) {
                        let senderName = data.sender;
                        if (senderName === 'AnonymousUser') senderName = 'User';
                        setTyping(`${senderName} is typing...`);
                    } else {
                        setTyping(null);
                    }
                }
            } catch (err) {
                console.error('❌ Error parsing message:', err);
            }
        };

        wsRef.current = ws;


        fetchMessages(selectedChat.id);
        markMessagesRead(selectedChat.id);

        return () => {
            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                wsRef.current.close();
            }
        };
    }, [selectedChat, userId, username, token]);

    const fetchConversations = async () => {
        try {
            const res = await getConversations();
            const data = res.data.results || res.data;
            setConversations(data);

            if (location.state?.conversationId) {
                const targetConv = data.find(
                    c => c.id === location.state.conversationId
                );
                if (targetConv) {
                    setSelectedChat(targetConv);
                    return;
                }
            }

            if (data.length > 0 && !selectedChat) {
                setSelectedChat(data[0]);
            }
        } catch (err) {
            console.error('Error fetching conversations:', err);
        }
    };

    const fetchMessages = async (chatId) => {
        try {
            const res = await getMessages(chatId);
            const data = res.data.results || res.data;
            console.log('Messages fetched:', data);

            const loadedMessages = data.map(msg => {
                const isMine = String(msg.sender) === userId ||
                    msg.sender_id === userId ||
                    msg.sender === username;

                let senderName = msg.sender_name || msg.sender;
                if (senderName && (senderName.includes('(') || senderName === 'AnonymousUser')) {
                    senderName = senderName.split('(')[0].trim();
                    if (senderName === 'AnonymousUser') senderName = 'User';
                }

                return {
                    id: msg.id,
                    text: msg.content,
                    isMine: isMine,
                    time: new Date(msg.created_at).toLocaleTimeString(),
                    sender: isMine ? 'You' : senderName
                };
            });

            setMessages(loadedMessages);
        } catch (err) {
            console.error('Error fetching messages:', err);
        }
    };

    const sendMessage = () => {
        if (!newMessage.trim()) return;

        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
            console.error('WebSocket not connected');
            alert('Please wait for connection...');
            return;
        }

        if (typingTimeout.current) {
            clearTimeout(typingTimeout.current);
        }

        const messageContent = newMessage.trim();
        const tempId = Date.now();

        const newMsg = {
            id: tempId,
            text: messageContent,
            isMine: true,
            time: new Date().toLocaleTimeString(),
            sender: 'You'
        };

        setMessages(prev => [...prev, newMsg]);

        const messageData = {
            type: 'message',
            content: messageContent
        };

        console.log('📤 Sending message:', messageData);
        wsRef.current.send(JSON.stringify(messageData));

        setNewMessage('');

        setTyping(null);

        if (wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({
                type: 'typing',
                is_typing: false
            }));
        }
    };

    const handleTyping = (e) => {
        setNewMessage(e.target.value);

        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
            return;
        }

        if (typingTimeout.current) {
            clearTimeout(typingTimeout.current);
        }

        if (e.target.value.length > 0) {
            wsRef.current.send(JSON.stringify({
                type: 'typing',
                is_typing: true
            }));

            typingTimeout.current = setTimeout(() => {
                if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                    wsRef.current.send(JSON.stringify({
                        type: 'typing',
                        is_typing: false
                    }));
                }
            }, 2000);
        } else {
            wsRef.current.send(JSON.stringify({
                type: 'typing',
                is_typing: false
            }));
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const getOtherUser = (chat) => {
        if (!chat) return '';

        const customerName = chat.customer_detail?.username || chat.customer?.username;
        const providerName = chat.provider_detail?.username || chat.provider?.username;

        if (customerName === username) {
            return providerName || 'Provider';
        } else {
            return customerName || 'Customer';
        }
    };

    const logout = () => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.close();
        }
        localStorage.clear();
        navigate('/');
    };

    return (
        <div className="chat-page">
            <div className="chat-header">



                <div className="logo" onClick={() => navigate('/')}>
                    <span className="logo-icon">🛠️</span>
                    <span className="logo-service">Service</span>
                    <span className="logo-hub">Hub</span>
                </div>



                <div className="nav">
                    <button onClick={() => navigate('/services')}>Services</button>
                    <button onClick={() => navigate('/bookings')}>Bookings</button>
                    <button onClick={() => navigate('/reviews')}>Reviews</button>
                    <button onClick={logout}>Logout</button>
                </div>
            </div>

            <div className="chat-container">
                <div className="chat-sidebar">
                    <h3>Conversations</h3>
                    {conversations.length === 0 ? (
                        <div className="no-conversations">No conversations yet</div>
                    ) : (
                        conversations.map(chat => (
                            <div
                                key={chat.id}
                                className={`chat-user ${selectedChat?.id === chat.id ? 'active' : ''}`}
                                onClick={() => setSelectedChat(chat)}
                            >
                                <span className="avatar">👤</span>
                                <div className="user-info">
                                    <div className="name">{getOtherUser(chat)}</div>
                                    <div className="last-msg">
                                        {chat.last_message?.content?.substring(0, 30) || 'No messages yet'}
                                    </div>
                                </div>
                                {chat.unread_count > 0 && (
                                    <span className="unread-badge">{chat.unread_count}</span>
                                )}
                            </div>
                        ))
                    )}
                </div>

                <div className="chat-main">
                    {selectedChat ? (
                        <>
                            <div className="chat-with">
                                <div>
                                    Chatting with: <strong>{getOtherUser(selectedChat)}</strong>
                                    {!isConnected && !connectionError && (
                                        <span className="connection-status connecting">
                                            🔄 Connecting...
                                        </span>
                                    )}
                                    {connectionError && (
                                        <span className="connection-status error">
                                            ❌ {connectionError}
                                        </span>
                                    )}
                                    {isConnected && (
                                        <span className="connection-status connected">
                                            🟢 Connected
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="messages">
                                {messages.length === 0 ? (
                                    <div className="no-messages">No messages yet. Start the conversation!</div>
                                ) : (
                                    messages.map((msg, index) => (
                                        <div key={msg.id || index} className={`message ${msg.isMine ? 'mine' : 'theirs'}`}>
                                            {!msg.isMine && <div className="sender">{msg.sender}</div>}
                                            <div className="bubble">
                                                {msg.text}
                                                <div className="time">{msg.time}</div>
                                            </div>
                                        </div>
                                    ))
                                )}
                                {typing && <div className="typing">{typing}</div>}
                                <div ref={messagesEndRef} />
                            </div>

                            <div className="input-area">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={handleTyping}
                                    onKeyDown={handleKeyDown}
                                    placeholder={isConnected ? "Type a message..." : "Connecting..."}
                                    disabled={!isConnected}
                                />
                                <button
                                    onClick={sendMessage}
                                    disabled={!isConnected || !newMessage.trim()}
                                >
                                    Send
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="no-chat">Select a conversation to start chatting</div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Chat;