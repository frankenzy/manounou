// @ts-nocheck
import React from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';


interface ComponentProps{
    className?:string;
    name:string
}

export default function Icon({name,className}:ComponentProps){
    return(
        <FontAwesomeIcon icon ={`fa fa-${name}`}>
            <i className={`fa fa-${name}`+` ${className}`}></i>
        </FontAwesomeIcon>
    )
}