import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { PasswordValidator } from 'src/app/shared/form-validators/password.validator';
import { MenuController } from '@ionic/angular/standalone';
import { ShowHidePasswordComponent } from 'src/app/components/show-hide-password/show-hide-password.component';
import { RegisterWpUserPayload } from 'src/app/shared/wooApi';
import { Store } from '@ngxs/store';
import { Subject } from 'rxjs';
import { AuthActions } from 'src/app/store/auth/auth.actions';
import { ModalService } from 'src/app/shared/utils/modal.service';
import { AlertService } from 'src/app/shared/utils/alert.service';
import { AuthHeaderComponent } from 'src/app/components/auth-header/auth-header.component';
import { IAuthHeader } from '../interfaces';
import { KeypadModule } from 'src/app/shared/native/keyboard/keypad.module';
import { scaleHeight } from 'src/app/shared/animations/animations';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['../auth.styles.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    scaleHeight()
  ],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    ShowHidePasswordComponent,
    AuthHeaderComponent,
    KeypadModule
  ]
})
export class RegisterPage implements OnInit, OnDestroy {

  authHeader: IAuthHeader = {
    image: 'assets/shapes.svg',
    title: 'Register',
    subtitle: 'Join the club'
  }
  
  pageTitle = 'Register';

  signupForm: FormGroup;

  matching_passwords_group: FormGroup;

  validation_messages = {
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Enter a valid email.' }
    ],
    'username': [
      { type: 'required', message: 'Email is required.' },
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

  private store = inject(Store);

  private modalService = inject(ModalService);

  private menu = inject(MenuController);

  private alert = inject(AlertService);

  private readonly ngUnsubscribe = new Subject();

  constructor() {
    this.matching_passwords_group = new FormGroup({
      'password': new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])),
      'confirm_password': new FormControl('', Validators.required)
    }, (formGroup: FormGroup | any) => {
      return PasswordValidator.areNotEqual(formGroup);
    });

    this.signupForm = new FormGroup({
      'email': new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      'username': new FormControl('', Validators.compose([
        Validators.required
      ])),
      'matching_passwords': this.matching_passwords_group
    });
  }

  ngOnInit(): void {
    this.menu.enable(false);
  }

  doRegister(): void {
    const payload: RegisterWpUserPayload = {
      username: this.signupForm.value.username,
      email: this.signupForm.value.email,
      password: this.signupForm.value.matching_passwords.confirm_password,
    }
    this.store.dispatch(new AuthActions.Register(payload));
  }

  async showTermsModal() {
    await this.modalService.showPrivacyModal();
  }

  async showPrivacyModal() {
    await this.modalService.showPrivacyModal();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }
}
