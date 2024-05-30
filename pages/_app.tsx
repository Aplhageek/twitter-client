import "@/styles/globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import  { Toaster } from 'react-hot-toast';


const inter = Inter({ subsets: ["latin"] });


export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={inter.className}>
      <GoogleOAuthProvider clientId="957348729454-0frdgi8jnnad3hpa8ejp4ogng55krtia.apps.googleusercontent.com">
        <Component {...pageProps} />
        <Toaster />
      </GoogleOAuthProvider>
    </div>
  )
}
