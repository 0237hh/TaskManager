import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import { TaskProvider } from "./context/TaskContext.jsx";
import AppRouter from "./routes/AppRouter";
import theme from "./styles/theme";
import {GoogleOAuthProvider} from "@react-oauth/google";

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;

const App = () => {
    return (
        <GoogleOAuthProvider clientId={CLIENT_ID}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <AuthProvider>
                    <TaskProvider>
                        <AppRouter />
                    </TaskProvider>
                </AuthProvider>
            </ThemeProvider>
        </GoogleOAuthProvider>
    );
};

export default App;
