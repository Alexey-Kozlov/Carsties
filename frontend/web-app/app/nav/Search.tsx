'use client'

import { useParamsStore } from '@/hooks/useParamsStore';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

export default function Search() {
    const router = useRouter();
    const pathName = usePathname();
    const setParams = useParamsStore(state => state.setParams);
    const setSearchValue = useParamsStore(state => state.setSearchValue);
    const searchValue = useParamsStore(state => state.searchValue);

    const onChange = (event:any) => {
        setSearchValue(event.target.value);
    }
    const Search = () => {
        if(pathName !== '/') router.push('/');
        setParams({searchTerm: searchValue});
    }

    return (
        <div className='flex items-center border-2 rounded-full py-2 shadow-sm' style={{width:'600px'}}>
            <input 
                type='text'
                placeholder='Поиск автомобилей по производителю, модели или цвету'
                className='input-custom text-sm text-gray-600'
                value={searchValue}
                onChange={onChange}
                onKeyDown={(e: any) => {
                    if(e.key == 'Enter') Search();
                }}
            />
            <button
                onClick={() => Search()}
            >
                <FaSearch size={34} className='bg-red-400 text-white rounded-full p-2 cursor-pointer mx-2' />
            </button>
        </div>
    )
}
