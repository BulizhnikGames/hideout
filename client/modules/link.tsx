import React from 'react'
import {useRouter} from "next/router";

const LinkBox = () => {
    const router = useRouter()

    const copyLinkToRoom = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        try{
            await navigator.clipboard.writeText(`http://192.168.103.132:3000/play/${router.query.room}`)
        } catch (err){
            console.log(err)
        }
        return
    }

    return (
        <button className='p-6 mt-6 rounded-md bg-lightblue text-white text-2xl font-bold' onClick={copyLinkToRoom}>
            http://hideout/play/{router.query.room}
        </button>
    )
}

export default LinkBox;