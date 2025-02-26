import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import { TaskProvider } from "./context/TaskContext.jsx";
import AppRouter from "./routes/AppRouter";
import theme from "./styles/theme";

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
                <TaskProvider>
                    <AppRouter />
                    <ToastContainer position="top-right" autoClose={3000} />
                </TaskProvider>
            </AuthProvider>
        </ThemeProvider>
    );
};

export default App;
