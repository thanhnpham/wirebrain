import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Alert } from 'ionic-angular';
import { HomePage } from '../home/home';
import { AngularFireAuth  } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { UserServiceProvider } from '../../providers/user-service/user-service';
/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  reg = {
    email: '',
    password1: '',
    password2: '',
  }
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public alertCtrl: AlertController, private afAuth: AngularFireAuth,
              private userService: UserServiceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  displayAlert(alertTitle, alertSub) {
    let theAlert = this.alertCtrl.create({
      title: alertTitle,
      subTitle: alertSub,
      buttons: ['OK']
    });
    theAlert.present();
  }

  registerAccount() {
    if (this.reg.password1 != this.reg.password2) {
      this.displayAlert('Password Problems!', 'Passwords do not match, please try again.');
      this.reg.password1 = '';
      this.reg.password2 = '';
    }
    else {
      this.afAuth.auth.createUserWithEmailAndPassword(this.reg.email, this.reg.password1)
        .then(res => this.regSuccess(res))
        .catch(err => this.displayAlert('Error!', err));
    }
  }

  regSuccess(result) {
//    this.displayAlert(result.email, 'Account created for this email address');   
//    this.afAuth.auth.signInWithEmailAndPassword(this.reg.email, this.reg.password1)
//       .then(res => this.navCtrl.push(HomePage))
//       .catch(err => this.displayAlert('Error!', err));
    this.userService.logOn(this.reg.email, this.reg.password1)
      .then(res => this.navCtrl.push(HomePage));      
  }
}
