import React from 'react';
import moment from 'moment';



interface ComponentProps{
    className?:string;
}
export default function DisplayTime({className}:ComponentProps){
    const fixedTime = moment('2023-10-01T14:40:00');
    const formattedTime = fixedTime.format('hh:mm A');

    return(
        <>
             <span className={className}>{formattedTime}</span>
        </>
    )
}