import "./Main.css"
import ContactSearchBar from "./ContactSearchBar"
import ContactSearchContact from "./ContactSearchContact"

const ContactSearchParent = () => {



  return (
    <>
      <div className="ContactSearchParent">
        <ContactSearchBar />
        <div className="contactSearchContacts">
          <ContactSearchContact />
        </div>
      </div>
    </>
  )
}

export default ContactSearchParent