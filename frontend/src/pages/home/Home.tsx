import "./main.css"
import Chats from "./components/Chats"
import Conversation from "./components/Conversation"

const Home = () => {
  return (
    <>
      <div className="homeCont">
        <Chats />
        <Conversation />
      </div>
    </>
  )
}

export default Home