import { Image } from "antd"
import { IoEyeOutline } from "react-icons/io5";

export const AntdImage = (props: any) => {

    return (
        <>
            <Image
                {...props}
                preview={{
                    ...props.preview,
                    mask: <span style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}><IoEyeOutline /></span>,
                }}
            />
        </>
    )
};