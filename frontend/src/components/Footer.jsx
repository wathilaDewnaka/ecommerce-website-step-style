import { RiFacebookBoxFill, RiGithubFill, RiInstagramFill, RiLinkedinFill, RiTwitterFill, RiYoutubeFill } from "react-icons/ri";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="py-8 max-padd-container bg-slate-900" id="contact">
      <div className="flex flex-col justify-center text-center gap-y-4">
        <h4 className="text-xl font-bold text-white sm:text-2xl">Follow us on social media</h4>
        
        <div className="flex justify-center gap-6 pr-4 mt-3 text-center">
          <Link 
            className="text-2xl text-[#ff2e63] transition-transform transition-colors duration-300 hover:text-[#c80021] hover:-translate-y-1"
          >
            <RiYoutubeFill />
          </Link>

          <Link 
            className="text-2xl text-[#f08a5d] transition-transform transition-colors duration-300 hover:text-[#d07a50] hover:-translate-y-1"
          >
            <RiInstagramFill />
          </Link>

          <Link 
            className="text-2xl  text-[#08d9d6] transition-transform transition-colors duration-300 hover:text-[#5825e5] hover:-translate-y-1"
          >
            <RiTwitterFill />
          </Link>

          <Link 
            className="text-2xl text-[#eaeaea] transition-transform transition-colors duration-300 hover:text-[#cccccc] hover:-translate-y-1"
          >
            <RiFacebookBoxFill />
          </Link>

          <Link 
            className="text-2xl  text-[#5272f2] transition-transform transition-colors duration-300 hover:text-[#7f6dd8] hover:-translate-y-1"
          >
            <RiLinkedinFill />
          </Link>

          <Link 
            className="text-2xl text-[#f9ed69] transition-transform transition-colors duration-300 hover:text-[#95c13e] hover:-translate-y-1"
          >
            <RiGithubFill />
          </Link>
        </div>
        
        <hr className="h-[1px] w-2/3 my-3 mx-auto" />
        <div className="text-white">Copyright &copy; StepStyle | All rights reserved.</div>
      </div>
    </footer>
  );
}
