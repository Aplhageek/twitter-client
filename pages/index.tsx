import { BsBookmark, BsTwitter } from "react-icons/bs";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { BiUser } from "react-icons/bi";
import { LuSearch } from "react-icons/lu";
import { PiBell } from "react-icons/pi";
import { MdOutlineMailOutline } from "react-icons/md";
import FeedCard from "@/Components/Layout/FeedCard/FeedCard";
import { GoHomeFill } from "react-icons/go";
import { CiCircleMore, CiImageOn } from "react-icons/ci";
import {
  RiMoneyDollarCircleFill,
  RiMoneyRupeeCircleFill,
} from "react-icons/ri";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { graphQLClient } from "@/clients/api";
import { verifyUserGoogleTokenQuery } from "@/graphql/queries/user";
import { useCurrentUser } from "@/hooks/user";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";

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

export default function Home() {
  const { user } = useCurrentUser();
  const queryClient = useQueryClient();


  const handleInputImageForPost = useCallback(() => {
      // create a new input eleemnt
      const input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", "image/*");
      input.click(); //this allows to open the input modal
    },
    [],
  )
  

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
  }, []);

  return (
    <div>
      <div className="grid grid-cols-12 h-screen w-screen overflow-y-auto px-28">
        {/* left sidebar */}
        <div className="col-span-3 pt-1 px-4 pr-16 flex flex-col max-h-screen sticky top-0">
          <div className=" text-3xl w-fit hover:bg-gray-700 rounded-full py-2 px-4 cursor-pointer transition-all duration-200 ease-in">
            <BsTwitter />
          </div>

          <div>
            <div className="max-h-[55vh] overflow-y-auto mt-1 custom-scrollbar">
              {" "}
              {/* Adjust max-height as needed */}
              <ul className="text-xl font-normal">
                {sidebarMenuItems.map((item) => (
                  <li
                    className="flex justify-start items-center gap-4 hover:bg-gray-800 rounded-full cursor-pointer transition-all duration-200 ease-in px-4 py-3 pr-6 my-1 w-fit"
                    key={item.title}
                  >
                    <span className="text-3xl">{item.icon}</span>
                    <span>{item.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <button className=" bg-[#1d9bf0] text-lg mt-5 py-3  rounded-full w-full font-semibold tracking-wide hover:bg-sky-600  transition-all duration-300">
            Tweet
          </button>

          {user && (
            <div className="mt-auto mb-4 flex items-center px-2 bg-[#181818] py-2 rounded-full gap-3 w-fit hover:bg-gray-700 transition-all duration-200 cursor-pointer  ">
              {user && user.profileImageURL && (
                <Image
                  className="rounded-full"
                  src={user.profileImageURL}
                  alt={user.firstName}
                  height={50}
                  width={50}
                />
              )}
              <div>
                <h3>
                  {user.firstName} {user.lastName}
                </h3>
                <h3></h3>
              </div>
            </div>
          )}
        </div>

        {/* Feedcard */}
        <div className="col-span-6  border-r-[1px] border-l-[1px] border-slate-700 custom-colspan">
          {/* Post input */}
          {user && (
            <div className="grid grid-cols-12 border-slate-700 px-5 py-3 hover:bg-[#101010] transition-all duration-200">
              <div className="col-span-1 h-fit">
                <Image
                  className="rounded-full cursor-pointer hover:scale-95 transition-all duration-500 "
                  src={user?.profileImageURL || ""}
                  alt={user?.firstName}
                  width={50}
                  height={50}
                />
              </div>

              <div className="col-span-11 px-2">
                <textarea
                  name="input"
                  rows={4}
                  className=" bg-transparent w-full custom-scrollbar p-2 h-auto mb-2"
                  placeholder="What is happening !"
                />
                <div className="actions flex justify-between items-center mb-2 ">
                  <CiImageOn 
                  className="text-xl text-[#1D9BF0] hover:text-[#00BA7C] transition-all duration-150 cursor-pointer " 
                  onClick={handleInputImageForPost}
                  />

                  <button className=" bg-[#1d9bf0] text-sm px-4 py-2 font-semibold rounded-full  hover:bg-sky-600  transition-all duration-300">
                      Post
                  </button>
                </div>
              </div>

            </div>
          )}
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

        {/* google login */}
        {!user && (
          <div className="col-span-3 p-4">
            <GoogleLogin onSuccess={handleGoogleLogin} />
          </div>
        )}
      </div>
    </div>
  );
}
