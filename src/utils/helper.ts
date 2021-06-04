import { existsSync, mkdirSync } from 'fs';

export class Helper {

    static customFileName(req, file, cb) {
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);

        const uniqueSuffix = Date.now();
        let fileExtension = "";
        if (file.mimetype.indexOf("jpeg") > -1) {
            fileExtension = "jpg"
        } else if (file.mimetype.indexOf("png") > -1) {
            fileExtension = "png";
        }
        else if (file.mimetype.indexOf("gif") > -1) {
            fileExtension = "gif";
        }
        const originalName = file.originalname.split(".")[0];
        cb(null, originalName + '-' + uniqueSuffix + "." + fileExtension);
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