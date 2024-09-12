import "@/styles/globals.css";
import type { AppProps } from "next/app";
import WebSocketProvider from "../../modules/websocket_provider";

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <WebSocketProvider>
                <div className='font-sans'>
                    <Component {...pageProps} />
                </div>
            </WebSocketProvider>
        </>
    )
}
