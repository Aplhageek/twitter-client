// this is dynamic page
import TwitterLayout from "@/Components/Layout/TwitterLayout/TwitterLayout";
import type { GetServerSideProps, NextPage } from "next";
import { IoMdArrowRoundBack } from "react-icons/io";
import Image from "next/image";
import {  useCurrentUser, useGetUserById } from "@/hooks/user";
import {  useRouter } from "next/router";
import { graphQLClient } from "@/clients/api";
import { getUserByIdQuery } from "@/graphql/queries/user";
import { Tweet, User } from "@/gql/graphql";
import FeedCard from "@/Components/Layout/FeedCard/FeedCard";
import { useCallback, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { followUserMutation, unfollowUserMutation } from "@/graphql/mutation/user";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";


interface ServerProps {
  user?: User
}

const UserProfilePage: NextPage<ServerProps> = (props) => {
  const { user } = useCurrentUser();
  const queryClient = useQueryClient();
  const router = useRouter(); 

  const { user: profileUser = props.user  } = useGetUserById(props.user?.id as string);


  const [isFollowBtnActive, setIsFollowBtnActive] = useState(false);



  const amIFollowing = useMemo(() => {
    // TODO: remove this to simple logic if even after resolving stale data of SSR is not updating 
    if (!user || !user.followings) return false;
    if (!profileUser || !profileUser.followers) return false;

    if (user?.followings?.length <= profileUser?.followers?.length) {
      // find for props.user in followings list of users
      const index = user?.followings?.findIndex(record => record?.id === profileUser?.id)
      return index >= 0;
    } else {
      // find user in followers list of props.user
      const index = profileUser?.followers?.findIndex(record => record?.id === user?.id)
      return index >= 0;
    }
  }, [profileUser, user]);


  const handleFollowUser = useCallback(async () => {
    if (!profileUser) return toast.error("something went wrong");
    setIsFollowBtnActive(true);
    try {
      await graphQLClient.request(followUserMutation, { to: profileUser.id });
      await queryClient.invalidateQueries({ queryKey: ["current-user"] });
      await queryClient.invalidateQueries({ queryKey: ["user-by-id"] });
      toast.success(`You are now following ${profileUser.firstName}`);
    } catch (error) {
      toast.error('Failed to follow user');
    } finally {
      setIsFollowBtnActive(false);
    }
  }, [profileUser, queryClient]);


  const handleUnfollowUser = useCallback(async () => {
    if (!profileUser) return toast.error("something went wrong");
    setIsFollowBtnActive(true);
    try {
      await graphQLClient.request(unfollowUserMutation, { to: profileUser.id });
      await queryClient.invalidateQueries({ queryKey: ["current-user"] });
      await queryClient.invalidateQueries({ queryKey: ["user-by-id"] });
      toast.success(`Unfollowed ${profileUser.firstName}`);
    } catch (error) {
      toast.error('Failed to unfollow user');
    } finally {
      setIsFollowBtnActive(false);
    }
  }, [profileUser, queryClient]);


  const handleLogout = useCallback(async () => {
    localStorage.removeItem("__twitterToken");
    await queryClient.invalidateQueries({ queryKey: ["current-user"] });
    toast.success(`Logout succesfully`);
    router.push('/');
  }, [queryClient, router]);

  return (
    <TwitterLayout>
      {profileUser && <div className="wrapper">
        <div className="actions flex gap-6 p-1 ">
          <Link href={'/'}>
            <div className="backarrow rounded-full h-9 w-9 hover:bg-slate-800 flex items-center justify-center cursor-pointer ">
              <IoMdArrowRoundBack className=" rounded-full " />
            </div>
          </Link>
          <div className="user flex flex-col ">
            <h4 className="text-xl font-extrabold tracking-wide">
              {profileUser.firstName + " " + profileUser.lastName}
            </h4>
            <span className="text-sm font-bold text-[#566779]">{`${profileUser.tweets?.length} tweets`}</span>
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
                src={profileUser?.profileImageURL as string}
                alt={profileUser?.firstName ? profileUser.firstName : "user"}
                width={1000}
                height={1000}
                className="h-full w-full rounded-full object-cover border-2 border-black bg-white"
              />
            </div>
          </div>

          <div className="infoOfUser  text-[15px] px-3">
            <div className="logoutWrapper h-8 p-1 flex justify-end items-start mb-5">
              {user?.id === profileUser.id ?
                <button
                  onClick={handleLogout}
                  key={"logout"} className="px-4 rounded-full border-[2px] py-[5px] border-[#536471] mt-1 hover:bg-gray-700 cursor-pointer transition-all duration-200 ease-in">
                  Logout
                </button> :
                (
                  amIFollowing ?
                    <button
                      key={"unfollow"}
                      disabled={isFollowBtnActive}
                      onClick={handleUnfollowUser}
                      className=" text-[#0F1419] bg-[#eff3f4] px-2 rounded-full border-[2px] py-[4px] mt-1 hover:scale-105 cursor-pointer transition-all duration-200 ease-in text-sm md:text-sm lg:text-base font-bold">
                      Unfollow
                    </button> :
                    <button
                      key={"follow"}
                      onClick={handleFollowUser}
                      disabled={isFollowBtnActive}
                      className=" text-[#0F1419] bg-[#eff3f4] px-2 rounded-full border-[2px] py-[4px] mt-1 hover:scale-105 cursor-pointer transition-all duration-200 ease-in text-sm md:text-sm lg:text-base font-bold">
                      Follow
                      <span>s</span>
                    </button>
                )
              }
            </div>
            <div className="usernameinfo md:mt-10 ">
              <h2 className=" font-extrabold max-w-[50%] overflow-hidden md:text-[20px]">
                {profileUser.firstName + " " + profileUser.lastName}
              </h2>
              <div className="followinfo text-[#8b98a7]  text-[13px] my-3">
                <span className="hover:bg-gray-700 cursor-pointer transition-all duration-200 ease-in  px-2 py-1 rounded-full following font-bold ">
                  <span className=" text-[#E7E9EA] font-extrabold mr-1">{profileUser.followings?.length}</span>{" "}
                  Following
                </span>
                <span className="hover:bg-gray-700 cursor-pointer transition-all duration-200 ease-in px-2 py-1 rounded-full followers ml-2 font-bold">
                  <span className=" text-[#E7E9EA] font-extrabold mr-1">{profileUser.followers?.length}</span>
                  Followers
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="feed">
          {
            profileUser.tweets?.map((tweet) => <FeedCard key={tweet?.id} data={tweet as Tweet} />)
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