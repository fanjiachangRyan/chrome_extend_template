import {BrowserRouter, Navigate} from "react-router-dom";
import {Route, Routes} from "react-router";
import Home from "@/popup/pages/home";
import Account from "@/popup/pages/account";

const Router = () => {
    return <div style={{width: '200px', height: '400px'}}>
        <div>header</div>
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/home" element={<Home/>}/>
                    <Route path="/account" element={<Account/>}/>
                    <Route path="*" element={<Navigate to="/home"/>}/>
                </Routes>
            </BrowserRouter>
        </div>
        <div>footer</div>
    </div>
}

export default Router
