import { categories } from "../assets/data"; 

export default function Categories({category,setCategory}) { 
  return (
    <section className="flex justify-center py-10 max-padd-container" id="shop">
      <div className="flex flex-wrap items-start gap-6">
        {categories.map((item, index) => (
          <div onClick={() => setCategory(prev => prev === item.name ? "all" : item.name)} key={index} id={item.name} className={`px-24 py-10 text-center hover:bg-yellow-200 mx-auto cursor-pointer h-40 rounded-3xl ${category===item.name?"bg-yellow-300":"bg-slate-200"}`}>
            <img src={item.image} alt={item.name} height={44} width={44} />
            <h4 className="mt-6 medium-18">{item.name.charAt(0).toUpperCase() + item.name.substring(1).toLowerCase()}</h4>
          </div>
        ))}
      </div>
    </section>
  );
}
