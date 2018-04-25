import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { UserServiceProvider } from '../providers/user-service/user-service';
import { IonicStorageModule  } from '@ionic/storage';
import { RewardServiceProvider } from '../providers/reward-service/reward-service';
import { RewardModalPageModule } from '../pages/reward-modal/reward-modal.module';
import { FCM } from '@ionic-native/fcm';

export const firebaseConfig = {
  apiKey: "AIzaSyAU11-01ozIm8QVTv6AMx0u_wr6EJOVCYI",
    authDomain: "wirebrain-2aa5f.firebaseapp.com",
    databaseURL: "https://wirebrain-2aa5f.firebaseio.com",
    projectId: "wirebrain-2aa5f",
    storageBucket: "wirebrain-2aa5f.appspot.com",
    messagingSenderId: "958204364963"
};


@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    IonicStorageModule.forRoot(),
    RewardModalPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UserServiceProvider,
    RewardServiceProvider,
    FCM
  ]
})
export class AppModule {}
