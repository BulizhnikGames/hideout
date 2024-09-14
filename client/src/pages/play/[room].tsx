import React, {useState, useEffect} from "react";
import { useRouter } from 'next/router'
import {
    WS_URL,
    TextMessage,
    NewAdmin,
    StartGame,
    PlayerJoined,
    PlayerLeft,
    GameData,
    CharData,
    UpdateLock
} from "../../../constants";
import useWebSocket, { ReadyState } from "react-use-websocket";
import LinkBox from './link'
import BlueText from "@/pages/play/blue";
import LightText from "@/pages/play/light";
import Char from "@/pages/play/charinfo"
import {containsNewline} from "yaml/dist/compose/util-contains-newline";

export type Character = {
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
    lock: string
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
    const [selectedChar, selectOther] = useState(0)

    const router = useRouter()

    const [username, setUsername] = useState(`${router.query.username === undefined ? '' : router.query.username}`)

    const { readyState, sendJsonMessage, lastJsonMessage } = useWebSocket(
        router.query.username === undefined ? '' : `${WS_URL}/play/${router.query.room}?username=${router.query.username}`
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
                if (selectedChar == playerCount - 1) selectOther(0)
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
                let newChars: Array<Character> = []
                const n = Number(values[0])
                for (let i = 0; i < n; i++){
                    const s = i * 12 + 1
                    let lg = ''
                    for (let j = 0; j < 12; j++) lg += values[s + j] + '\n'
                    console.log(`got params for ${values[s]}:\n${lg}`)
                    const char: Character = {
                        username: values[s],
                        id: values[s + 1],
                        main: values[s + 2],
                        body: values[s + 3],
                        health: values[s + 4],
                        job: values[s + 5],
                        hobby: values[s + 6],
                        phobia: values[s + 7],
                        item: values[s + 8],
                        info: values[s + 9],
                        ability: values[s + 10],
                        lock: values[s + 11]
                    }
                    newChars.push(char)
                }
                setChars(newChars)
            } else if (lastJsonMessage.type == UpdateLock){
                let newChars: Array<Character> = []
                for (let i = 0; i < chars.length; i++){
                    if (chars[i].username != lastJsonMessage.username) newChars.push(chars[i])
                    else {
                        const char: Character = {
                            username: chars[i].username,
                            id: chars[i].id,
                            main: chars[i].main,
                            body: chars[i].body,
                            health: chars[i].health,
                            job: chars[i].job,
                            hobby: chars[i].hobby,
                            phobia: chars[i].phobia,
                            item: chars[i].item,
                            info: chars[i].info,
                            ability: chars[i].ability,
                            lock: lastJsonMessage.data
                        }
                        newChars.push(char)
                    }
                }
                setChars(newChars)
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

    const nextChar = (e: React.SyntheticEvent) => {
        e.preventDefault()
        selectOther((selectedChar + 1) % playerCount)
        return
    }

    const prevChar = (e: React.SyntheticEvent) => {
        e.preventDefault()
        selectOther(selectedChar == 0 ? playerCount - 1 : selectedChar - 1)
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

    const getChar = (n: number) => {
        if (chars.length == 0) return ''
        return n == -1 ? chars[chars.length - 1].username : chars[n % chars.length].username
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
                <div
                    className='pl-4 space-y-3 flex flex-col align-top font-bold text-start text-3xl text-wrap leading-10 break-words'>
                    <span className='text-center text-4xl'><LightText text={'АПОКАЛИПСИС'}/></span>
                    <span className='pt-4'>{game.apocalypse}</span>
                    <span className='py-4 text-center text-4xl'><LightText text={'УБЕЖИЩЕ'}/></span>
                    <span><BlueText text={'Вместимость:'}/> {game.size} {peopleEnding(game.size)}</span>
                    <span><BlueText text={'Нужно прожить:'}/> {game.time} {monthEnding(game.time)}</span>
                    <span><BlueText text={'Еды на:'}/> {game.food} {monthEnding(game.food)}</span>
                    <span><BlueText text={'Местоположение:'}/> {game.place}</span>
                    <span><BlueText text={'Комнаты:'}/> {game.rooms}</span>
                    <span><BlueText text={'Предметы:'}/> {game.resources}</span>
                    <Char c={selectedChar >= chars.length ? null : chars[selectedChar]} self={selectedChar >= chars.length ? false : username == chars[selectedChar].username}/>
                    <div className='flex flex-row justify-evenly'>
                        <button className='py-2 px-8 text-[18px] text-center text-white bg-blue rounded-md w-5/12' onClick={prevChar}>{getChar(selectedChar-1)}</button>
                        <button className='py-2 px-8 text-[18px] text-center text-white bg-blue rounded-md w-5/12' onClick={nextChar}>{getChar(selectedChar+1)}</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default room