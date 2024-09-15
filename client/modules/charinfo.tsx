import React from 'react';
import LightText from "../modules/light";
import Blue from "../modules/blue";
import RedText from "../modules/canred";
import LockText from "../modules/lock";
import {Character} from "@/pages/play/[room]";

const Char = ({c, self, handler}: {c : Character | null, self : boolean, handler : any}) => {
    if (c === null || c.lock.length < 9) {
        return (
            <div></div>
        )
    }
    if (self) {
        return (
            <div className='space-y-3 flex flex-col align-top font-bold text-start text-3xl text-wrap leading-10 break-words'>
                <span className='py-4 text-center text-4xl'><LightText text={c.username}/>{'\n'}</span>
                <button className='py-1 bg-blue rounded-md align-text-top' onClick={() => handler('100000000', c.username)}>
                    <LockText text={'Основное:'} lock={c.lock[0] == '0'}/> {c.main}
                </button>
                <button className='py-1 bg-blue rounded-md align-text-top' onClick={() => handler('010000000', c.username)}>
                    <LockText text={'Телосложение:'} lock={c.lock[1] == '0'}/> {c.body}
                </button>
                <button className='py-1 bg-blue rounded-md align-text-top' onClick={() => handler('001000000', c.username)}>
                    <LockText text={'Здоровье:'} lock={c.lock[2] == '0'}/> {c.health}
                </button>
                <button className='py-1 bg-blue rounded-md align-text-top' onClick={() => handler('000100000', c.username)}>
                    <LockText text={'Работа:'} lock={c.lock[3] == '0'}/> {c.job}
                </button>
                <button className='py-1 bg-blue rounded-md align-text-top' onClick={() => handler('000010000', c.username)}>
                    <LockText text={'Хобби:'} lock={c.lock[4] == '0'}/> {c.hobby}
                </button>
                <button className='py-1 bg-blue rounded-md align-text-top' onClick={() => handler('000001000', c.username)}>
                    <LockText text={'Фобия:'} lock={c.lock[5] == '0'}/> {c.phobia}
                </button>
                <button className='py-1 bg-blue rounded-md align-text-top' onClick={() => handler('000000100', c.username)}>
                    <LockText text={'Предмет:'} lock={c.lock[6] == '0'}/> {c.item}
                </button>
                <button className='py-1 bg-blue rounded-md align-text-top' onClick={() => handler('000000010', c.username)}>
                    <LockText text={'Доп информация:'} lock={c.lock[7] == '0'}/> {c.info}
                </button>
                <button className='py-1 bg-blue rounded-md align-text-top' onClick={() => handler('000000001', c.username)}>
                    <LockText text={'Способность:'} lock={c.lock[8] == '0'}/> {c.ability}
                </button>
            </div>
        )
    } else {
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