import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { UserServiceProvider } from '../../providers/user-service/user-service';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  regPage: any;
  login = {
    email: '',
    password: ''
  };

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private userService: UserServiceProvider) {
    this.regPage = "RegisterPage";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  signOn() {
    if (!this.login || !this.login.password) {
      this.userService.displayAlert('Error!', "You must enter email and password");
    }
    else {
      this.userService.logOn(this.login.email, this.login.password)
         .then (returned => {
           if (this.userService.success) {
             this.navCtrl.push(HomePage);
           }
           else {
             this.login.email = '';
             this.login.password = '';
           }
         })
    }
  }
}
