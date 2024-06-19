import React, { use } from 'react'
import Image from 'next/image'
import { FaRegComment, FaRetweet } from 'react-icons/fa6'
import { IoIosHeartEmpty } from 'react-icons/io'
import { RxUpload } from 'react-icons/rx'
import { Tweet } from '@/gql/graphql'
import Link from 'next/link'
import { Url } from 'next/dist/shared/lib/router/router'

interface FeedCardProps {
  data: Tweet  //codegen creates this type
  // key : string | undefined 
}

const FeedCard: React.FC<FeedCardProps> = ({ data }) => {
  return (
    <div className='grid grid-cols-12 border-t border-slate-700 px-5 py-4 pb-1 hover:bg-[#101010] transition-all duration-200'>
      <div className="col-span-1">
        {data.user?.profileImageURL &&
          <Image
            className='rounded-full cursor-pointer hover:scale-95 transition-all duration-500 '
            src={data.user.profileImageURL}
            alt={data.user.firstName || "user"}
            width={45}
            height={45}
          />}
      </div>

      <div className="col-span-11 px-2 ">

        <h6 className=' text-sm font-bold mb-1 '>
          <Link href={data.user?.id as Url}>
            {data.user?.firstName} {data.user?.lastName}
          </Link>
        </h6>

        <p className=' font-light  text-sm overflow-hidden text-wrap'>
          {data.content}
        </p>

        <div className="action-btns mt-3">
          <div className='  flex justify-between my-1  w-[90%] text-lg'  >
            <div className='cursor-pointer rounded-full p-2 hover:bg-[#0A171F] hover:text-[#1D9BF0] transition-all duration-150'>
              <FaRegComment />
            </div>
            <div className='cursor-pointer rounded-full p-2 hover:bg-[#071A14] hover:text-[#00BA7C] transition-all duration-150 '>
              <FaRetweet />
            </div>
            <div className='cursor-pointer rounded-full p-2 hover:bg-[#200914] hover:text-[#F91880] transition-all duration-150 '>
              <IoIosHeartEmpty />
            </div>
            <div className='cursor-pointer rounded-full p-2 hover:bg-[#0A171F] hover:text-[#1D9BF0] transition-all duration-150 '>
              <RxUpload />
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default FeedCard