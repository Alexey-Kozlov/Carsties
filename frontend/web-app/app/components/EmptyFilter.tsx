'use client'

import { useParamsStore } from '@/hooks/useParamsStore';
import React from 'react'
import Heading from './Heading';
import { Button } from 'flowbite-react';
import { signIn } from 'next-auth/react';

type Props = {
    title?: string;
    subtitle?: string;
    showReset?: boolean;
    showLogin?: boolean;
    callbackUrl?: string;
}

export default function EmptyFilter({
    title = 'Нет совпадений для указанного фильтра',
    subtitle = 'Попробуйте измененить или сбросить фильтр',
    showReset,
    showLogin,
    callbackUrl
}:Props) {
    const reset = useParamsStore(state => state.reset);
    return (
        <div className='h-[40vh] flex flex-col gap-2 justify-center items-center shadow-lg'>
            <Heading title={title} subtitle={subtitle} center />
            <div className='mt-4'>
                {showReset && (
                    <Button outline onClick={reset}>Удалить фильтры</Button>
                )}
                {showLogin && (
                    <Button outline onClick={()=>signIn('id-server',{callbackUrl:callbackUrl})}>Логин</Button>
                )}
            </div>
        </div>
    )
}
