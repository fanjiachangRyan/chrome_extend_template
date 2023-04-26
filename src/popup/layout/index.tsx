import {Route, Routes} from "react-router";
import Home from "@/popup/pages/home";
import Account from "@/popup/pages/account";
import NoMatch from "@/popup/pages/noMatch";

const Layout = (props: any) => {
    return <div style={{width: 100, height: 200}}>
        layout
        <Routes>
            <Route path={'/'} element={<Layout/>}>
                <Route index element={<Home/>}/>
                <Route path="account" element={<Account/>}/>
                <Route path="dashboard" element={<Home/>}/>
                {/* 使用 path="*"" 意味着 "匹配所有路径", 所以我们不需要明确地列出别的路径了。 */}
                <Route path="*" element={<NoMatch/>}/>
            </Route>
        </Routes>
    </div>
}

export default Layout
