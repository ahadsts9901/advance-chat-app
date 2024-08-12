import "./main.css"
import Chats from "./components/Chats"
import Conversation from "./components/Conversation"
import { useParams } from "react-router-dom"

const Home = () => {

  const { userId } = useParams()

  return (
    <>
      <div className="homeCont">
        <Chats userId={userId} />
        <Conversation userId={userId} />
      </div>
    </>
  )
}

export default Home