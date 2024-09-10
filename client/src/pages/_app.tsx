import "@/styles/globals.css";
import type { AppProps } from "next/app";
import WebSocketProvider from "../../modules/websocket_provider";

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <WebSocketProvider>
                <div className='flex flex-col md:flex-row h-full min-h-screen font-sans'>
                    <Component {...pageProps} />
                </div>
            </WebSocketProvider>
        </>
    )
}
