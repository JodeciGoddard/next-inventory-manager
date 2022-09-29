import { useRouter } from "next/router";
import Link from "next/link";
import { SiShopware } from 'react-icons/si';
import { MdOutlineCancel } from 'react-icons/md';
import { TooltipComponent } from "@syncfusion/ej2-react-popups";

import { links } from '../data/dummy';
import { useStateContext } from "../contexts/ContextProvider";

const Sidebar = () => {
    const { activeMenu, setActiveMenu, screenSize, currentColor } = useStateContext();
    let router = useRouter();

    const handleCloseSidebar = () => {
        if (activeMenu && screenSize <= 900) {
            setActiveMenu(false)
        }
    }

    const isActive = (link) => {
        if (router.pathname.includes(link)) {
            return 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-white text-md m-2 cursor-pointer';
        };

        if (link === 'home' && router.pathname === '/') {
            return 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-white text-md m-2 cursor-pointer';
        };

        return `flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-gray-700 text-md
        dark:text-gray-200 dark:hover:text-black hover:bg-light-gray m-2 cursor-pointer`;
    }

    const isActiveStyle = (link) => {

        if (router.pathname.includes(link)) {
            return { backgroundColor: currentColor };
        };

        if (link === 'home' && router.pathname === '/') {
            return { backgroundColor: currentColor };

        }


        return {};
    };

    return (
        <div className="ml-3 h-screen md:overflow-hidden overflow-auto
        md:hover:overflow-auto pb-10">
            {activeMenu && <>
                <div className="flex justify-between items-center">
                    <Link href="/">
                        <div onClick={handleCloseSidebar} className="items-center gap-3 ml-3 mt-4 flex text-xl font-extrabold tracking-tight
                dark:text-white text-slate-900">
                            <SiShopware />
                            <span>Shoppy</span>
                        </div>
                    </Link>
                    <TooltipComponent content="Menu" position="BottomCenter">
                        <button type="button"
                            onClick={() => setActiveMenu(prev => !prev)}
                            className='text-xl rounded-full p-3 hover:bg-light-gray
                             mt-4 block'
                        >
                            <MdOutlineCancel />
                        </button>
                    </TooltipComponent>
                </div>
                <div className="mt-10 ">
                    {
                        links.map(item => {
                            return (
                                <div key={item.title}>
                                    <p className="text-gray-400 m-3 mt-4 uppercase">
                                        {item.title}
                                    </p>
                                    {
                                        item.links.map(link => {
                                            return (
                                                <Link key={link.name}

                                                    href={link.url}
                                                >
                                                    <div onClick={handleCloseSidebar} style={isActiveStyle(link.name)} className={isActive(link.name)}>
                                                        {link.icon}
                                                        <span className="capitalize">
                                                            {link.name}
                                                        </span>
                                                    </div>
                                                </Link>
                                            )
                                        })
                                    }
                                </div>
                            );
                        })
                    }
                </div>
            </>}
        </div>
    );
}

export default Sidebar;