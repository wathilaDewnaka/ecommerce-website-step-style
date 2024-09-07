import { FaTruckArrowRight } from 'react-icons/fa6';
import hero from '../assets/hero.webp'; 

export default function Hero() {
  return (
    <section
      id="home"
      className="bg-center bg-no-repeat bg-cover max-padd-container bg-hero h-[700px] w-full"
      style={{ backgroundImage: `url(${hero})` }} 
    >
      <div className="relative top-[11rem] xs:top-68 pl-3 sm:pl-5 text-white h-[510px] z-20">
        <h4 className="tracking-wider uppercase medium-18">All the Footwear Items</h4>
        <h1 className="h1 capitalize max-w-[40rem] text-[52px] sm:text-[72px] font-bold">Upgrade your foot items</h1>
        <p className="my-5 max-w-[33rem]">
          StepStyle: Where every step counts. Discover premium footwear that blends comfort, style, and durability for a perfect stride.
        </p>
      </div>

      <div className="relative z-30 flex flex-wrap items-center ml-3 gap-x-4">
        <a
          href="#shop"
          className="inline-flex items-center justify-center gap-4 p-3 mb-5 bg-white cursor-pointer sm:mb-0 rounded-xl"
        >
          <div className="pl-4 leading-tight regular-14">
            <h5 className="font-bold uppercase">New Arrivals</h5>
            <p className="mt-1 regular-14">Upto 10% off</p>
          </div>
          <div className="flex items-center justify-center h-10 p-1 pt-0 rounded-full w-15 bg-primary">
            <FaTruckArrowRight className="w-10 h-10" />
          </div>
        </a>

        <a
          href="#shop"
          className="z-40 inline-flex items-center justify-center gap-4 p-3 text-white bg-black cursor-pointer rounded-xl"
        >
          <div className="pl-4 leading-tight regular-14">
            <h5 className="font-bold uppercase">Hot Deals</h5>
            <p className="mt-1 regular-14">Upto 50% off</p>
          </div>
          <div className="flex items-center justify-center w-10 h-10 p-1 pt-0 rounded-full bg-primary">
            <FaTruckArrowRight className="w-10 h-10" />
          </div>
        </a>
      </div>
    </section>
  );
}
