import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";




interface ComponentPros{
    options:{label:string,value:string}[];
}

const SelectIcon=({options}:ComponentPros)=>{

    const[selected,setSelected]= useState('');



    const handleChange = ()=>{
        console.log(selected);
        setSelected(selected);
    }

    // const Icon ={faChevronDown};

    return (
        <div>
            <select 
                id="selectIcon" 
                name="selectIcon" 
                value={selected} 
                onChange={handleChange} 
                aria-label="selectIcon"
            >
            {options.map((option)=>(
                <option key={option.value} value={option.value}>{option.label}</option>
            )
        )
            }
            </select>
            <span className="ml-2">
                <FontAwesomeIcon icon={faChevronDown} />
            </span>
        </div>
    )
}


export default SelectIcon