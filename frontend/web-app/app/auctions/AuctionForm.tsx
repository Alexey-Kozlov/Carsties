'use client'

import { Button, TextInput } from 'flowbite-react';
import React, { useEffect } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import Input from '../components/Input';
import DateInput from '../components/DateInput';
import { createAuction, updateAuction } from '../actions/AuctionAction';
import { usePathname, useRouter } from 'next/navigation';
import ImageFileInput from '../components/ImageFileInput';
import { useParamsStore } from '@/hooks/useParamsStore';
import toast from 'react-hot-toast';
import { Auction } from '@/types';
import TextAreaInput from '../components/TextAreaInput';
import CarImage from './CarImage';

type Props = {
    auction?: Auction;
}

export default function AuctionForm({ auction }: Props) {

    const router = useRouter();
    const pathName = usePathname();
    const imageValue = useParamsStore(state => state.imageValue);
    const { control, handleSubmit, setFocus, reset,
        formState: { isSubmitting, isValid } } = useForm({
            mode: 'onTouched'
        });

    useEffect(() => {
        if (auction) {
            const { make, model, color, mileage, year, description, reservePrice, auctionEnd} = auction;
            reset({ make, model, color, mileage, year, description, reservePrice});
        }
        setFocus('make');
    }, [setFocus]);

    const onSubmit = async (data: FieldValues) => {
        data.image = imageValue;
        try {
            let id = '';
            let res;
            if (pathName === '/auctions/create') {
                res = await createAuction(data);
                id = res.id;
            } else {
                if (auction) {
                    res = await updateAuction(data, auction.id);
                    id = auction.id;
                }
            }

            if (res.error) {
                throw res.error;
            }
            router.push(`/auctions/details/${id}`);
        } catch (error: any) {
            toast.error(error.status + ' ' + error.message);
        }
    }

    return (
        <form className='flex flex-col mt-3' onSubmit={handleSubmit(onSubmit)}>
            <Input label='Производитель' name='make' control={control}
                rules={{ required: 'Необходимо указать производителя!' }} />
            <Input label='Модель' name='model' control={control}
                rules={{ required: 'Необходимо указать модель автомобиля!' }} />
            <Input label='Цвет' name='color' control={control}
                rules={{ required: 'Необходимо указать цвет автомобиля!' }} />

            <div className='grid grid-cols-2 gap-3'>
                <Input label='Год выпуска' name='year' control={control} type='number'
                    rules={{ required: 'Необходимо указать дату выпуска автомобиля!' }} />
                <Input label='Пробег' name='mileage' control={control} type='number'
                    rules={{ required: 'Необходимо указать пробег автомобиля!' }} />
            </div>
            <div>
                <ImageFileInput label='Изображение' name='image' control={control} image={auction?.image} />
            </div>
            


            <TextAreaInput label='Примечание' name='description' control={control} />
            <div className='grid grid-cols-2 gap-3'>
                <Input label='Начальная цена' name='reservePrice' control={control} type='number'
                    rules={{ required: 'Укажите стартовую цену автомобиля' }} />
                <DateInput
                    label='Дата/время окончания аукциона'
                    name='auctionEnd'
                    control={control}
                    dateFormat='dd.MM.yyyy HH:mm'
                    showTimeSelect
                    rules={{ required: 'Необходимо указать дату и время окончания аукциона' }} />
            </div>
            <div className='flex justify-between'>
                <Button outline color='gray'>Отмена</Button>
                <Button
                    isProcessing={isSubmitting}
                    type='submit'
                    outline
                    color='success'
                    disabled={!isValid}
                >
                    {pathName === '/auctions/create' ? 'Создать' : 'Сохранить'}                                        
                </Button>
            </div>
        </form>
    )
}
