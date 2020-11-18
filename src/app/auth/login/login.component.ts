import { Component } from "@angular/core";
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
    selector: "app-login",
    templateUrl: './login.component.html',
    styleUrls:['./login.component.css']
})

export class LoginComponent {
    isLoading = false;

    constructor(public authService: AuthService){}

    onlogin(form: NgForm){
        if(form.invalid){
            return;
        }else{
            this.authService.login(form.value.email,form.value.password)
        }
    }
 
}