import React, {useState} from 'react';
import {API_URL} from '../../constants';
import { useRouter } from 'next/router'


const index = () => {
    const [username, setUsername] = useState('')
    const [room, setRoom] = useState('')
    const [buttonText, changeButtonText] = useState('СОЗДАТЬ')

    const router = useRouter()

    const a = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

    const handleRoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        let res = ''
        for (let i = 0; i < val.length; i++){
            res += a.indexOf(val[i]) == -1 ? '' : val[i].toUpperCase()
        }
        setRoom(res)
        changeButtonText(res == '' ? 'СОЗДАТЬ' : 'ПРИСОЕДИНИТЬСЯ')
    }

    const handleButtonClick = async (e: React.SyntheticEvent) => {
        e.preventDefault()

        if (username === '') return

        try {
            if (room == '') {
                const res = await fetch(`${API_URL}/play`, {
                    method: 'POST',
                })

                const data = await res.json()
                if (res.ok){
                    createWSConnection(data.id)
                }
            } else {
                createWSConnection(room)
            }
        } catch (err) {
            console.log(err)
        }
    }

    const createWSConnection = (id: string) => {
        router.push(`/play/${id}?username=${username}`)
        return

        /*const ws = new WebSocket(`${WS_URL}/play/${id}?username=${username}`)
        if (ws.OPEN){
            // TODO set ws connection and router
            setConn(ws)
            console.log("ws")
            router.push(`/play/${id}?username=${username}`)
            return
        }*/
    }

    return (
        <div className='flex items-center justify-center min-w-full min-h-screen'>
            <form className='flex flex-col w-3/4'>
                <div className='text-5xl font-bold text-center'>
                    <span className='text-blue'>УБЕЖИЩЕ</span>
                </div>
                <input
                    placeholder='ИМЯ'
                    className='p-3 mt-8 rounded-md border-2 border-grey font-bold text-3xl text-center focus:outline-none focus:border-blue'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    maxLength={14}
                />
                <input
                    placeholder='КОМНАТА'
                    className='p-4 mt-8 rounded-md border-2 border-grey font-bold text-3xl text-center focus:outline-none focus:border-blue'
                    value={room}
                    onChange={handleRoomChange}
                    maxLength={5}
                />
                <button className='p-3 mt-6 rounded-md bg-blue font-bold text-3xl text-white' type='submit' onClick={handleButtonClick}>
                    {buttonText}
                </button>
            </form>
        </div>
    )
}

export default index