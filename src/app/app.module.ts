import { HttpClientModule } from '@angular/common/http'
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

// Application Components
import { AppComponent } from './app.component'

// Application services
import { AppRoutingModule } from './app-routing.module'
import { AppBreadcrumbService } from './infraestructure/adapter/primary/root/breadcrumb/app.breadcrumb.service'
import { MenuService } from './infraestructure/adapter/primary/root/menu/app.menu.service'

@NgModule({
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
    ],
    declarations: [AppComponent],
    providers: [MenuService, AppBreadcrumbService],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    bootstrap: [AppComponent],
})
export class AppModule {}
