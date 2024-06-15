import { BsBookmark, BsTwitter } from "react-icons/bs";
import React, { useCallback } from "react";
import { BiUser } from "react-icons/bi";
import { LuSearch } from "react-icons/lu";
import { PiBell } from "react-icons/pi";
import { MdOutlineMailOutline } from "react-icons/md";
import FeedCard from "@/Components/Layout/FeedCard/FeedCard";
import { GoHomeFill } from "react-icons/go";
import { CiCircleMore } from "react-icons/ci";
import { RiMoneyDollarCircleFill, RiMoneyRupeeCircleFill } from "react-icons/ri";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { graphQLClient } from "@/clients/api";
import { verifyUserGoogleTokenQuery } from "@/graphql/queries/user";
import { useCurrentUser } from "@/hooks/user";
import { useQueryClient } from "@tanstack/react-query";

// TODO: Refactor the code and split into components

// Interface 
interface SidebarButtons {
  title: string;
  icon: React.ReactNode;
}

// Data
const sidebarMenuItems: SidebarButtons[] = [
  {
    title: "Home",
    icon: <GoHomeFill />
  },
  {
    title: "Explore",
    icon: <LuSearch />
  },
  {
    title: "Notifications",
    icon: <PiBell />
  },
  {
    title: "Messeges",
    icon: <MdOutlineMailOutline />
  },
  {
    title: "Bookmarks",
    icon: <BsBookmark />,
  },
  {
    title: "Twitter Blue",
    icon: <RiMoneyDollarCircleFill />
  },
  {
    title: "Profile",
    icon: <BiUser />
  },
  {
    title: "More",
    icon: <CiCircleMore />
  }
];


export default function Home() {
  const { user } = useCurrentUser();
  const queryClient = useQueryClient();

  const handleGoogleLogin = useCallback(
    async (cred: CredentialResponse) => {
      try {
        const googleToken = cred.credential;

        if (!googleToken) return toast.error(`Google Auth Failed`);

        console.log(`google token: ${googleToken}`);

        const { verifyGoogleToken } = await graphQLClient.request(verifyUserGoogleTokenQuery, { token: googleToken });

        // console.log(cred);

        // console.log(verifyGoogleToken);
        // save to localstorage
        if (!verifyGoogleToken) return toast.error("Could not generate token");

        localStorage.setItem("__twitterToken", verifyGoogleToken);
        toast.success("Logged in successfully!");

        // force refetching of data to ensure the application has the most up-to-date information.
        // to get latest data when token is changed.
        const ann = await queryClient.invalidateQueries({ queryKey: ["curent-user"] });

        return;
      } catch (err) {
        console.log(err);
      }
    }, []);
  

  return (
    <div>
      <div className="grid grid-cols-12 h-screen w-screen px-28">

        <div className="col-span-3 pt-1 px-4 pr-16">
          <div className=" text-3xl w-fit hover:bg-gray-700 rounded-full py-2 px-4 cursor-pointer transition-all duration-200 ease-in">
            <BsTwitter />
          </div>
          <div>
            <ul className="text-xl mt-1 font-normal ">
              {sidebarMenuItems.map(item =>
                <li className="flex justify-start items-center gap-4 hover:bg-gray-800 rounded-full cursor-pointer transition-all duration-200 ease-in px-4  py-3 pr-6 my-1 w-fit" key={item.title}>
                  <span className="text-3xl">{item.icon}</span>  <span>{item.title}</span>
                </li>)}
            </ul>

          </div>
          <button className=" bg-[#1d9bf0] text-lg mt-5 py-3  rounded-full w-full font-semibold tracking-wide hover:bg-sky-600  transition-all duration-300">
            Tweet
          </button>
        </div>

        <div className="col-span-5 border-r-[1px] border-l-[1px] border-slate-700">
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
        </div>

        {!user && <div className="col-span-4 p-4">
          <GoogleLogin onSuccess={handleGoogleLogin} />
        </div>}
      </div>
    </div>
  );
}
