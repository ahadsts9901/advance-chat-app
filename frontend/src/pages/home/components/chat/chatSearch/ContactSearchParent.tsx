import "./Main.css"
import ContactSearchBar from "./ContactSearchBar"
import ContactSearchContact from "./ContactSearchContact"
import { useEffect, useState } from "react"
import axios from "axios"
import { baseUrl } from "../../../../../core"
import { groupUsersByLetter } from "../../../../../utils/functions"
import React from "react"

export const Letter = ({ letter }: any) => {
  return (
    <>
      <h2 className="letter">{letter?.toUpperCase()}</h2>
    </>
  )
}

const ContactSearchParent = ({ setShowChatSearch }: any) => {

  const [users, setUsers] = useState<any[]>([])
  const [filteredUsers, setFilteredUsers] = useState<any>(null)

  useEffect(() => {
    getAllUsers()
  }, [])

  useEffect(() => {
    setFilteredUsers(groupUsersByLetter(users))
  }, [users])

  const getAllUsers = async () => {
    try {
      const resp = await axios.get(`${baseUrl}/api/v1/users`, { withCredentials: true })
      setUsers(resp?.data?.data)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <div className="ContactSearchParent">
        <ContactSearchBar
          setShowChatSearch={setShowChatSearch}
          users={users}
          setFilteredUsers={setFilteredUsers}
        />
        <div className="contactSearchContacts">
          {filteredUsers &&
            Object.keys(filteredUsers).map((letter: string, i: number) => (
              <React.Fragment key={i}>
                <Letter letter={letter} />
                {filteredUsers[letter].map((user: any, i: number) => (
                  <ContactSearchContact key={i} data={user} />
                ))}
              </React.Fragment>
            ))}
        </div>
      </div>
    </>
  )
}

export default ContactSearchParent