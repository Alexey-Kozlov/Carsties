'use client'

import { useParamsStore } from '@/hooks/useParamsStore';
import { Dropdown } from 'flowbite-react';
import { User } from 'next-auth';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import { AiFillCar, AiFillTrophy, AiOutlineLogout } from 'react-icons/ai';
import { HiCog, HiUser } from 'react-icons/hi2';

type Props = {
    user: Partial<User>;
}

export default function UserActions({user}:Props) {
    const router = useRouter();
    const pathName = usePathname();
    const setParams = useParamsStore(state => state.setParams);

    const SetWinner = () => {
        setParams({winner: user.login, seller: undefined});
        if(pathName !== '/') router.push('/');
    }

    const SetSeller = () => {
        setParams({seller: user.login, winner: undefined});
        if(pathName !== '/') router.push('/');
    }

    return (
        <Dropdown inline label={`Здравствуйте ${user.name}`}>
            <Dropdown.Item icon={HiUser} onClick={SetSeller}>
                Мои аукционы
            </Dropdown.Item>
            <Dropdown.Item icon={AiFillTrophy} onClick={SetWinner}>
                Аукционы выигранные
            </Dropdown.Item>
            <Dropdown.Item icon={AiFillCar}>
                <Link href='/auctions/create'>Выставить на аукцион</Link>
            </Dropdown.Item>
            <Dropdown.Item icon={HiCog}>
                <Link href='/session'>Сессии (разработка)</Link>
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item icon={AiOutlineLogout} onClick={()=>signOut({callbackUrl:'/'})}>
                Выход
            </Dropdown.Item>
        </Dropdown>
    )
}
