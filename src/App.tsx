import * as React from "react"
import {ChakraProvider} from "@chakra-ui/react"
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./pages/Home";
import List from "./pages/List";
import Room from "./pages/Room";
import theme from "./utils/theme";
import Login from "./components/Login";
import {createContext, useState} from "react";

export const UserContext = createContext<{name: string, setName: any}>({name: "", setName: null})

export const App = () => {
    const [name, setName] = useState<string>("")

    return <ChakraProvider theme={theme}>
        <UserContext.Provider value={{name: name, setName: setName}}>
            <Login/>
            <BrowserRouter>
                <Router/>
            </BrowserRouter>
        </UserContext.Provider>
    </ChakraProvider>
}

const Router = () => {
    return <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/room/:id' element={<Room/>}/>
        <Route path='/list' element={<List/>}/>
    </Routes>
}

