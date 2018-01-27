import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth.service';
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html'
})

export class ResetPasswordComponent implements OnInit, OnDestroy {

    form: FormGroup;
    destroy: Subject<any> = new Subject();

    constructor (private fb: FormBuilder, public auth: AuthService, private router: Router, private route: ActivatedRoute) { }

    ngOnInit() {
        this.form = this.fb.group({
            email: ['', Validators.required]
        });

        this.auth.user$.takeUntil(this.destroy).subscribe(user => {
            if (user === null) { } // null check so it doesn't break the component
            else if (this.auth.isHttpErrorResponse(user) && user.error === 'user does not exist') {
                // to do: snackbar: email does not exist
                this.form.patchValue({ email: '' })
            }
        });

        this.route.queryParams.take(1).subscribe(res => console.log(res))
    }

    resetPassword(): void {
        this.auth.requestPasswordReset(this.form.value);
        // to do: snackbar that confirms that email has been sent.
    }

    ngOnDestroy() {
        this.destroy.next();
    }
}
