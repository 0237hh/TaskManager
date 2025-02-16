import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
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
                </TaskProvider>
            </AuthProvider>
        </ThemeProvider>
    );
};

export default App;
