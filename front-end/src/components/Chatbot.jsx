import React, { useState, useEffect } from "react";
import { LexRuntimeV2Client, RecognizeTextCommand } from "@aws-sdk/client-lex-runtime-v2";
import { v4 as uuidv4 } from "uuid";
import '../styles/Chatbot.css'


const LexChatbot = () => {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState("");
    const [sessionId] = useState(uuidv4());
    const [isOpen, setIsOpen] = useState(true);

    const lexClient = new LexRuntimeV2Client({
        region: "us-east-1",
        credentials: {
            accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
            secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
        },
    });

    const sendMessageToLex = async () => {
        if (!userInput.trim()) return;

        // Append user's message to the chat
        setMessages((prevMessages) => [...prevMessages, { sender: "user", text: userInput }]);

        const params = {
            botId: "GCA03KZ7MN",
            botAliasId: "TSTALIASID",
            localeId: "en_US",
            sessionId: sessionId,
            text: userInput,
        };

        try {
            const command = new RecognizeTextCommand(params);
            const response = await lexClient.send(command);

            // Extract the bot's response message
            const botMessage = response.messages?.[0]?.content || "Sorry, I couldn't process your request.";

            // Append Lex bot's response to the chat
            setMessages((prevMessages) => [...prevMessages, { sender: "bot", text: botMessage }]);
        } catch (error) {
            console.error("Error communicating with Lex:", error);
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
                <span>Chatbot</span>
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