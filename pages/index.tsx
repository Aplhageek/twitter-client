import React, { useCallback, useRef, useState } from "react";
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
import { GetServerSideProps } from "next";
import { graphql } from "@/gql";
import { getAllTweetsQuery, getSignedURLForTweetQuery } from "@/graphql/queries/tweets";

// TODO: Refactor the code and split into components

interface HomeProps {
  tweets: Tweet[];
}

interface InputFileRef {
  currFile: File
  imageType: string,
}

const Home: React.FC<HomeProps> = (props) => {

  const [content, setContent] = useState("");
  const [localTweetImagURL, setLocalTweetImageURL] = useState<string | null>(null);

  const signedURLRef = useRef<string | null>(null);
  const inputFileRef = useRef<InputFileRef | null>();


  const { user } = useCurrentUser();
  const { tweets = [] } = useGetAllTweets();  //to have initial value for tweets
  const { mutate } = useCreateTweet();

  const uploadImageToS3 = useCallback(async (mySignedURL: string | null, file: InputFileRef | null | undefined) => {
    if (mySignedURL && file) {
      try {
        toast.loading("Uploading image...", { id: "1" });
        const something = await axios.put(mySignedURL, file.currFile, { headers: { "Content-Type": file.imageType } });
        toast.success("Image uploaded...", { id: "1" });
        const url = new URL(mySignedURL);
        const s3ImagePath = `${url.origin}${url.pathname}`
        return s3ImagePath;
      } catch (error) {
        return null;
      }
    }
    else {
      return null;
    }
  }, []);

  const handleCreateTweet = useCallback(async (content: string) => {
    // // FIXME: Add validation to ensure the consistent behavior
    let s3ImagePath = null;

    if (localTweetImagURL) {
      if (inputFileRef.current) {
        s3ImagePath = await uploadImageToS3(signedURLRef.current, inputFileRef.current);
      }
      if (!s3ImagePath) {
        toast.error("Error uploading image 😭");
        return;
      }
    }

    mutate({ content, imageURL: s3ImagePath });

    setContent("");
    setLocalTweetImageURL(null);
  }, [localTweetImagURL, mutate, uploadImageToS3]);

  /**
   * - 1. generate file url on client
   * - 2. request the presigned URL
   * - 3. upload the image
   * - 4. uplaod the tweet 
   */
  const handleFileChange = useCallback((input: HTMLInputElement) => {
    return async (event: Event) => {
      if (input.files?.length) {
        // part 1:
        const currFile = input.files[0];
        const imageType = currFile.type.split("/")[1];
        const link = URL.createObjectURL(currFile);
        setLocalTweetImageURL(link);
        inputFileRef.current = {
          currFile,
          imageType,
        };

        // Step 2: get signed url if success then only go ahead
        try {
          toast.loading("Getting it ready...", { id: "1000" });
          const { getSignedURLForTweet: mySignedURL } = await graphQLClient.request(getSignedURLForTweetQuery, { imageName: currFile.name, imageType });

          if (!mySignedURL) {
            toast.error("couldn't get signed url", { id: "1000" });
            return;
          } else {
            toast.success("Ready to upload!", { id: "1000" });
            signedURLRef.current = mySignedURL;
          }
        } catch (error) {
          toast.error("couldn't get signed url", { id: "signedURL" });
          return;
        }
      } else {
        toast.error("Image upload failed!");
      }
    }
  }, []);




  const handleInputImageForPost = useCallback(() => {
    // Create a new input element
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/png, image/jpeg, image/jpg , image/webp");

    const handlerFn = handleFileChange(input);

    input.addEventListener('change', handlerFn);
    input.click(); // This allows to open the input modal
  }, [handleFileChange]);


  const handleCancelImage = useCallback((event: React.MouseEvent<SVGElement, MouseEvent>) => {
    setLocalTweetImageURL(null);
    signedURLRef.current = null;
    inputFileRef.current = null;
  },[]);


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
                width={1000}
                height={1000}
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
              <div className="inputImage pr-4 mb-8 relative ">
                {localTweetImagURL &&
                  <>
                    <Image src={localTweetImagURL} alt='img' width={1000} height={1000} className='w-full' />
                    <IoCloseCircle onClick={handleCancelImage} className="text-xl absolute z-10 -top-3 right-1 cursor-pointer hover:text-red-400 transition-all duration-500 ease-out" />
                  </>
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
          props.tweets?.map((tweet) => < FeedCard key={tweet?.id} data={tweet as Tweet} />)
        }

      </TwitterLayout>
    </div>
  );
}


export const getServerSideProps: GetServerSideProps<HomeProps> = async (context) => {
  const allTweets = await graphQLClient.request(getAllTweetsQuery);

  return {
    props: {
      tweets: allTweets?.getAllTweets as Tweet[],
    }
  }
}


export default Home;
