import { GlobalStyles } from "./styles/GlobalStyles";
import AppRouter from "./router";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <GlobalStyles />
        <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
