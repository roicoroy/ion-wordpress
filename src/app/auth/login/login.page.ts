import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { MenuController } from '@ionic/angular/standalone';
import { ShowHidePasswordComponent } from 'src/app/components/show-hide-password/show-hide-password.component';
import { Select, Store } from '@ngxs/store';
import { AuthState } from 'src/app/store/auth/auth.state';
import { LoginPayload } from 'src/app/shared/wooApi';
import { AuthActions } from 'src/app/store/auth/auth.actions';
import { Observable, Subject, takeUntil } from 'rxjs';
import { scaleHeight } from 'src/app/shared/animations/animations';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  animations: [
    scaleHeight()
  ],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    ShowHidePasswordComponent
  ],
})
export class LoginPage implements OnInit, OnDestroy {

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

  @Select(AuthState.getUser) user$!: Observable<any>;

  private menu = inject(MenuController);

  private store = inject(Store);

  private readonly ngUnsubscribe = new Subject();

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
    // const token = this.store.selectSnapshot((state: IStoreSnapshoModel) => state.auth.user.token);
    const loginPaylod: LoginPayload = {
      username: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };
    this.store.dispatch(new AuthActions.DoLogin(loginPaylod))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((vs) => {
        console.log(vs);
        // this.router.navigate(['/product-list']);
      });
  }

  goToForgotPassword(): void {
    console.log('redirect to forgot-password page');
    this.router.navigate(['/forgot-password']);
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }
}
