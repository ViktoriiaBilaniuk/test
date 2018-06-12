import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { TestComponent } from './test/test.component';
import {HttpClientModule} from '@angular/common/http';
import { ApolloModule} from 'apollo-angular';
import { HttpLinkModule} from 'apollo-angular-link-http';
import {UpvoterComponent} from './test/upvoter.component';
import {GraphQLModule} from './graphql.module';


@NgModule({
  declarations: [
    AppComponent,
    TestComponent,
    UpvoterComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ApolloModule,
    HttpLinkModule,
    GraphQLModule,
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
