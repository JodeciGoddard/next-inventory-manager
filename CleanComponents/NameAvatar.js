import React from 'react';

const NameAvatar = ({ name, color, size }) => {
    let names = name.split(' ');
    let finalName = "";
    finalName += names[0][0];

    if (names[1].trim() !== '') {
        finalName += names[1][0];
    } else {
        finalName += names[0][0];
    }

    return (
        <div
            className='flex justify-center rounded-full
            text-white  items-center text-sm font-bold'
            style={{ backgroundColor: color, width: size, height: size }}>
            {finalName}
        </div>
    )
}

export default NameAvatar;