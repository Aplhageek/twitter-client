// this is dynamic page 
import TwitterLayout from "@/Components/Layout/TwitterLayout/TwitterLayout";
import type { NextPage } from "next"
import { IoMdArrowRoundBack } from "react-icons/io";
import Image from "next/image";
import { CgCalendarDates } from "react-icons/cg";

const UserProfilePage: NextPage = () => {

  return (
    <TwitterLayout>
      <div className="wrapper">
        <div className="actions flex gap-6 p-1 ">
          <div className="backarrow rounded-full h-9 w-9 hover:bg-slate-800 flex items-center justify-center cursor-pointer ">
            <IoMdArrowRoundBack className=" rounded-full " />
          </div>
          <div className="user flex flex-col ">
            <h4 className="text-xl font-extrabold tracking-wide">{"Jayesh Ahirrao"}</h4>
            <span className="text-sm text-[#566779]">{"0 posts"}</span>
          </div>
        </div>
        <div className="profileDetails relative border-b-[1px] border-slate-700 mb-2">
          {/* render conditionaly */}
          <div className="photos">
            <div className="coverImage bg-[#333639] h-[124px] sm:h-[199px] ">
              {/* if present then show original cover pic */}

            </div>

            <div className="profileImage w-16 h-16 relative bottom-9 left-4 -mb-16 cursor-pointer ">
              <Image src="https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_640.png"
                alt="User" width={40} height={40}
                className="h-full w-full rounded-full object-cover border-2 border-black" />
            </div>
          </div>

          <div className="infoOfUser  text-[15px] px-3">
            <div className="logoutWrapper h-8 p-1 flex justify-end items-start mb-5">
              <button className=" px-2 rounded-full border py-[2px] border-[#536471] mt-1 hover:bg-gray-700 cursor-pointer transition-all duration-200 ease-in" >Logout</button>
            </div>
            <div className="usernameinfo">
              <h2 className=" font-extrabold max-w-[50%] overflow-hidden">Jayesh Ahirrao</h2>

              <div className="joininginfo text-[10px] text-[#566779] flex items-center gap-1 py-1">
                <span className="inline-flex items-center text-sm">
                  <CgCalendarDates />
                </span>
                <span>{" Joined May 2024"}</span>
              </div>

              <div className="followinfo text-[#566779]  text-[12px] my-3">
                <span className="hover:bg-gray-700 cursor-pointer transition-all duration-200 ease-in  px-2 py-1 rounded-full following "><span className=" text-white font-extrabold">0</span> Following</span>
                <span className="hover:bg-gray-700 cursor-pointer transition-all duration-200 ease-in px-2 py-1 rounded-full followers ml-2"><span className=" text-white font-extrabold">0</span> Followers</span>
              </div>

            </div>
          </div>





        </div>



        <div className="feed">
          Feed
        </div>
      </div>
    </TwitterLayout>
  )
}

export default UserProfilePage;
// its a react component only but of type NextPage