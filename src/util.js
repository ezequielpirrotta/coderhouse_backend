import {fileURLToPath} from 'url';
import path, { dirname } from 'path';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename).split(path.sep).join(path.posix.sep);

const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null, __dirname+'/public/img');
    },
    filename: (req,file,cb) => {
        cb(null, file.originalname)
    }
})
export const uploader = multer({storage})
export default __dirname;