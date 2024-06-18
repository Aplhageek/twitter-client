import React, { useCallback, useState } from "react";
import FeedCard from "@/Components/Layout/FeedCard/FeedCard";
import { CiImageOn } from "react-icons/ci";
import { useCurrentUser } from "@/hooks/user";
import Image from "next/image";
import { useCreateTweet, useGetAllTweets } from "@/hooks/tweets";
import { Tweet } from "@/gql/graphql";
import TwitterLayout from "@/Components/Layout/TwitterLayout/TwitterLayout";

// TODO: Refactor the code and split into components

export default function Home() {
  const [content, setContent] = useState("");

  const { user } = useCurrentUser();
  const { tweets = [] } = useGetAllTweets();  //to have initial value for tweets
  const { mutate } = useCreateTweet();


  const handleCreateTweet = useCallback((content: string) => {
    // FIXME: Add validation to ensure the consistent behavior
    mutate({ content });
    setContent("");
  }, [mutate]);


  const handleInputImageForPost = useCallback(() => {
    // create a new input eleemnt
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click(); //this allows to open the input modal
  },
    [],
  )


  // TODO: Add feAT to make user public private and render feed accordingly
 

  return (
    <div>
      <TwitterLayout>
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
              value={content}
              onChange={e => setContent(e.target.value)}
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

              <button
                onClick={() => handleCreateTweet(content)}
                className=" bg-[#1d9bf0] text-sm px-4 py-2 font-semibold rounded-full  hover:bg-sky-600  transition-all duration-300">
                Post
              </button>
            </div>
          </div>

        </div>
      )}

      {/* tweets */}
      {
        tweets?.map((tweet) => < FeedCard key={tweet?.id} data={tweet as Tweet} />)
      }

      </TwitterLayout>
    </div>
  );
}
