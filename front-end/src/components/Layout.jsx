import React from "react";
import Chatbot from "./Chatbot"

const Layout = ({ children }) => {
    return (
        <div>
            <div>{children}</div>
            <div style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 1000 }}>
                <Chatbot />
            </div>
        </div>
    );
};

export default Layout;