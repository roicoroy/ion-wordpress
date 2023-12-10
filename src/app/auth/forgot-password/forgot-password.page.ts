import { Component, OnDestroy, OnInit, inject } from '@angular/core';
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

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    ReactiveFormsModule
  ]
})
export class ForgotPasswordPage implements OnInit, OnDestroy {

  forgotPasswordForm!: FormGroup;

  validation_messages = {
    'username': [
      { type: 'required', message: 'Email is required.' },
    ],
  };

  private store = inject(Store);

  private alert = inject(AlertService);

  private readonly ngUnsubscribe = new Subject();

  constructor() {
    this.forgotPasswordForm = new FormGroup({
      'username': new FormControl('yumi', Validators.compose([
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
      .subscribe((vs: IStoreSnapshoModel) => {
        console.log(vs);
        if (vs.auth.retrievePasswordResponseCode === 200) {
          this.alert.presentSimpleAlert(vs.auth.retrievePasswordResponseMessage, 'login');
        }
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

}
