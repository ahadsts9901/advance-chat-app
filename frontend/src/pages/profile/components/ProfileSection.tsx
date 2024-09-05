import "./Main.css"

const ProfileSection = ({ user }: any) => {
    return (
        <>
            <div className="profileSection">{JSON.stringify(user)}</div>
        </>
    )
}

export default ProfileSection