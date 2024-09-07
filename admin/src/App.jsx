import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom';
import Add from "./windows/Add"
import List from "./windows/List"
import Orders from "./windows/Orders"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoginForm from "./windows/Login";
import { useEffect, useState } from "react"
import Error from "./windows/Error"
import Coupons from "./windows/Coupons";
import Registers from "./windows/Registers";
import SendMessage from "./windows/SendMessage"

export default function App() {
  const url = "http://localhost:4000"
  const [log, setLog] = useState('')

  useEffect(() => {
    if (localStorage.getItem('admintoken')){
      setLog(localStorage.getItem('admintoken'))
    }
  }, [log])
  
  
  return (
    <BrowserRouter>
      <Navbar log={log} setLog={setLog}/>
      <ToastContainer/>
      <hr/>

      <div className="flex">
        {log !== '' && <Sidebar/>}
        <Routes>
            <Route path="/" element={log !== '' ? <Add url={url}/> : <LoginForm log={log} setLog={setLog} url={url}/>}/>
          	<Route path="/add" element={log !== '' ? <Add url={url}/> : <LoginForm log={log} setLog={setLog} url={url}/>} />
            <Route path="/list" element={log !== '' ? <List url={url} /> : <LoginForm log={log} setLog={setLog} url={url}/>} />
            <Route path="/orders" element={log !== '' ? <Orders url={url} /> : <LoginForm log={log} setLog={setLog} url={url}/>} />
            <Route path="/coupons" element={log !== '' ? <Coupons url={url} /> : <LoginForm log={log} setLog={setLog} url={url}/>} />
            <Route path="/register" element={log !== '' ? <Registers url={url} /> : <LoginForm log={log} setLog={setLog} url={url}/>}/>
            <Route path="/message" element={log !== '' ? <SendMessage url={url}/> : <LoginForm log={log} setLog={setLog} url={url}/>}/>
            <Route path="*" element={<Error/>}/>
        </Routes>
      </div>
  
    </BrowserRouter>
 
    
  )
}