import logo from "../assests/logo.png"

export default function Navbar({log, setLog}){
    const logout = () => {
        setLog('')
        localStorage.removeItem('admintoken')
    }
    
    
    return(
        <div className="flex justify-between py-2 max-padd-container"> 
            <img src={logo} alt="logo"  height={75} width={100} />
            <div className="flex flex-col">
                <p className="flex items-center pr-3 text-2xl font-bold">StepStyle Admin Management</p>
                {log !== '' &&<button className="w-24 mt-2 text-white bg-orange-600 rounded-md" onClick={logout}>Logout</button>}
            </div>
        </div>
    )
}