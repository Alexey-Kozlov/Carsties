import EmptyFilter from '@/app/components/EmptyFilter'
import React from 'react'

export default function Page({searchParams}:{searchParams:{callbackUrl: string}}) {
    return (
       <EmptyFilter 
            title='Необходимо войти в систему'
            subtitle='Пожалуйста нажмите кнопку "Логин" для входа в систему'
            showLogin
            callbackUrl={searchParams.callbackUrl}
        />
    )
}
