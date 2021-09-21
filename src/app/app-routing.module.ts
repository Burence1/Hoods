import { ErrorHandlingComponent } from './components/error-handling/error-handling.component';
import { DirectoryComponent } from './components/directory/directory.component';
import { ChatfeedComponent } from './components/chatfeed/chatfeed.component';
import { ConvolistComponent } from './components/convolist/convolist.component';
import { PostsComponent } from './components/posts/posts.component';
import { ProfileComponent } from './components/profile/profile.component';
import { BusinessComponent } from './components/business/business.component';
import { CategoryComponent } from './components/category/category.component';
import { HomeComponent } from './components/home/home.component';
import { HoodComponent } from './components/hood/hood.component';
import { PasswordResetComponent } from './components/auth/password-reset/password-reset.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';

const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full' },
  {path:'login',component:LoginComponent},
  {path:'register',component:RegisterComponent},
  {path:'reset',component:PasswordResetComponent},
  {path:'hood',component:HoodComponent},
  {path:'home',component:HomeComponent},
  {path:'category',component:CategoryComponent},
  {path:'business/:businesses',component:BusinessComponent},
  {path:'profile',component:ProfileComponent},
  {path:'posts',component:PostsComponent},
  {path:'chatlist',component:ConvolistComponent},
  {path:'chatfeed/:groupname',component:ChatfeedComponent},
  {path:'directory',component:DirectoryComponent},
  {path:'**',component:ErrorHandlingComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
