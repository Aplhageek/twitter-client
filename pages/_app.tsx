import "@/styles/globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import { Toaster } from 'react-hot-toast';



const inter = Inter({ subsets: ["latin"] });

const queryCLient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={inter.className}>
      <QueryClientProvider client={queryCLient} >
        <GoogleOAuthProvider clientId="957348729454-0frdgi8jnnad3hpa8ejp4ogng55krtia.apps.googleusercontent.com">
          <Component {...pageProps} />
          <Toaster />
        </GoogleOAuthProvider>
        <ReactQueryDevtools/>
      </QueryClientProvider>
    </div>
  )
}
