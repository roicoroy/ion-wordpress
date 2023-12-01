import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PrivacyComponent } from 'src/app/components/privacy/privacy.component';
import { TermsOfServiceComponent } from 'src/app/components/terms-of-service/terms-of-service.component';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { PasswordValidator } from 'src/app/shared/form-validators/password.validator';
import { ModalController, MenuController } from '@ionic/angular/standalone';
import { ShowHidePasswordComponent } from 'src/app/components/show-hide-password/show-hide-password.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    RouterLinkActive,
    ShowHidePasswordComponent
  ]
})
export class RegisterPage implements OnInit {

  signupForm: FormGroup;
  matching_passwords_group: FormGroup;

  validation_messages = {
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Enter a valid email.' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 5 characters long.' }
    ],
    'confirm_password': [
      { type: 'required', message: 'Confirm password is required' }
    ],
    'matching_passwords': [
      { type: 'areNotEqual', message: 'Password mismatch' }
    ]
  };

  constructor(
    public router: Router,
    public modalController: ModalController,
    public menu: MenuController
  ) {
    this.matching_passwords_group = new FormGroup({
      'password': new FormControl('Password123!', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])),
      'confirm_password': new FormControl('Password123!', Validators.required)
    }, (formGroup: FormGroup | any) => {
      return PasswordValidator.areNotEqual(formGroup);
    });

    this.signupForm = new FormGroup({
      'email': new FormControl('test@email.com', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      'matching_passwords': this.matching_passwords_group
    });
  }

  ngOnInit(): void {
    this.menu.enable(false);
  }

  async showTermsModal() {
    const modal = await this.modalController.create({
      component: TermsOfServiceComponent
    });
    return await modal.present();
  }

  async showPrivacyModal() {
    const modal = await this.modalController.create({
      component: PrivacyComponent
    });
    return await modal.present();
  }

  doSignup(): void {
    console.log('do sign up');
    console.log(this.signupForm.value);
    // this.router.navigate(['app/categories']);
  }

}
