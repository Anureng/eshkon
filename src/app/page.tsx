import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-50 text-black">
      <div className="max-w-xl w-full bg-white p-10 rounded-xl shadow-lg border border-gray-100">
        <h1 className="text-3xl font-bold mb-2">Welcome to the Dashboard</h1>
        <p className="text-gray-500 mb-8">Your role has been set! Where would you like to go next?</p>
        
        <div className="flex flex-col gap-4">
          <Link 
            href="/studio/home" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg text-center transition-colors shadow-sm"
          >
            Open Studio Editor (/studio/home)
          </Link>
          
          <Link 
            href="/preview/home" 
            className="w-full bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 font-medium py-3 px-4 rounded-lg text-center transition-colors shadow-sm"
          >
            View Live Page (/preview/home)
          </Link>

          <Link 
            href="/dev/set-role" 
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg text-center transition-colors shadow-sm mt-4"
          >
            Change Role
          </Link>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-100 text-sm text-gray-400">
          *Note: If your Contentful page slug is not "home", be sure to change the URL accordingly in your browser address bar.
        </div>
      </div>
    </main>
  );
}
