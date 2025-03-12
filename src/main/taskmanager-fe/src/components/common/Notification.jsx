import { useEffect, useState } from "react";

const Notification = ({ message, type = "info", onClose }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            setTimeout(onClose, 300);
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    const getStyles = () => {
        switch (type) {
            case "success":
                return { backgroundColor: "#4CAF50" };
            case "error":
                return { backgroundColor: "#F44336" };
            case "warning":
                return { backgroundColor: "#FF9800" };
            default:
                return { backgroundColor: "#2196F3" };
        }
    };

    return (
        <div
            style={{
                position: "fixed",
                top: "20px",
                right: "20px",
                color: "#fff",
                padding: "10px 20px",
                borderRadius: "5px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
                opacity: visible ? 1 : 0,
                transition: "opacity 0.3s ease-in-out",
                ...getStyles(),
            }}
        >
            {message}
        </div>
    );
};

export default Notification;
