import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './modules/material/material/material.module';


// firebase extensions
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AngularFireDatabaseModule } from '@angular/fire/database';

// components
import { PasswordResetComponent } from './components/auth/password-reset/password-reset.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { BusinessComponent } from './components/business/business.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { NavComponent } from './components/nav/nav.component';
import { CategoryComponent } from './components/category/category.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PostsComponent } from './components/posts/posts.component';
import { ConvolistComponent } from './components/convolist/convolist.component';
import { ChatfeedComponent } from './components/chatfeed/chatfeed.component';
import { DirectoryComponent } from './components/directory/directory.component';
import { ErrorHandlingComponent } from './components/error-handling/error-handling.component';
import { HoodComponent } from './components/hood/hood.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PasswordResetComponent,
    RegisterComponent,
    HoodComponent,
    HomeComponent,
    BusinessComponent,
    SidenavComponent,
    NavComponent,
    CategoryComponent,
    ProfileComponent,
    PostsComponent,
    ConvolistComponent,
    ChatfeedComponent,
    DirectoryComponent,
    ErrorHandlingComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireMessagingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MaterialModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }