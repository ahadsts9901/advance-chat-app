import Chats from "./components/Chats"
import Conversation from "./components/Conversation"
import "./Home.css"

const Home = () => {
  return (
    <>
      <div className="homePageBar">
        <Chats />
        <Conversation />
      </div>
    </>
  )
}

export default Home