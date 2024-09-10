import React, {useState, useContext, useEffect} from "react";
import { useRouter } from 'next/router'
import {WS_URL, TextMessage, NewAdmin, StartGame} from "../../../constants";
import useWebSocket, { ReadyState } from "react-use-websocket";

export type Message = {
    type: string
    roomID: string
    username: string
    data: string
}

const room = () => {
    const [admin, setAdmin] = useState(false)

    const router = useRouter()

    const [username, setUsername] = useState(`${router.query.username === undefined ? '' : router.query.username}`)

    const { readyState, sendJsonMessage, lastJsonMessage } = useWebSocket(
        username === '' ? '' : `${WS_URL}/play/${router.query.room}?username=${username}`
    );

    useEffect(() => {
        if (username === 'undefined') return

        if (lastJsonMessage) {
            console.log(`got new message: ${lastJsonMessage.type} ${lastJsonMessage.data}`)

            if (lastJsonMessage.type === TextMessage) console.log(lastJsonMessage.data)
            else if (lastJsonMessage.type === NewAdmin) {
                console.log(`New admin has been set: ${lastJsonMessage.data}`)
                setAdmin(lastJsonMessage.data === username)
            }
        }
    }, [lastJsonMessage]);

    const handleStartGameButton = (e: React.SyntheticEvent) => {
        e.preventDefault()

        if (!admin) return

        sendJsonMessage(StartGame)
    }

    const handleConnetToRoomButton = (e: React.SyntheticEvent) => {
        e.preventDefault()

        router.push(`/play/${router.query.room}?username=${username}`)
        return
    }

    if (!router.query.username || router.query.username === ''){
        return (
            <div className='flex items-center justify-center min-w-full min-h-screen'>
                <form className='flex flex-col md:w-1/3'>
                    <input
                        placeholder='ИМЯ'
                        className='p-3 mt-8 rounded-md border-2 border-grey font-bold text-3xl text-center focus:outline-none focus:border-blue'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        maxLength={14}
                    />
                    <button className='p-3 mt-6 rounded-md bg-blue font-bold text-3xl text-white' type='submit' onClick={handleConnetToRoomButton}>
                        ПОДКЛЮЧИТЬСЯ К router.query.room
                    </button>
                </form>
            </div>
        )
    } else {
        if (admin){
            return (
                <div className='flex items-center justify-center min-w-full min-h-screen'>
                    <form className='flex flex-col md:w-1/3'>
                        <div className='text-5xl font-bold text-center'>
                            <span className='text-blue'>ОЖИДАНИЕ ИГРОКОВ</span>
                        </div>
                        <button className='p-3 mt-6 rounded-md bg-blue font-bold text-3xl text-white' type='submit' onClick={handleStartGameButton}>
                            НАЧАТЬ ИГРУ!
                        </button>
                    </form>
                </div>
        )
        } else {
            return (
                <div className='flex items-center justify-center min-w-full min-h-screen'>
                    <div className='text-5xl font-bold text-center'>
                        <span className='text-blue'>ОЖИДАНИЕ ИГРОКОВ</span>
                    </div>
                </div>
            )
        }
    }
}

export default room