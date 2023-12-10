import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable, Subject, catchError, takeUntil } from 'rxjs';
import { RetrievePasswordPayload } from 'src/app/shared/wooApi';
import { AuthActions } from 'src/app/store/auth/auth.actions';
import { ErrorLoggingActions } from 'src/app/store/errors-logging/errors-logging.actions';
import { IStoreSnapshoModel } from 'src/app/store/store.snapshot.interface';
import { AlertService } from 'src/app/shared/utils/alert.service';
import { ModalService } from 'src/app/shared/utils/modal.service';
import { AuthHeaderComponent } from 'src/app/components/auth-header/auth-header.component';
import { IAuthHeader } from '../interfaces';
import { KeypadModule } from 'src/app/shared/native/keyboard/keypad.module';
import { scaleHeight } from 'src/app/shared/animations/animations';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
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
    ReactiveFormsModule,
    AuthHeaderComponent,
    KeypadModule
  ]
})
export class ForgotPasswordPage implements OnInit, OnDestroy {
  
  authHeader: IAuthHeader = {
    image: 'assets/shapes.svg',
    title: 'Forgot password?',
    subtitle: 'Add your username and we will email the reset link to you.'
  }
  pageTitle = 'Forgot Password';

  forgotPasswordForm!: FormGroup;

  validation_messages = {
    'username': [
      { type: 'required', message: 'Email is required.' },
    ],
  };

  private store = inject(Store);

  private alert = inject(AlertService);

  private modalService = inject(ModalService);

  private readonly ngUnsubscribe = new Subject();

  constructor() {
    this.forgotPasswordForm = new FormGroup({
      'username': new FormControl('', Validators.compose([
        Validators.required,
      ])),
    });
  }

  ngOnInit() {
  }

  retrievePassword(): void {
    const retrievePassPayload: RetrievePasswordPayload = {
      username: this.forgotPasswordForm.value.username,
    };
    this.store.dispatch(new AuthActions.RetrievePassword(retrievePassPayload))
      .pipe(
        takeUntil(this.ngUnsubscribe),
        catchError(e => {
          this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(e));
          return new Observable(obs => obs.error(e));
        })
      )
      .subscribe(async(vs: IStoreSnapshoModel) => {
        
        console.log(vs.auth);
        
        if (vs.auth.retrievePasswordResponseCode === 200) {
          await this.alert.presentSimpleAlertNavigate(vs.auth.retrievePasswordResponseMessage, 'login');
        }
      });
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
