import LightText from "../modules/light";
import BlueText from "../modules/blue";
import React from "react";
import {Game} from "@/pages/play/[room]";

const GameInfo = ({game}: {game: Game}) =>{
    const peopleEnding = (n: number) =>{
        if (n == 2 || n == 3 || n == 4) return 'человека'
        return 'человек'
    }

    const monthEnding = (n: number) => {
        if (n % 10 > 4 || n % 10 == 0 || (n >= 10 && n <= 20)) return 'месяцев'
        if (n % 10 == 1) return 'месяц'
        return 'месяца'
    }

    return (
        <div className='space-y-3 flex flex-col align-top font-bold text-start text-3xl text-wrap leading-10 break-words'>
            <span className='text-center text-4xl'><LightText text={'АПОКАЛИПСИС'}/></span>
            <span className='pt-2'>{game.apocalypse}</span>
            <span className='py-4 text-center text-4xl'><LightText text={'УБЕЖИЩЕ'}/></span>
            <span><BlueText text={'Вместимость:'}/> {game.size} {peopleEnding(game.size)}</span>
            <span><BlueText text={'Нужно прожить:'}/> {game.time} {monthEnding(game.time)}</span>
            <span><BlueText text={'Еды на:'}/> {game.food} {monthEnding(game.food)}</span>
            <span><BlueText text={'Местоположение:'}/> {game.place}</span>
            <span><BlueText text={'Комнаты:'}/> {game.rooms}</span>
            <span><BlueText text={'Предметы:'}/> {game.resources}</span>
        </div>
    )
}

export default GameInfo