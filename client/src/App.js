import Main from "./pages/main/Main";
import "./App.css";
import AuthContextProvider from "./context/AuthContext/AuthContextProvider";
import AppRouter from "./routers/router";
import FileContextProvider from "./context/FileContext/FileContextProvider";

function App() {
  return (
    <div className="App">
      <AuthContextProvider>
        <FileContextProvider>
          <AppRouter>{/* <Main /> */}</AppRouter>
        </FileContextProvider>
      </AuthContextProvider>
    </div>
  );
}

export default App;
