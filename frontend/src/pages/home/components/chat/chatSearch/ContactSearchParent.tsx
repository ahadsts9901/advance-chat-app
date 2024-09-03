import "./Main.css"
import ContactSearchBar from "./ContactSearchBar"
import ContactSearchContact from "./ContactSearchContact"

const ContactSearchParent = ({ setShowChatSearch }: any) => {



  return (
    <>
      <div className="ContactSearchParent">
        <ContactSearchBar setShowChatSearch={setShowChatSearch} />
        <div className="contactSearchContacts">
          <ContactSearchContact />
        </div>
      </div>
    </>
  )
}

export default ContactSearchParent