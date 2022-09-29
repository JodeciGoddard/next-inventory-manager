import React, { useState, useEffect } from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
import { FiShoppingCart } from 'react-icons/fi'
import { BsChatLeft } from 'react-icons/bs'
import { RiNotificationLine } from 'react-icons/ri'
import { MdKeyboardArrowDown } from 'react-icons/md';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

import avatar from '../data/avatar.jpg';
import { Cart, Chat, Notification, UserProfile } from '../components'

import { useStateContext } from '../contexts/ContextProvider';
import Image from 'next/image';
import { useUser } from '@supabase/auth-helpers-react';
import NameAvatar from '../CleanComponents/NameAvatar';

const NavButton = ({ title, customFun, icon, color, dotColor }) => {
    return (
        <TooltipComponent content={title} position="BottomCenter">
            <button type="button" onClick={customFun} style={{ color }}
                className="relative text-xl rounded-full p-3 
                hover:bg-light-gray"
            >
                <span style={{ backgroundColor: dotColor }}
                    className='absolute inline-flex rounded-full h-2 w-2 right-2 top-2'
                />
                {icon}
            </button>
        </TooltipComponent>
    )
}


const Navbar = () => {

    const { user } = useUser();
    const [name, setName] = useState('Default');
    const [avatarColor, setAvatarColor] = useState('#000000');

    const { activeMenu, setActiveMenu, isClicked, setIsClicked,
        handleClick, screenSize, setScreenSize, currentColor } = useStateContext();

    useEffect(() => {
        const handleResize = () => setScreenSize(window.innerWidth);

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        }

    }, [])


    useEffect(() => {
        if (screenSize <= 900) {
            setActiveMenu(false)
        } else {
            setActiveMenu(true);
        }
    }, [screenSize])

    useEffect(() => {
        if (user) {
            let fullname = user.user_metadata.fullname;
            let avatarColor = user.user_metadata.avatarColor;

            setName(fullname.split(' ')[0]);
            setAvatarColor(avatarColor);
        }
    }, [user])

    return (
        <div className='flex justify-between p-2 md:mx-6 relative'>
            <NavButton
                title="Menu"
                customFun={() => setActiveMenu(prev => !prev)}
                color={currentColor}
                icon={<AiOutlineMenu />}
            />

            {user && <div className='flex'>
                {/* <NavButton
                    title="Cart"
                    customFun={() => handleClick('cart')}
                    color={currentColor}
                    icon={<FiShoppingCart />}
                />
                <NavButton
                    title="Chat"
                    dotColor="#03C9D7"
                    customFun={() => handleClick('chat')}
                    color={currentColor}
                    icon={<BsChatLeft />}
                />
                <NavButton
                    title="Notifications"
                    dotColor="#03C9D7"
                    customFun={() => handleClick('notification')}
                    color={currentColor}
                    icon={<RiNotificationLine />}
                /> */}
                <TooltipComponent
                    content="Profile"
                    position="BottomCenter"
                >
                    <div className='flex items-center gap-2 cursor-pointer
                    hover:bg-light-gray  rounded-lg'
                        onClick={() => handleClick('userProfile')}
                    >
                        {/* <div className='rounded-full w-8 h-8'>
                            <Image
                                src={avatar}
                                width="100%"
                                height="100%"
                                className='rounded-full'
                            />
                        </div> */}

                        <NameAvatar
                            name={user.user_metadata.fullname}
                            color={avatarColor}
                            size="2rem"
                        />
                        <p>
                            <span className='text-gray-400 text-14'>Hi, </span> {' '}
                            <span className='text-gray-400 font-bold ml-1 text-14'>{name}</span>
                        </p>
                        <MdKeyboardArrowDown className='text-gray-400 text-14' />
                    </div>
                </TooltipComponent>

                {isClicked.cart && <Cart />}
                {isClicked.chat && <Chat />}
                {isClicked.notification && <Notification />}
                {isClicked.userProfile && <UserProfile user={user} />}
            </div>}
        </div>
    );
}

export default Navbar;