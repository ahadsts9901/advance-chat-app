import multer, { diskStorage } from "multer"

const storageConfig = diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => { cb(null, `file-${new Date().getTime()}-${file?.originalname}`) }
})

export const upload = multer({ storage: storageConfig })