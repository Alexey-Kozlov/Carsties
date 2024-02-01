'use client'

import { useParamsStore } from '@/hooks/useParamsStore';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import { AiOutlineCar } from 'react-icons/ai';

export default function Logo() {

    const router = useRouter();
    const pathName = usePathname();
    const reset = useParamsStore(state => state.reset);

    const doReset = () => {
        if(pathName !== '/') router.push('/');
        reset();
    }

    return (
        <div 
            className='flex items-center gap-2 text-3xl font-semibold text-red-500 cursor-pointer'
            onClick={doReset}
        >
        <AiOutlineCar size={34} />
        <div>Carsties Аукцион</div>
    </div>
    )
}
