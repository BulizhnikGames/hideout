import React from 'react';
import LightText from "@/pages/play/light";
import Blue from "@/pages/play/blue";
import RedText from "@/pages/play/canred";
import {Character} from "@/pages/play/[room]";

const Char = ({c, self}: {c : Character | null, self : boolean}) => {
    if (c === null || c.lock.length < 9) {
        return (
            <div></div>
        )
    }
    if (self) {
        return (
            <div className='space-y-3 flex flex-col align-top font-bold text-start text-3xl text-wrap leading-10 break-words'>
                <span className='py-4 text-center text-4xl'><LightText text={c.username}/>{'\n'}</span>
                <span><Blue text={'Основное:'}/> {c.main}</span>
                <span><Blue text={'Телосложение:'}/> {c.body}</span>
                <span><Blue text={'Здоровье:'}/>{' '} {c.health}</span>
                <span><Blue text={'Работа:'}/> {c.job}</span>
                <span><Blue text={'Хобби:'}/> {c.hobby}</span>
                <span><Blue text={'Фобия:'}/> {c.phobia}</span>
                <span><Blue text={'Предмет:'}/> {c.item}</span>
                <span><Blue text={'Доп информация:'}/> {c.main}</span>
                <span><Blue text={'Способность:'}/> {c.ability}</span>
            </div>
        )
    } else{
        return (
            <div className='space-y-3 flex flex-col align-top font-bold text-start text-3xl text-wrap leading-10 break-words'>
                <span className='py-4 text-center text-4xl'><LightText text={c.username}/>{'\n'}</span>
                <span><Blue text={'Основное:'}/>{' '}
                    <RedText text={c.lock[0] == '1' ? c.main : 'скрыто'} r={c.lock[0] == '1'}/></span>
                <span><Blue text={'Телосложение:'}/>{' '}
                    <RedText text={c.lock[1] == '1' ? c.body : 'скрыто'} r={c.lock[1] == '1'}/></span>
                <span><Blue text={'Здоровье:'}/>{' '}
                    <RedText text={c.lock[2] == '1' ? c.health : 'скрыто'} r={c.lock[2] == '1'}/></span>
                <span><Blue text={'Работа:'}/>{' '}
                    <RedText text={c.lock[3] == '1' ? c.job : 'скрыта'} r={c.lock[3] == '1'}/></span>
                <span><Blue text={'Хобби:'}/>{' '}
                    <RedText text={c.lock[4] == '1' ? c.hobby : 'скрыто'} r={c.lock[4] == '1'}/></span>
                <span><Blue text={'Фобия:'}/>{' '}
                    <RedText text={c.lock[5] == '1' ? c.phobia : 'скрыта'} r={c.lock[5] == '1'}/></span>
                <span><Blue text={'Предмет:'}/>{' '}
                    <RedText text={c.lock[6] == '1' ? c.item : 'скрыт'} r={c.lock[6] == '1'}/></span>
                <span><Blue text={'Доп информация:'}/>{' '}
                    <RedText text={c.lock[7] == '1' ? c.info : 'скрыта'} r={c.lock[7] == '1'}/></span>
                <span><Blue text={'Способность:'}/>{' '}
                    <RedText text={c.lock[8] == '1' ? c.ability : 'скрыта'} r={c.lock[8] == '1'}/></span>
            </div>
        )
    }

}

export default Char