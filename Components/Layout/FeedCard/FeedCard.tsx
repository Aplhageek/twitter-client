import React from 'react'
import Image from 'next/image'
import { FaRegComment, FaRetweet } from 'react-icons/fa6'
import { IoIosHeartEmpty } from 'react-icons/io'
import { GoComment } from 'react-icons/go'
import { RxUpload } from 'react-icons/rx'

const FeedCard: React.FC = () => {
  return (
    <div className='grid grid-cols-12 border-t border-slate-700 px-5 py-3 cursor-pointer hover:bg-[#101010] transition-all duration-200'>
      <div className="col-span-1">
        <Image
          className='rounded-full cursor-pointer hover:scale-95 transition-all duration-500 '
          src="https://img.freepik.com/free-photo/view-3d-man-holding-laptop_23-2150709818.jpg?size=626&ext=jpg&uid=R149756877&ga=GA1.1.1024359103.1716312737&semt=sph"
          alt='user'
          width={50}
          height={50}
        />
      </div>
      <div className="col-span-11 px-2 ">
        <h6 className=' text-sm font-bold mb-1 '>Jayesh Ahirrao</h6>
        <p className=' font-light  text-sm'>
          Their words and their promise is for everyone to hear.

          They want to deny rights to SC, ST and OBC communities, preferring UNCONSTITUTIONAL Muslim reservation instead.

          Modi will not let them trample over Pujya Babasaheb’s Constitution.
        </p>
        <div className='  flex justify-between my-1  w-[90%] text-lg'  >
          <div className='rounded-full p-2 hover:bg-[#0A171F] hover:text-[#1D9BF0] transition-all duration-150'>
            <FaRegComment />
          </div>
          <div className='rounded-full p-2 hover:bg-[#071A14] hover:text-[#00BA7C] transition-all duration-150 '>
            <FaRetweet />
          </div>
          <div className='rounded-full p-2 hover:bg-[#200914] hover:text-[#F91880] transition-all duration-150 '>
            <IoIosHeartEmpty />
          </div>
          <div className='rounded-full p-2 hover:bg-[#0A171F] hover:text-[#1D9BF0] transition-all duration-150 '>
            <RxUpload />
          </div>
        </div>
      </div>

    </div>
  )
}

export default FeedCard