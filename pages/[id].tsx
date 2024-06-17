// this is dynamic page 
import TwitterLayout from "@/Components/Layout/TwitterLayout/TwitterLayout";
import type {NextPage} from "next"

const UserProfilePage : NextPage = () => {

  return (
    <TwitterLayout>
      <div className="">ProfilePage</div>
    </TwitterLayout>
  )
}

export default UserProfilePage;
// its a react component only but of type NextPage