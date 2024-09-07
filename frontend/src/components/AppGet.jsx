import phone from "../assets/phones.png"
import appstore from "../assets/apple.svg"
import playstore from "../assets/android.svg"

export default function AppGet(){
    return(
        <section className="flex flex-col justify-center w-full" id="app">
            <div className="mx-auto relative flex w-full  flex-col justify-between gap-32 overflow-hidden px-6 py-12 sm:flex-row sm:gap-12 sm:py-20 lg:px-10 xl:max-h-[598px] 2xl:rounded-5xl bg-slate-200">
                <div className="flex flex-col items-start justify-center flex-1 w-full gap-4 xl:max-w-[555px]">
                <h2 className="text-2xl font-bold sm:text-4xl xl:text-4xl">Get our app now!</h2>
                <h4 className="font-medium text-yellow-600 uppercase">Available for both iOS and Android</h4>

                <p>Discover a world of convenience and innovation with our app, designed to make your daily life easier and more enjoyable. Whether you're looking to stay organized, connect with friends, or access exclusive content, our app has got you covered. With a user-friendly interface and a wide range of features, you can easily manage your tasks, explore new interests, and stay up-to-date with the latest trends. Available for both iOS and Android, our app ensures a seamless experience across all devices. Join a community of users who trust our app for its reliability and excellent performance. Download now and unlock a world of possibilities at your fingertips!</p>

                    
                    <div className="flex flex-col w-full gap-3 mt-3 whitespace-nowrap xl:flex-row">
                        <button className="flex justify-center bg-black text-white rounded-full gap-x-3 px-12 py-3.5">
                            <img src={appstore} alt="apple"/>
                            App Store
                        </button>

                        <button className="flex justify-center bg-orange-600 text-white rounded-full gap-x-3 px-12 py-3.5">
                            <img src={playstore} alt="android"/>
                            Play Store
                        </button>
                    </div>
                </div>

                <div>
                    <img src={phone} alt="phone"/>
                </div>
            </div>
        </section>
    )
}