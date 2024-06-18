import { graphQLClient } from '@/clients/api';
import { verifyUserGoogleTokenQuery } from '@/graphql/queries/user';
import { useCurrentUser } from '@/hooks/user';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { useQueryClient } from '@tanstack/react-query';
import React, { useCallback } from 'react'
import toast from 'react-hot-toast';
import { BiUser } from 'react-icons/bi';
import { BsBookmark, BsTwitter } from 'react-icons/bs';
import { CiCircleMore } from 'react-icons/ci';
import { GoHomeFill } from 'react-icons/go';
import { LuSearch } from 'react-icons/lu';
import { MdOutlineMailOutline } from 'react-icons/md';
import { PiBell } from 'react-icons/pi';
import { RiMoneyDollarCircleFill } from 'react-icons/ri';
import Image from "next/image";

interface TwitterLayoutProps {
    children: React.ReactNode
}

// Interface
interface SidebarButtons {
    title: string;
    icon: React.ReactNode;
}

// Data
const sidebarMenuItems: SidebarButtons[] = [
    {
        title: "Home",
        icon: <GoHomeFill />,
    },
    {
        title: "Explore",
        icon: <LuSearch />,
    },
    {
        title: "Notifications",
        icon: <PiBell />,
    },
    {
        title: "Messeges",
        icon: <MdOutlineMailOutline />,
    },
    {
        title: "Bookmarks",
        icon: <BsBookmark />,
    },
    {
        title: "Twitter Blue",
        icon: <RiMoneyDollarCircleFill />,
    },
    {
        title: "Profile",
        icon: <BiUser />,
    },
    {
        title: "More",
        icon: <CiCircleMore />,
    },
];


const TwitterLayout: React.FC<TwitterLayoutProps> = ({ children }) => {
    const { user } = useCurrentUser();

    console.log(user);

    const queryClient = useQueryClient();





    // Hanlders
    const handleGoogleLogin = useCallback(async (cred: CredentialResponse) => {
        try {
            const googleToken = cred.credential;

            if (!googleToken) return toast.error(`Google Auth Failed`);

            console.log(`google token: ${googleToken}`);

            const { verifyGoogleToken } = await graphQLClient.request(
                verifyUserGoogleTokenQuery,
                { token: googleToken }
            );

            // console.log(cred);

            // console.log(verifyGoogleToken);
            // save to localstorage
            if (!verifyGoogleToken) return toast.error("Could not generate token");

            localStorage.setItem("__twitterToken", verifyGoogleToken);
            toast.success("Logged in successfully!");

            // force refetching of data to ensure the application has the most up-to-date information.
            // to get latest data when token is changed.
            const ann = await queryClient.invalidateQueries({
                queryKey: ["curent-user"],
            });

            return;
        } catch (err) {
            console.log(err);
        }
    }, [queryClient]);


    return (
        <div>
            {/* FIXME: Layout shift and scrollbar */}
            <div className="grid grid-cols-12 max-h-screen max-w-screen mx-1 lg:mx-28">
                {/* left sidebar */}

                <div className="col-span-2 md:col-span-3 pt-1  sm:pl-4  flex flex-col justify-between max-h-[99vh] sticky top-0">
                    <div className="sidebarandlogo ">

                        <div className="logo text-xl md:text-3xl w-fit hover:bg-gray-700 rounded-full py-2 px-2 mx-2 cursor-pointer transition-all duration-200 ease-in">
                            <BsTwitter />
                        </div>


                        <div className="max-h-[68vh] md:max-h-[55vh] overflow-scroll mt-1 custom-scrollbar">
                            {" "}
                            {/* Adjust max-height as needed */}
                            <ul className="text-sm xl:text-xl font-normal flex flex-col">
                                {sidebarMenuItems.map((item) => (
                                    <li
                                        className="flex justify-start items-center gap-4 hover:bg-gray-800 rounded-full cursor-pointer transition-all duration-200 ease-in px-4 py-2 md:py-3 pr-6 my-1 w-fit "
                                        key={item.title}
                                    >
                                        <span className="text-2xl lg:text-3xl ">{item.icon}</span>
                                        <span className=" hidden md:inline" >{item.title}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <button className=" bg-[#1d9bf0] text-lg mt-5 py-3  rounded-full w-full font-semibold tracking-wide hover:bg-sky-600  transition-all duration-300 max-w-[70%] min-w-fit hidden md:block">
                            {/* you can add custom breakpoints using this */}
                            <span >Tweet</span>
                        </button>
                        <button className="block md:hidden bg-[#1d9bf0] font-semibold text-sm md:text-xl p-2 ml-3 rounded-full">
                            <BsTwitter />
                        </button>
                    </div>

                    {/* User logout section */}
                    {user && (
                        <div className=" mb-4 flex items-center p-1 sm:p-2 bg-[#181818] m-2 rounded-full gap-3 w-fit hover:bg-gray-700 transition-all duration-200 cursor-pointer md:mx-0 ">
                            {user && user.profileImageURL && (
                                <Image
                                    className="rounded-full min-w-[30px] max-w-[30px] md:min-w-[50px]"
                                    src={user.profileImageURL}
                                    alt={user.firstName}
                                    height={50}
                                    width={50}
                                />
                            )}

                            <div className="hidden lg:block">
                                <h3>{user.firstName} {user.lastName}</h3>
                            </div>
                        </div>
                    )}
                </div>


































                {/* Feedcard Section */}
                {/* you can update the md:col-span-6 if incase design suits after google login section  */}
                <div className=" col-span-10 md:col-span-9 lg:col-span-5 border-r-[1px] border-l-[1px] border-slate-700 custom-colspan">
                    {children}
                </div>

                {/* google login */}
                {!user && (
                    <div className="hidden md:block md:col-span-4 p-4 ml-10 lg:ml-20">
                        <GoogleLogin onSuccess={handleGoogleLogin} />
                    </div>
                )}
            </div>
        </div>
    )
}

export default TwitterLayout;


/*



*/