import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';

import { FFService } from 'src/app/services/ff.service';

export interface Promotion {
    href: string; 
    title: string; 
    desc: string;
    type: string; 
}

@Component({
    templateUrl: './promotions.component.html',
    styleUrls: ['./promotions.component.css'],
    providers: [NgbCarouselConfig] 
})

export class PromotionsComponent {

    
    //images = [700, 800, 807].map((n) => `https://picsum.photos/id/${n}/900/500`);
    images: string[] = [];

    promotion_two: Promotion = {"href":"https://loyaltyhubsin.santander.com.mx/media/images/show-image.jpg?idItem=3921&sizeImage=M&typeItem=promotion", "title": "Hot Sale - Liverpool", "desc": "EXPIRADA","type":"expired"} as Promotion


    constructor(private app: AppService, private http: HttpClient, private ff: FFService,config: NgbCarouselConfig) {
        config.interval = 5000;
        config.keyboard = true;
        config.pauseOnHover = true;
        
        ff.SetFlags('PromotionOne',"https://i.ibb.co/PWkVmvs/banner1.png");
        ff.SetFlags('PromotionTwo',"https://i.ibb.co/hfCBrLy/banner2.png");
        ff.SetFlags('PromotionThree',"https://i.ibb.co/WVYtbX3/banner3-1.png");
        ff.SetFlags('PromotionFour',"https://i.ibb.co/WPJhVVd/banner4.png");

        ff.SetFlags('PROMO_ONE',true);
        

        this.images.push(this.getStringFlagValue('PromotionOne'));
        this.images.push(this.getStringFlagValue('PromotionTwo'));
        this.images.push(this.getStringFlagValue('PromotionThree'));
        this.images.push(this.getStringFlagValue('PromotionFour'));

        // Enable promotion page using FF
        if (!this.ff.flagExists('Promotions')) {
            ff.SetFlags('Promotions',false);
        } 
        
        if (!this.ff.flagExists('Promotions_Banner')) {
            ff.SetFlags('Promotions_Banner',false);
        } 
        if (!this.ff.flagExists('test_json_123')) {
            ff.SetFlags('test_json_123','{"href":"https://loyaltyhubsin.santander.com.mx/media/images/show-image.jpg?idItem=3921&sizeImage=M&typeItem=promotion", "title": "Hot Sale - Liverpool", "desc": "EXPIRADA","type":"expired"}');
        } 

    }

    
  
    allowPromotions(): boolean {
      return Boolean(this.ff.GetFlags('Promotions'));
    }

    isPromoEnabled(promo:string){
        //console.log("promo enabled "+ this.ff.GetFlags(promo))
        return this.ff.GetFlags(promo);
    }

    getStringFlagValue(flag:string){
        return String(this.ff.GetFlags(flag));
    }

    promotionCreation(): boolean {

        let promotion = JSON.parse(this.ff.GetFlags('test_json_123')) as Promotion;
        //console.log("Diego")
        //console.log(JSON.stringify(promotion))
        if(typeof(promotion.href) !== "undefined"){
            this.promotion_two.href = promotion.href
        }
        if(typeof(promotion.title) !== "undefined"){
            this.promotion_two.title = promotion.title
        }
        if(typeof(promotion.desc) !== "undefined"){
            this.promotion_two.desc = promotion.desc
        }
        //console.log("Diego 2")
        //console.log(JSON.stringify(this.promotion_two))
        if(typeof(promotion.type) !== "undefined"){
            this.promotion_two.type = promotion.type
            if (promotion.type === 'active' || promotion.type === 'expired') {
                
                return true
            } else {
                //console.log("Diego false")
                return false
            }
        }
        
        return false
    }

    authenticated() { return this.app.authenticated; }

}