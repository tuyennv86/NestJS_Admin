import { Controller, Get, Param, Res } from '@nestjs/common';

@Controller()
export class AppController {
    @Get('/avatars/:year/:month/:fileId')
    async serveAvatar(@Param('fileId') fileId, @Param('year') year, @Param('month') month, @Res() res): Promise<any> {
        res.sendFile(fileId, { root: 'avatars/' + year + "/" + month });
    }
}
