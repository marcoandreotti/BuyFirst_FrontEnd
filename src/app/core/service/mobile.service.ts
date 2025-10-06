import { Injectable } from "@angular/core";

@Injectable()
export class MobileService {

    isMobile() {
        return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
    };
}