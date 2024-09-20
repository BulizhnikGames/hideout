import React from 'react'
import {useRouter} from "next/router";

const LinkBox = () => {
    const router = useRouter()

    const copyLinkToRoom = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        try{
            await navigator.clipboard.writeText(`https://hideoutgame.ru/play/${router.query.room}`)
        } catch (err){
            console.log(err)
        }
        return
    }

    return (
        <button className='p-6 mt-6 rounded-md bg-lightblue text-white text-2xl font-bold' onClick={copyLinkToRoom}>
            hideoutgame.ru/play/{router.query.room}
        </button>
    )
}

export default LinkBox;