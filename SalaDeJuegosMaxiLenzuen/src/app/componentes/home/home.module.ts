import { NgModule } from '@angular/core';

import { HomeComponent } from './home.component';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { FormsModule } from '@angular/forms';
import { ChatComponent } from "../chat/chat-component";



@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, HomeRoutingModule, FormsModule, ChatComponent],
  exports: [HomeComponent],
  providers: [],
  bootstrap: [HomeComponent]
})

export class HomeModule { }