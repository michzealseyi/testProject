import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { LoaderModalComponent } from '../../loader-modal/loader-modal.component';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({});

  loginFailed = false;

  constructor(
    private authService: AuthService,

    private fb: FormBuilder,
    public dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onLogin(): void {
    const loader = this.dialog.open(LoaderModalComponent, {
      height: '150px',
      width: '150px',
      disableClose: true,
    });
    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;
    this.authService.login(email, password).subscribe((isLoggedIn) => {
      
      this.loginFailed = !isLoggedIn;

      console.log('login info', isLoggedIn);
      
      loader.close();
    });
  }
}
