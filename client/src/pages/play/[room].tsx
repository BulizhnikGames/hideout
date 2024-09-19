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
    UpdateLock, UpdateGame, UpdatedChar
} from "../../../constants";
import useWebSocket from "react-use-websocket";
import LinkBox from './link'
import Char from "./charinfo"
import GameInfo from "./gameinfo"
import Admin from "./admin"

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

export type Game = {
    id:  string
    apocalypse: string
    size: number
    time: number
    food: number
    place: string
    rooms: string
    resources: string
}

type Message = {
    type: string
    roomID: string
    username: string
    data: string
}

const Room = () => {
    const [admin, setAdmin] = useState(false)
    const [game, setGame] = useState<Game>({
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

    console.log(`garbage log: ${readyState}`)

    useEffect(() => {
        if (username === 'undefined') return

        if (lastJsonMessage) {
            const m = lastJsonMessage as Message

            if (m.type === TextMessage) console.log(m.data)
            else if (m.type === PlayerJoined) {
                console.log(`${m.username} joined room`)
                changePlayerCount(Number(m.data))
            }
            else if (m.type === PlayerLeft){
                console.log(`${m.username} left room`)
                if (selectedChar == playerCount - 1) selectOther(0)
                changePlayerCount(Number(m.data))
            }
            else if (m.type === NewAdmin) {
                console.log(`New admin has been set: ${m.data}`)
                setAdmin(m.data === username)
            }
            else if (m.type === GameData){
                const values = m.data.split('&')
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
            else if (m.type === CharData){
                const values = m.data.split('&')
                const newChars: Array<Character> = []
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
            } else if (m.type == UpdateLock){
                const newChars: Array<Character> = []
                for (let i = 0; i < chars.length; i++){
                    if (chars[i].username != m.username) newChars.push(chars[i])
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
                            lock: m.data
                        }
                        newChars.push(char)
                    }
                }
                setChars(newChars)
            } else if (m.type == UpdatedChar) {
                const newChars: Array<Character> = []
                const values = m.data.split('&')
                for (let i = 0; i < chars.length; i++){
                    if (chars[i].username != m.username) newChars.push(chars[i])
                    else {
                        const char: Character = {
                            username: chars[i].username,
                            id: chars[i].id,
                            main: values[0],
                            body: values[1],
                            health: values[2],
                            job: values[3],
                            hobby: values[4],
                            phobia: values[5],
                            item: values[6],
                            info: values[7],
                            ability: values[8],
                            lock: chars[i].lock
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
        sendJsonMessage(StartGame +":")
    }

    const handleConnectToRoomButton = (e: React.SyntheticEvent) => {
        e.preventDefault()
        router.push(`/play/${router.query.room}?username=${username}`)
        return
    }

    const updateLock = (lock: string, username: string) : void => {
        sendJsonMessage(UpdateLock + ":" + username + '&' + lock)
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

    const getChar = (n: number) => {
        if (chars.length == 0) return ''
        return n == -1 ? chars[chars.length - 1].username : chars[n % chars.length].username
    }

    const handleUpdateGame = (code: string) : void => {
        sendJsonMessage(UpdateGame + ":" + code)
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
        if (admin) {
            return (
                <div className='p-4 flex items-start flex-col space-y-10 max-w-full'>
                    <div
                        className='flex flex-col align-top font-bold text-start text-3xl text-wrap leading-10 break-words'>
                        <GameInfo game={game}/>
                        <Char c={selectedChar >= chars.length ? null : chars[selectedChar]}
                              self={selectedChar >= chars.length ? false : username == chars[selectedChar].username}
                              handler={updateLock}/>
                        <div className='pt-3 flex flex-row justify-evenly'>
                            <button className='py-2 px-8 text-[18px] text-center text-white bg-blue rounded-md w-5/12'
                                    onClick={prevChar}>{getChar(selectedChar - 1)}</button>
                            <button className='py-2 px-8 text-[18px] text-center text-white bg-blue rounded-md w-5/12'
                                    onClick={nextChar}>{getChar(selectedChar + 1)}</button>
                        </div>
                        <Admin game={handleUpdateGame}/>
                    </div>
                </div>
            )
        } else {
            return (
                <div className='p-4 flex items-start flex-col space-y-10 max-w-full'>
                    <div
                        className='flex flex-col align-top font-bold text-start text-3xl text-wrap leading-10 break-words'>
                        <GameInfo game={game}/>
                        <Char c={selectedChar >= chars.length ? null : chars[selectedChar]}
                              self={selectedChar >= chars.length ? false : username == chars[selectedChar].username}
                              handler={updateLock}/>
                        <div className='pt-3 flex flex-row justify-evenly'>
                            <button className='py-2 px-8 text-[18px] text-center text-white bg-blue rounded-md w-5/12'
                                    onClick={prevChar}>{getChar(selectedChar - 1)}</button>
                            <button className='py-2 px-8 text-[18px] text-center text-white bg-blue rounded-md w-5/12'
                                    onClick={nextChar}>{getChar(selectedChar + 1)}</button>
                        </div>
                    </div>
                </div>
            )
        }
    }
}

export default Room