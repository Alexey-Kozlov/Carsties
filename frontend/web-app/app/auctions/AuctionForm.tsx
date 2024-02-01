'use client'

import { Button, TextInput } from 'flowbite-react';
import React, { useEffect } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import Input from '../components/Input';
import DateInput from '../components/DateInput';
import { createAuction } from '../actions/AuctionAction';
import { useRouter } from 'next/navigation';
import ImageFileInput from '../components/ImageFileInput';
import { useParamsStore } from '@/hooks/useParamsStore';

export default function AuctionForm() {

    const router = useRouter();
    const imageValue = useParamsStore(state => state.imageValue);
    const { control, handleSubmit, setFocus,
        formState: { isSubmitting, isValid } } = useForm({
            mode: 'onTouched'
        });

    useEffect(()=>{
        setFocus('make');
    },[setFocus]);

    const onSubmit = async (data: FieldValues) => {
        data.image = imageValue;
        console.log(data);
        try {
            const res = await createAuction(data);
            if(res.error){
                throw new Error(res.error);
            }
            router.push(`/auctions/details/${res.id}`);
        } catch (error) {
            console.log(error);
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
            <Input label='Ссылка на изображение' name='imageUrl' control={control}
                rules={{ required: 'Необходимо указать ссылку на изображение!' }} />
            <ImageFileInput label='Изображение' name='image' control={control}
                />

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
                >Создать
                </Button>
            </div>
        </form>
    )
}
