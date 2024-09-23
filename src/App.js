import './App.css';
import RenderRoute from "./routes";
import 'react-toastify/dist/ReactToastify.css';
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import {ToastContainer} from "react-toastify";

function App() {
    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={1000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <RenderRoute></RenderRoute>
        </>);
}

export default App;
