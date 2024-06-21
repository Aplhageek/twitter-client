// this is dynamic page
import TwitterLayout from "@/Components/Layout/TwitterLayout/TwitterLayout";
import type { GetServerSideProps, NextPage } from "next";
import { IoMdArrowRoundBack } from "react-icons/io";
import Image from "next/image";
import {  useGetUserById } from "@/hooks/user";
import { useRouter } from "next/router";
import { graphQLClient } from "@/clients/api";
import { getUserByIdQuery } from "@/graphql/queries/user";
import { Tweet, User } from "@/gql/graphql";
import FeedCard from "@/Components/Layout/FeedCard/FeedCard";


interface ServerProps {
  user?: User
}

const UserProfilePage: NextPage<ServerProps> = (props) => {
  
  return (
    <TwitterLayout>
      {props.user && <div className="wrapper">
        <div className="actions flex gap-6 p-1 ">
          <div className="backarrow rounded-full h-9 w-9 hover:bg-slate-800 flex items-center justify-center cursor-pointer ">
            <IoMdArrowRoundBack className=" rounded-full " />
          </div>
          <div className="user flex flex-col ">
            <h4 className="text-xl font-extrabold tracking-wide">
              {props.user.firstName + " " + props.user.lastName}
            </h4>
            <span className="text-sm text-[#566779]">{`${props.user.tweets?.length} tweets` }</span>
          </div>
        </div>
        <div className="profileDetails relative border-b-[1px] border-slate-700">
          {/* TODO: add a fn to add cover pic render conditionaly */}
          <div className="photos">
            <div className="coverImage bg-[#333639] h-[124px] sm:h-[199px] ">
              {/* if present then show original cover pic */}
            </div>

            <div className="profileImage w-16 h-16 relative bottom-9 left-4 -mb-16 cursor-pointer md:w-24 md:h-24 md:bottom-12 md:-mb-24">
              <Image
                src={props.user?.profileImageURL as string }
                alt={props.user?.firstName ? props.user.firstName : "user"}
                width={1000}
                height={1000}
                className="h-full w-full rounded-full object-cover border-2 border-black bg-white"
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
                {props.user.firstName + " " + props.user.lastName}
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

        <div className="feed">
          {
            props.user.tweets?.map((tweet)=> <FeedCard key={tweet?.id} data={tweet as Tweet} /> )
          }
        </div>
      </div>}
    </TwitterLayout>
  );
};


export const getServerSideProps: GetServerSideProps<ServerProps> = async (
  context
) => {
  const id = context.query.id as string | undefined;

  if (!id) return { notFound: true, props: { user: undefined } };

  const userInfo = await graphQLClient.request(getUserByIdQuery, { id });

  if (!userInfo?.getUserById) return { notFound: true };

  return {
    props: {
      user: userInfo.getUserById as User,
    },
  };
};

export default UserProfilePage;
// its a react component only but of type NextPage