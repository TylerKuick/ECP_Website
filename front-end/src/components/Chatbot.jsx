import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import '../styles/Chatbot.css'

const LexChatbot = () => {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState("");
    const [sessionId] = useState(uuidv4());
    const [isOpen, setIsOpen] = useState(true);

    const sendMessageToLex = async () => {
        if (!userInput.trim()) return;

        // Append user's message to the chat
        setMessages((prevMessages) => [...prevMessages, { sender: "user", text: userInput }]);

        const payload = {
            userInput: userInput,
            sessionId: sessionId,
        };

        try {
            const response = await fetch("https://39wzqvgefd.execute-api.us-east-1.amazonaws.com/dev/lex", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            console.log(data);

            const botMessage = data.message || "Sorry, I couldn't process your request.";

            // Append Lex bot's response to the chat
            setMessages((prevMessages) => [...prevMessages, { sender: "bot", text: botMessage }]);
        } catch (error) {
            console.error("Error communicating with API Gateway:", error);
            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: "bot", text: "There was an error connecting to the bot. Please try again later." },
            ]);
        }

        setUserInput(""); // Clear the input field
    };

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={`chatbot-container ${isOpen ? 'open' : 'closed'}`}>
            <div className="chatbot-header">
                <span>ShoppingBuddy</span>
                <button className="close-btn" onClick={toggleChat}>
                    {isOpen ? 'X' : 'Open'}
                </button>
            </div>

            {isOpen && (
                <>
                    <div className="chat-history">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`chat-message ${msg.sender === "user" ? "user-message" : "bot-message"}`}>
                                <p>{msg.text}</p>
                            </div>
                        ))}
                    </div>
                    <div className="chat-input-container">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder="Type a message..."
                        />
                        <button onClick={sendMessageToLex}>Send</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default LexChatbot;
