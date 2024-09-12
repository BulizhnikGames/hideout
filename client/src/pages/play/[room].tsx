import React, {useState, useEffect} from "react";
import { useRouter } from 'next/router'
import {WS_URL, TextMessage, NewAdmin, StartGame, PlayerJoined, PlayerLeft, GameData, CharData} from "../../../constants";
import useWebSocket, { ReadyState } from "react-use-websocket";
import LinkBox from './link'
import BlueText from "@/pages/play/blue";
import LightText from "@/pages/play/light";
import Top from "@/pages/play/top"

type Character = {
    username: string
    id: string
    main: string
    body: string
    health: string
    job: string
    hobby: string
    phobia: string
    item: string
    info: string
    ability: string
}

const room = () => {
    const [admin, setAdmin] = useState(false)
    const [game, setGame] = useState({
        id: '',
        apocalypse: '',
        size: 0,
        time: 0,
        food: 0,
        place: '',
        rooms: '',
        resources: '',
    })
    const [chars, setChars] = useState<Array<Character>>([])
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
                setGame({
                    id: values[0],
                    apocalypse: values[1],
                    size: Number(values[2]),
                    time: Number(values[3]),
                    food: Number(values[4]),
                    place: values[5],
                    rooms: values[6],
                    resources: values[7],
                })
            }
            else if (lastJsonMessage.type === CharData){
                const values = lastJsonMessage.data.split('&')
                console.log(`got params for ${lastJsonMessage.username}`)
                const char: Character = {
                    username: values[0],
                    id: values[1],
                    main: values[2],
                    body: values[3],
                    health: values[4],
                    job: values[5],
                    hobby: values[6],
                    phobia: values[7],
                    item: values[8],
                    info: values[9],
                    ability: values[10],
                }
                setChars([...chars, char])
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

    const peopleEnding = (n: number) =>{
        if (n == 2 || n == 3 || n == 4) return 'человека'
        return 'человек'
    }

    const monthEnding = (n: number) => {
        if (n % 10 > 4 || n % 10 == 0 || (n >= 10 && n <= 20)) return 'месяцев'
        if (n % 10 == 1) return 'месяц'
        return 'месяца'
    }

    if (game.id === ''){
        if (!router.query.username || router.query.username === ''){
            return (
                <div className='flex items-center justify-center min-w-full min-h-screen'>
                    <form className='flex flex-col w-3/4'>
                        <input
                            placeholder='ИМЯ'
                            className='p-3 mt-8 rounded-md border-2 border-grey font-bold text-3xl text-center focus:outline-none focus:border-blue'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            maxLength={14}
                        />
                        <button className='p-3 mt-6 rounded-md bg-blue font-bold text-[25px] text-white' type='submit' onClick={handleConnectToRoomButton}>
                            ПОДКЛЮЧИТЬСЯ К {router.query.room}
                        </button>
                    </form>
                </div>
            )
        } else {
            if (admin){
                return (
                    <div className='flex items-center justify-center min-w-full min-h-screen'>
                        <form className='flex flex-col w-3/4'>
                            <div className='text-5xl font-bold text-center'>
                                <span className='text-blue'>ОЖИДАНИЕ
                                    ИГРОКОВ:{'\n'}
                                    {playerCount}/15</span>
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
                        <form className='flex flex-col w-3/4'>
                            <div className='text-5xl font-bold text-center'>
                                <span className='text-blue'>ОЖИДАНИЕ
                                    ИГРОКОВ:{'\n'}
                                    {playerCount}/15
                                </span>
                            </div>
                            <LinkBox/>
                        </form>
                    </div>
                )
            }
        }
    } else{
        return (
            <div className='p-6 flex items-start flex-col space-y-10 max-w-full'>
                <div className='pl-6 space-y-3 flex flex-col align-top font-bold text-start text-3xl text-wrap leading-10 break-words'>
                    <span><BlueText text={'Апокалипсис:'}/> {game.apocalypse}</span>
                    <span><LightText text={'---УБЕЖИЩЕ---'}/></span>
                    <span><BlueText text={'Вместимость:'}/> {game.size} {peopleEnding(game.size)}</span>
                    <span><BlueText text={'Нужно прожить:'}/> {game.time} {monthEnding(game.time)}</span>
                    <span><BlueText text={'Еды на:'}/> {game.food} {monthEnding(game.food)}</span>
                    <span><BlueText text={'Местоположение:'}/> {game.place}</span>
                    <span><BlueText text={'Комнаты:'}/> {game.rooms}</span>
                    <span><BlueText text={'Предметы:'}/> {game.resources}</span>
                </div>
                <table className='border-2 border-b-dark-primary border-collapse table-auto font-bold w-full'>
                    <thead>
                        <tr className='text-3xl'>
                            <Top text={'Имя'}/>
                            <Top text={'Главное'}/>
                            <Top text={'Телосложение'}/>
                            <Top text={'Здоровье'}/>
                            <Top text={'Работа'}/>
                            <Top text={'Хобби'}/>
                            <Top text={'Фобия'}/>
                            <Top text={'Предмет'}/>
                            <Top text={'Доп информация'}/>
                            <Top text={'Способность'}/>
                        </tr>
                    </thead>
                </table>
            </div>
        )
    }
}

export default room