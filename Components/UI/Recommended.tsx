import { User } from '@/gql/graphql';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

interface RecommendedCardProps {
    user: User;
}


const Recommended : React.FC<RecommendedCardProps> = ({ user }) => {
  return (
    <div className="my-1 py-1 w-full rounded-full flex justify-between items-center px-2 hover:bg-gray-700 transition-all duration-200 ">
            <div className="profile flex gap-3 py-1">
                {user.profileImageURL && <Image src={user.profileImageURL} alt='user' width={5000} height={5000} className='rounded-full cursor-pointer hover:scale-95 transition-all duration-500 min-w-[40px] max-w-[40px]' />}
                <div className="name text-sm">
                    <h2>{user.firstName}</h2>
                    <h2>{user.lastName}</h2>
                </div>
            </div>


            <Link href={`/${user.id}`} className=' mx-1 px-2 text-center bg-slate-100 text-black text-sm font-bold rounded-full py-1 w-16 cursor-pointer'>
                View
            </Link>
        </div>
  )
}

export default Recommended;