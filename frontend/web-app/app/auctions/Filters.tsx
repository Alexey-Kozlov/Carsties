import { useParamsStore } from '@/hooks/useParamsStore';
import { Button, ButtonGroup } from 'flowbite-react';
import { Icon } from 'next/dist/lib/metadata/types/metadata-types';
import React from 'react'
import { AiOutlineClockCircle, AiOutlineSortAscending } from 'react-icons/ai';
import { BsFillStopCircleFill, BsStopwatchFill } from 'react-icons/bs';
import { GiFinishLine, GiFlame } from 'react-icons/gi';

const pageSizeButtons = [4, 8, 16];
const orderButtons = [
    {
        label: 'По наименованию',
        icon: AiOutlineSortAscending,
        value: 'make'
    },
    {
        label: 'По окончанию аукционов',
        icon: AiOutlineClockCircle,
        value: 'other'
    },
    {
        label: 'Недавно добавленные',
        icon: BsFillStopCircleFill,
        value: 'new'
    }
];
const filterButtons = [
    {
        label: 'Текущие аукционы',
        icon: GiFlame,
        value: 'live'
    },
    {
        label: 'Закончились < 6 часов',
        icon: GiFinishLine,
        value: 'endingSoon'
    },
    {
        label: 'Завершенные',
        icon: BsStopwatchFill,
        value: 'finished'
    }
];

export default function Filters() {
    const pageSize = useParamsStore(state => state.pageSize);
    const setParams = useParamsStore(state => state.setParams);
    const orderBy = useParamsStore(state => state.orderBy);
    const filterBy = useParamsStore(state => state.filterBy);

    return (
        <div className='flex justify-between items-center mb-4'>
            <div style={{ width: '455px' }}>
                <div style={{ textAlign: 'center' }}>
                    <span className='uppercase text-sm text-gray-500 mr-2'>Отбор по : </span>
                </div>

                <Button.Group>
                    {filterButtons.map(({ label, icon: Icon, value }) => {
                        return (
                            <Button
                                key={value}
                                onClick={() => setParams({ filterBy: value })}
                                color={`${filterBy == value ? 'red' : 'gray'}`}
                                className='focus:ring-0'
                            >
                                <Icon className='mr-3 h-4 w-4' />
                                {label}
                            </Button>
                        )
                    })}
                </Button.Group>


            </div>
            <div style={{ maxWidth: '475px' }}>
                <div style={{ textAlign: 'center' }}>
                    <span className='uppercase text-sm text-gray-500 mr-2'>Сортировать по : </span>
                </div>

                <Button.Group>
                    {orderButtons.map(({ label, icon: Icon, value }) => {
                        return (
                            <Button
                                key={value}
                                onClick={() => setParams({ orderBy: value })}
                                color={`${orderBy == value ? 'red' : 'gray'}`}
                                className='focus:ring-0'
                            >
                                <Icon className='mr-3 h-4 w-4' />
                                {label}
                            </Button>
                        )
                    })}
                </Button.Group>
            </div>
            <div style={{ maxWidth: '140px' }}>
                <div style={{ textAlign: 'center' }}>
                    <span className='uppercase text-sm text-gray-500 mr-2'>Размер страницы</span>
                </div>
                <Button.Group>
                    {pageSizeButtons.map((value: number, index: number) => {
                        return (
                            <Button key={index}
                                onClick={() => setParams({ pageSize: value })}
                                color={`${pageSize == value ? 'red' : 'gray'}`}
                                className='focus:ring-0'
                            >
                                {value}
                            </Button>
                        )
                    })}
                </Button.Group>
            </div>
        </div>
    )
}
