import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet, MenuController, IonButton } from '@ionic/angular/standalone';
import { ShowHidePasswordComponent } from 'src/app/components/show-hide-password/show-hide-password.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonRouterOutlet,
    RouterLink,
    RouterLinkActive,
    ShowHidePasswordComponent
  ],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;

  validation_messages = {
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Enter a valid email.' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 5 characters long.' }
    ]
  };

  private menu = inject(MenuController);

  constructor(
    public router: Router,
  ) {
    this.loginForm = new FormGroup({
      'email': new FormControl('yumi@email.com', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      'password': new FormControl('Rwbento123!', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ]))
    });
  }

  ngOnInit(): void {
    this.menu.enable(false);
  }

  doLogin(): void {
    console.log('do Log In');
    this.router.navigate(['/product-lis']);
  }

  goToForgotPassword(): void {
    console.log('redirect to forgot-password page');
  }

  doFacebookLogin(): void {
    console.log('facebook login');
    // this.router.navigate(['app/categories']);
  }

  doGoogleLogin(): void {
    console.log('google login');
    // this.router.navigate(['app/categories']);
  }

  doTwitterLogin(): void {
    console.log('twitter login');
    // this.router.navigate(['app/categories']);
  }

}
