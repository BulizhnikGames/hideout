import React, {useState, useEffect} from "react";
import { useRouter } from 'next/router'
import {WS_URL, TextMessage, NewAdmin, StartGame, PlayerJoined, PlayerLeft, GameData} from "../../../constants";
import useWebSocket, { ReadyState } from "react-use-websocket";
import LinkBox from './link'

const room = () => {
    const [admin, setAdmin] = useState(false)
    const [game, setGame] = useState({
        id: '',
        apocalypse: '',
        size: '',
        time: '',
        food: '',
        place: '',
        rooms: '',
        resources: '',
    })
    const [playerCount, changePlayerCount] = useState(0)

    const router = useRouter()

    const [username, setUsername] = useState(`${router.query.username === undefined ? '' : router.query.username}`)

    const { readyState, sendJsonMessage, lastJsonMessage } = useWebSocket(
        username === '' ? '' : `${WS_URL}/play/${router.query.room}?username=${username}`
    );

    useEffect(() => {
        if (username === 'undefined') return

        if (lastJsonMessage) {
            //console.log(`got new message: ${lastJsonMessage.type} ${lastJsonMessage.data}`)

            if (lastJsonMessage.type === TextMessage) console.log(lastJsonMessage.data)
            else if (lastJsonMessage.type === PlayerJoined) {
                console.log(`${lastJsonMessage.username} joined room`)
                changePlayerCount(Number(lastJsonMessage.data))
            }
            else if (lastJsonMessage.type === PlayerLeft){
                console.log(`${lastJsonMessage.username} left room`)
                changePlayerCount(Number(lastJsonMessage.data))
            }
            else if (lastJsonMessage.type === NewAdmin) {
                console.log(`New admin has been set: ${lastJsonMessage.data}`)
                setAdmin(lastJsonMessage.data === username)
            }
            else if (lastJsonMessage.type === GameData){
                const values = lastJsonMessage.data.split('&')
                let lg = ''
                for (let i = 0; i < values.length; i++){
                    lg += values[i] + '\n'
                }
                console.log(`got gamedata: \n${lg}`)
                setGame({
                    id: values[0],
                    apocalypse: values[1],
                    size: values[2],
                    time: values[3],
                    food: values[4],
                    place: values[5],
                    rooms: values[6],
                    resources: values[7],
                })
            }
        }
    }, [lastJsonMessage]);

    const handleStartGameButton = (e: React.SyntheticEvent) => {
        e.preventDefault()

        if (!admin) return

        sendJsonMessage(StartGame)
    }

    const handleConnectToRoomButton = (e: React.SyntheticEvent) => {
        e.preventDefault()

        router.push(`/play/${router.query.room}?username=${username}`)
        return
    }

    if (game.id === ''){
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
                        <button className='p-3 mt-6 rounded-md bg-blue font-bold text-3xl text-white' type='submit' onClick={handleConnectToRoomButton}>
                            ПОДКЛЮЧИТЬСЯ К {router.query.room}
                        </button>
                    </form>
                </div>
            )
        } else {
            if (admin){
                return (
                    <div className='flex items-center justify-center min-w-full min-h-screen'>
                        <form className='flex flex-col md:w-4/15'>
                            <div className='text-[54px] font-bold text-center'>
                                <span className='text-blue'>ОЖИДАНИЕ ИГРОКОВ: {playerCount}/15</span>
                            </div>
                            <LinkBox/>
                            <button className='p-6 mt-6 rounded-md bg-blue font-bold text-3xl text-white' type='submit'
                                    onClick={handleStartGameButton}>
                                НАЧАТЬ ИГРУ!
                            </button>
                        </form>
                    </div>
                )
            } else {
                return (
                    <div className='flex items-center justify-center min-w-full min-h-screen'>
                        <form className='flex flex-col md:w-4/15'>
                            <div className='text-[54px] font-bold text-center'>
                                <span className='text-blue'>ОЖИДАНИЕ ИГРОКОВ: {playerCount}/15</span>
                            </div>
                            <LinkBox/>
                        </form>
                    </div>
                )
            }
        }
    } else{
        return (
            <div>
                aboba
            </div>
        )
    }
}

export default room