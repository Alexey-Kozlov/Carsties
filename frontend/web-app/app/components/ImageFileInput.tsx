import { useParamsStore } from '@/hooks/useParamsStore';
import { Label, FileInput } from 'flowbite-react';
import React, { useEffect, useRef, useState } from 'react'
import { UseControllerProps, useController } from 'react-hook-form';

type Props = {
    label: string;
    type?: string;
    showLabel?: boolean;
    image?: string;
} & UseControllerProps

export default function ImageFileInput(props: Props) {

    const {fieldState, field} = useController({...props, defaultValue:''});
    const [imageDisplay, setImageDisplay] = useState('');
    const setParams = useParamsStore(state => state.setParams);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
        const file = e.target.files && e.target.files[0];

        if(file){
            const reader = new FileReader();
            reader.readAsDataURL(file);
            
            reader.onload = (e) => {
                setImageDisplay(e.target?.result as string);
                setParams({imageValue: e.target?.result as string})
            }
        }
    }

    useEffect(() =>{
        if(props.image){
            setImageDisplay(`data:image/png;base64 ,${props.image}`);
        }
    },[])

    return (
        <div className='flex mb-3 place-content-between'>
            <div>
            <FileInput 
                    {...props}
                    {...field}
                    placeholder={props.label}
                    color={fieldState.error ? 'failure' : !fieldState.isDirty ? '' : 'success'}
                    helperText={fieldState.error?.message}
                    onChange={handleFileChange}
                />    
            </div>           

            <div className='h-52 ml-auto'>
                <img className='max-h-full max-w-full' src={imageDisplay} />
            </div>
        </div>
    )
}
