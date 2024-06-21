import React, { useCallback, useState } from "react";
import FeedCard from "@/Components/Layout/FeedCard/FeedCard";
import { CiImageOn } from "react-icons/ci";
import { useCurrentUser } from "@/hooks/user";
import Image from "next/image";
import { useCreateTweet, useGetAllTweets } from "@/hooks/tweets";
import { Tweet } from "@/gql/graphql";
import TwitterLayout from "@/Components/Layout/TwitterLayout/TwitterLayout";
import { IoCloseCircle } from "react-icons/io5";
import toast from "react-hot-toast";
import { graphQLClient } from "@/clients/api";
import axios from "axios";

// TODO: Refactor the code and split into components


export default function Home() {
  const [content, setContent] = useState("");
  const [tweetImageURL, setTweetImageURL] = useState<string | null>(null);
  const [s3ImageURL, setS3ImageURL] = useState<string | null>(null);

  const { user } = useCurrentUser();
  const { tweets = [] } = useGetAllTweets();  //to have initial value for tweets
  const { mutate } = useCreateTweet();


  const handleCreateTweet = useCallback((content: string) => {
    // FIXME: Add validation to ensure the consistent behavior
    mutate({ content});
    setContent("");
  }, [mutate]);

  /**
   * - 1. generate file url on client
   * - 2. request the presigned URL
   * - 3. upload the image
   * - 4. uplaod the tweet 
   */
  const handleFileChange = useCallback((input: HTMLInputElement) => {
    return async (event: Event) => {
      if (input.files?.length) {
        const currFile = input.files[0];
        const imageType = currFile.type.split("/")[1];
        const link = URL.createObjectURL(currFile);
        setTweetImageURL(link);

        // const { getSignedURLForTweetImage: signedURL } = await graphQLClient.request(getSignedURLForTweetsQuery, { imageName: currFile.name, imageType });

        // if (signedURL) {
        //   try {
        //     toast.loading("Uploading image...", { id: "1" });
        //     const something = await axios.put(signedURL, currFile, { headers: { "Content-Type": currFile.type } });
        //     toast.success("Image uploaded...", { id: "1" });
        //     const url = new URL(signedURL);
        //     const s3ImagePath = `${url.origin}${url.pathname}`
        //     setS3ImageURL(s3ImagePath);
        //   } catch (error) {
        //     toast.error("Error uploading image");
        //   }
        // }

      } else {
        toast.error("Image upload failed!");
      }
    }
  }, [])


  const handleInputImageForPost = useCallback(() => {
    // Create a new input element
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/png, image/jpeg, image/jpg , image/webp");

    const handlerFn = handleFileChange(input);

    input.addEventListener('change', handlerFn);
    input.click(); // This allows to open the input modal
  }, [handleFileChange]);



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
              <div className="inputImage pr-4 mb-8 ">
                {tweetImageURL &&
                  <Image src={tweetImageURL} alt="img" height={100} width={100} className="w-full" />
                }
              </div>

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
