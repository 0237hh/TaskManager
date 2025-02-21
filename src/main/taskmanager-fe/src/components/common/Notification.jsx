import { useEffect } from "react";

const Notification = ({ message, type = "info", onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    const getBgColor = () => {
        switch (type) {
            case "success":
                return "bg-green-500";
            case "error":
                return "bg-red-500";
            case "warning":
                return "bg-yellow-500";
            default:
                return "bg-blue-500";
        }
    };

    return (
        <div className={`fixed top-5 right-5 text-white px-4 py-2 rounded shadow-lg ${getBgColor()}`}>
            {message}
        </div>
    );
};

export default Notification;
