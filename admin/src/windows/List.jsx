import axios from "axios"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { TbTrash } from "react-icons/tb"
import { useNavigate } from "react-router-dom"

export default function List({url}){
    const [data, setData] = useState([])
    const nav = useNavigate()

    const fetchData = async() => {
        const response = await axios.get(`${url}/api/product/list`)
        
         if (response.data.success){
             setData(response.data.data)
             console.log(data)
         } else {
             toast.error("Error")
         }
    }

    const removeProduct = async(productID) => {
        const token = localStorage.getItem('admintoken');
        const response = await axios.post(`${url}/api/product/remove`,
            {
                id: productID
            },
            {
                headers: {token}
            }

            
        )

        if (response.data.success){
            toast.success("Product Removed")
        } else{
            toast.error("Error")
        }

        await fetchData()
        
    }

    useEffect(() => {
        const load = async () => {
            const token = localStorage.getItem('admintoken');
            try {
                const res = await axios.get(`${url}/api/admin/validate`, {
                    headers: { token} 
                });

                if (!res.data.success) {
                    localStorage.removeItem("admintoken");
                    nav("/");
                }
            } catch (error) {
                localStorage.removeItem("admintoken");
                nav("/");
            }
        };

        load();
        fetchData();
    }, []);


    return( 
        <section className="box-border w-full p-4 sm:p-10 bg-slate-50">
            <h4 className="pb-2 text-2xl font-bold uppercase">Products List</h4>

            <div className="mt-5 overflow-auto">
                <table className="w-full">
                    <thead>
                        <tr className="py-12 text-lg text-gray-800 border-b border-slate-900/20 text-start">
                            <th className="p-1 text-left">Products</th>
                            <th className="p-1 text-left">Title</th>
                            <th className="p-1 text-left">Price</th>
                            <th className="p-1 text-left">Remove</th>
                        </tr>
                    </thead>

                    <tbody>
                        {data.map((item) => (
                            <tr key={item._id} className="p-6 text-lg text-left text-gray-800 border-b border-slate-900/20">
                                <td className="p-1">
                                    <img src={`${item.image}`} alt="product" height={38} width={38} className="m-1 rounded-lg ring-1 ring-slate-900/5"/>
                                </td>
                                <td className="p-1">
                                    <div className="line-clamp-1">{item.name}</div>
                                </td>
                                <td className="p-1">Rs. {item.price}</td>
                                <td className="p-1 font-bold">
                                    <TbTrash className="cursor-pointer" onClick={() => removeProduct(item._id)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    )
}