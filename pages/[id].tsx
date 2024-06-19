// this is dynamic page
import TwitterLayout from "@/Components/Layout/TwitterLayout/TwitterLayout";
import type { NextPage } from "next";
import { IoMdArrowRoundBack } from "react-icons/io";
import Image from "next/image";
import { CgCalendarDates } from "react-icons/cg";
import { useCurrentUser } from "@/hooks/user";
import { useRouter } from "next/router";

const defaultProfileAvatarLink: string = "https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_640.png";

const UserProfilePage: NextPage = () => {
  const { user } = useCurrentUser();
  const router = useRouter(); //ths will contain query param with id as our page name is id and it will hold users id

// FIXME :make this dynamic


  return (
    <TwitterLayout>
      {user && <div className="wrapper">
        <div className="actions flex gap-6 p-1 ">
          <div className="backarrow rounded-full h-9 w-9 hover:bg-slate-800 flex items-center justify-center cursor-pointer ">
            <IoMdArrowRoundBack className=" rounded-full " />
          </div>
          <div className="user flex flex-col ">
            <h4 className="text-xl font-extrabold tracking-wide">
              {user.firstName + " " + user.lastName}
            </h4>
            {/* FIXME : update query to get tweets of user */}
            <span className="text-sm text-[#566779]">{"0 posts"}</span>
          </div>
        </div>
        <div className="profileDetails relative border-b-[1px] border-slate-700 mb-2">
          {/* TODO: add a fn to add cover pic render conditionaly */}
          <div className="photos">
            <div className="coverImage bg-[#333639] h-[124px] sm:h-[199px] ">
              {/* if present then show original cover pic */}
            </div>

            <div className="profileImage w-16 h-16 relative bottom-9 left-4 -mb-16 cursor-pointer md:w-24 md:h-24 md:bottom-12 md:-mb-24">
              <Image
                src={user?.profileImageURL ? user.profileImageURL : defaultProfileAvatarLink}
                alt={user?.firstName ? user.firstName : "user"}
                width={40}
                height={40}
                className="h-full w-full rounded-full object-cover border-2 border-black"
              />
            </div>
          </div>

          <div className="infoOfUser  text-[15px] px-3">
            <div className="logoutWrapper h-8 p-1 flex justify-end items-start mb-5">
              <button className=" px-2 rounded-full border py-[2px] border-[#536471] mt-1 hover:bg-gray-700 cursor-pointer transition-all duration-200 ease-in">
                Logout
              </button>
            </div>
            <div className="usernameinfo md:mt-10 ">
              <h2 className=" font-extrabold max-w-[50%] overflow-hidden md:text-[20px]">
                {user.firstName + " " + user.lastName}
              </h2>

              {/* TODO: Add scalar type to query on backend to support this 
              <div className="joininginfo text-[10px] text-[#566779] flex items-center gap-1 py-1 md:text-sm">
                <span className="inline-flex items-center text-sm">
                  <CgCalendarDates />
                </span>
                <span>{" Joined May 2024"}</span>
              </div> */}

              <div className="followinfo text-[#566779]  text-[12px] my-3">
                <span className="hover:bg-gray-700 cursor-pointer transition-all duration-200 ease-in  px-2 py-1 rounded-full following ">
                  <span className=" text-white font-extrabold">0</span>{" "}
                  Following
                </span>
                <span className="hover:bg-gray-700 cursor-pointer transition-all duration-200 ease-in px-2 py-1 rounded-full followers ml-2">
                  <span className=" text-white font-extrabold">0</span>{" "}
                  Followers
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="feed">Feed</div>
      </div>}
    </TwitterLayout>
  );
};

export default UserProfilePage;
// its a react component only but of type NextPage
