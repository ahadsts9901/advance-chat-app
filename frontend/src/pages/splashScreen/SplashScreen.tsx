import "./SplashScreen.css"
import whatsappAnimation from "../../../public/whatsapp.gif"
import GoogleLoginButton from "../../components/GoogleLoginButton"

const SplashScreen = ({ showLoginButton }: any) => {
  return (
    <>
      <div className="splashCont">
        <img src={whatsappAnimation} alt="logo" />
        {showLoginButton ? <GoogleLoginButton /> : null}
      </div>
    </>
  )
}

export default SplashScreen