import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CartServiceProvider } from '../../providers/cart-service/cart-service';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { HomePage } from '../home/home';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal';

/**
 * Generated class for the CheckoutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-checkout',
  templateUrl: 'checkout.html',
})
export class CheckoutPage implements OnInit {

  order: any[];
  orderTotal: number;
  customer: any;

  rewardsDisplay: boolean;
  discountUsed: boolean = false;
  rewardsList: any[] = [];
  discount: any;
  discountAmount: number = 0;
  discountTotal: number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams,
             private payPal: PayPal,
             private cartSvc: CartServiceProvider, private userSvc: UserServiceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CheckoutPage');
  }

  ngOnInit() {
    
    this.cartSvc.getCart()
       .then(theCart => this.order = theCart)
       .then(cart => this.sumTotal(cart))
       .then(sum => this.orderTotal = sum)
       .then(cash => this.userSvc.returnUser())
       .then(cust => this.loadRewards(cust));
  }

  sumTotal(order) {
    return Promise.resolve(order.reduce((total: number, item:any) => total + item.price, 0));
  }

  removeOne(itemId, itemPrice) {
    if (this.discountTotal != 0) {
      let tmpTotal = this.discountTotal - itemPrice;
      if (tmpTotal <= 0) {
        this.userSvc.displayAlert('Unable to apply', 'You cannot apply rewards that create a credit');
        this.removeReward();
      }
      else {
        this.cartSvc.removeItem(itemId, itemPrice);
        this.sumTotal(this.order)
           .then(sum => this.orderTotal = sum)
           .then(dis => this.discountTotal = dis - this.discount.amount);
      }
    }
    else {
      this.cartSvc.removeItem(itemId, itemPrice);
      this.sumTotal(this.order)
        .then(sum => this.orderTotal = sum);      
    }
  }

  addRewards() {
    this.rewardsDisplay = (this.rewardsDisplay) ? false : true;
  }

  loadRewards(user) {
    this.userSvc.storageControl('get', `${user}-rewards`)
       .then(returned => {
         this.customer = user;

         if (!returned) {
           let tmpObj = { rewardId: 'No rewards generated', amount: 0};
           this.rewardsList.push(tmpObj);
         }
         else {
           this.rewardsList = returned;
           console.log(this.rewardsList);
         }
       })
  }
  applyReward(reward) {
    let tmpAmount = this.orderTotal - reward.amount;

    if (tmpAmount <= 0) {
      this.userSvc.displayAlert('Unable to apply', 'You cannot apply rewards that create a credit');
    }
    else {
      this.discount = reward;
      this.discountAmount = reward.amount;
      this.discountTotal = this.orderTotal - reward.amount;
      this.discountUsed = true;
    }
  }

  removeReward() {
    this.discountUsed = false;
    this.discount = '';
  }

  purchase() {
    if (this.discountUsed) {
      let tmpId = this.discount.rewardId;
      let tmp = this.rewardsList.map(x => x.rewardId).indexOf(tmpId);
      if (tmp > -1) {
        this.rewardsList.splice(tmp, 1);
      } 
      this.userSvc.storageControl('set', `${this.customer}-rewards`)
        .then(results => console.log('Saved:', results));
      this.payCart(this.discountTotal);
      this.cartSvc.emptyCart();
      this.userSvc.displayAlert('Thank you', `Your order for ${this.discountTotal} has been paid`);
      this.navCtrl.push(HomePage);
    }
    else {
      this.payCart(this.orderTotal);
      this.cartSvc.emptyCart();
      this.userSvc.displayAlert('Thank you', `Your order for ${this.orderTotal} has been paid`);
      this.navCtrl.push(HomePage);
    }
  }
  payCart(amt) {
    this.payPal.init({
      PayPalEnvironmentProduction: '',
      PayPalEnvironmentSandbox: 'EA-vRT8FFGFnGdzRBQmQQHCva3fAir0rQQyOnMZIsKk2xPzS6hyOdf6cHqxspH6Sy1JLytYdplJPAPQW'      
    }).then(() => {
      this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({        
      })).then(() => {
        let payment = new PayPalPayment(amt, 'USD', 'Description', 'sale');
        this.payPal.renderSinglePaymentUI(payment).then((res) => {
          console.log('Result from Paypal', res);
        }, (err) => {
          console.log('Error: ', err) 
        });
      },(conf) => {
        console.log('Configuration Error: ', conf)
      });
    }, (init) => {
      console.log('Init Error: ', init)
    });
  }
}
