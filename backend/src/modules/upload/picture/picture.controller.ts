import { Controller, Post, Body } from "@nestjs/common";
import { PictureService } from "./picture.service";


@Controller("picture")
export class PictureController {
    constructor(private readonly pictureService: PictureService){}

    @Post("")
    uploadPicture(@Body("data") data: string){
        
        return this.pictureService.uploadPicture(data);
    }
}