import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { MenuController } from '@ionic/angular/standalone';
import { ShowHidePasswordComponent } from 'src/app/components/show-hide-password/show-hide-password.component';
import { Store } from '@ngxs/store';
import { LoginPayload } from 'src/app/shared/wooApi';
import { AuthActions } from 'src/app/store/auth/auth.actions';
import { Observable, Subject } from 'rxjs';
import { scaleHeight } from 'src/app/shared/animations/animations';
import { AuthFacade, ILoginFacadeState } from '../auth.facade';
import { ModalService } from 'src/app/shared/utils/modal.service';
import { AuthHeaderComponent } from 'src/app/components/auth-header/auth-header.component';
import { IAuthHeader } from '../interfaces';
import { KeypadModule } from 'src/app/shared/native/keyboard/keypad.module';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
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
  ],
})
export class LoginPage implements OnInit, OnDestroy {

  authHeader: IAuthHeader = {
    image: 'assets/shapes.svg',
    title: 'Welcome',
    subtitle: 'Login to start'
  }

  pageTitle = 'Login';

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

  viewState$: Observable<ILoginFacadeState>;

  private facade = inject(AuthFacade);

  private modalService = inject(ModalService);

  private menu = inject(MenuController);

  private store = inject(Store);

  private router = inject(Router);

  private readonly ngUnsubscribe = new Subject();

  constructor() {
    this.viewState$ = this.facade.viewState$;

    this.loginForm = new FormGroup({
      'email': new FormControl('yumi@email.com', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      'password': new FormControl('Rwbento123!!', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ]))
    });
  }

  ngOnInit(): void {
    this.menu.enable(false);
  }

  doLogin(): void {
    const loginPaylod: LoginPayload = {
      username: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };
    this.store.dispatch(new AuthActions.Login(loginPaylod));
  }

  async showTermsModal() {
    await this.modalService.showPrivacyModal();
  }

  async showPrivacyModal() {
    await this.modalService.showPrivacyModal();
  }

  goToForgotPassword(): void {
    this.router.navigate(['/forgot-password']);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }
}
