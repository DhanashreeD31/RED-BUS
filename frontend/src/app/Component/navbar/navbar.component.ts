import { Component, inject, OnInit } from '@angular/core';
declare var google:any;
import { CustomerService } from '../../service/customer.service';
import { Customer } from '../../model/customer.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{

  isDarkMode: boolean = false; // State for dark mode
  isloggedIn: boolean = false;

constructor(private router:Router,private customerservice:CustomerService){}

ngOnInit(): void {
  const savedTheme = localStorage.getItem('theme');
    this.isDarkMode = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    this.applyTheme();

  if(sessionStorage.getItem("Loggedinuser")){
    this.isloggedIn=true
  }else{
    this.isloggedIn=false
  }


  google.accounts.id.initialize({
    client_id:"1097651290756-darssj7dr84esfdfsgkp2d5l887vk934.apps.googleusercontent.com",
    callback:(response:any)=>{this.handlelogin(response);

    }
  });
}
ngAfterViewInit():void{
  this.rendergooglebutton();
}

toggleDarkMode(): void {
  document.body.classList.toggle('dark');
  this.isDarkMode = !this.isDarkMode;
  const theme = this.isDarkMode ? 'dark' : 'light';
  localStorage.setItem('theme', theme);
  this.applyTheme();
}
 // Apply the theme to the <html> tag
 private applyTheme(): void {
  if (this.isDarkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

private rendergooglebutton():void{
  const googlebtn=document.getElementById('google-btn');
  if(googlebtn){
    google.accounts.id.renderButton(googlebtn,{
      theme:'outline',
      size:'medium',
      shape:'pill',
      width:150,
    })
  }
}

private decodetoken(token:String){
  return JSON.parse(atob(token.split(".")[1]))
}
handlelogin(response:any){
  const payload=this.decodetoken(response.credential)
  // console.log(payload)
  this.customerservice.addcustomermongo(payload).subscribe({
    next:(response)=>{
      console.log('POST success',response);
      sessionStorage.setItem("Loggedinuser",JSON.stringify(response))
    },
    error:(error)=>{
      console.error('Posr request failed',error)
    }
  })
}
handlelogout(){
  google.accounts.id.disableAutoSelect();
  sessionStorage.removeItem('Loggedinuser');
  window.location.reload()
}
navigate(route:string){
  this.router.navigate([route])
}
}
