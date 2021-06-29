import { existsSync, mkdirSync } from 'fs';
import { extname } from 'path';

export class Helper {

    static customFileName(req, file, cb) {
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);

        const uniqueSuffix = Date.now();
        const fileExtension = extname(file.originalname);
        const originalName = file.originalname.split(".")[0];
        cb(null, originalName + '-' + uniqueSuffix + fileExtension);

    }

    static destinationPath(req, file, cb) {
        const now = new Date();
        const uploadPath = "./avatars/";
        const uploadPath1 = "./avatars/" + now.getFullYear();
        const uploadPath2 = uploadPath1 + "/" + now.getMonth();
        if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath);
        }
        if (!existsSync(uploadPath1)) {
            mkdirSync(uploadPath1);
        }
        if (!existsSync(uploadPath2)) {
            mkdirSync(uploadPath2);
        }
        cb(null, uploadPath2)
    }
}