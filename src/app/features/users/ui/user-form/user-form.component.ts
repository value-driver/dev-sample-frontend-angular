import { Component, inject, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { User } from '@features/users/models/user.models';
import { markFormTouched } from '@core/forms/form-utils';

@Component({
  selector: 'app-user-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzButtonModule,
  ],
  templateUrl: './user-form.component.html',
})
export class UserFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private modalRef = inject(NzModalRef, { optional: true });

  user = input<User | null>(null);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    role: ['viewer', [Validators.required]],
    status: ['active', [Validators.required]],
  });

  ngOnInit() {
    const data = this.modalRef?.getConfig().nzData;
    if (data?.user || this.user()) {
      const u = data?.user || this.user();
      if (u) {
        this.form.patchValue({
          name: u.name,
          email: u.email,
          role: u.role,
          status: u.status,
        });
      }
    }
  }

  submit(): void {
    if (this.form.valid) {
      this.modalRef?.close(this.form.value);
      return;
    }

    markFormTouched(this.form);
  }

  cancel(): void {
    this.modalRef?.close(null);
  }
}
