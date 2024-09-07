import { Link } from "react-router-dom"

export default function Error(){
    return(
        <section className="p-6 mx-auto mt-10 bg-white rounded-lg shadow-md w-96">
            <div className="px-6 py-10 text-center bg-white rounded-lg shadow-lg">
                <h4 className="mb-4 text-3xl font-bold text-red-600">
                    Error 404
                </h4>
                <p className="mb-6 text-gray-700">Sorry, this page doesn’t seem to exist.</p>
                <Link to="/" className="text-lg font-medium text-blue-700 hover:text-blue-900">
                    Back to Main Admin Portal
                </Link>
            </div>
        </section>
    )
}