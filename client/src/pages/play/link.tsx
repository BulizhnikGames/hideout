import React from 'react'
import {useRouter} from "next/router";

const LinkBox = () => {
    const router = useRouter()

    const copyLinkToRoom = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        try{
            await navigator.clipboard.writeText(`http://hideoutgame.ru/play/${router.query.room}`)
        } catch (err){
            console.log(err)
        }
        return
    }

    return (
        <button className='p-3 mt-6 rounded-md bg-lightblue text-white font-bold' onClick={copyLinkToRoom}>
            http://hideoutgame.ru/play/{router.query.room}
        </button>
    )
}

export default LinkBox;