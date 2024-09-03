import "./main.css"
import Chats from "./components/Chats"
import Conversation from "./components/Conversation"
import { useParams } from "react-router-dom"
import axios from "axios"
import { baseUrl } from "../../core"
import { useState } from "react"

const Home = () => {

  const { userId } = useParams()

  const [contacts, setContacts] = useState<any[]>([])
  const [filteredContacts, setFilteredContacts] = useState([]);

  const getContacts = async () => {

    try {

      const resp = await axios.get(`${baseUrl}/api/v1/contacts`, { withCredentials: true })
      setContacts(resp?.data?.data)
      setFilteredContacts(resp?.data?.data)

    } catch (error) {
      console.error(error)
    }

  }

  return (
    <>
      <div className="homeCont">
        <Chats userId={userId} contacts={contacts} getContacts={getContacts} setContacts={setContacts} filteredContacts={filteredContacts} setFilteredContacts={setFilteredContacts} />
        <Conversation userId={userId} getContacts={getContacts} setFilteredContacts={setFilteredContacts} />
      </div>
    </>
  )
}

export default Home