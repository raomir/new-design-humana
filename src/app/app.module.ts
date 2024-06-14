import { HttpClientModule } from '@angular/common/http'
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

// Application Components
import { AppComponent } from './app.component'

// Application services
import { AppRoutingModule } from './app-routing.module'
import { MenuService } from './ssgt/parameter/infraestructure/adapter/primary/root/menu/app.menu.service'
import { AppBreadcrumbService } from './ssgt/parameter/infraestructure/adapter/primary/root/breadcrumb/app.breadcrumb.service';
import { ConfirmationService, MessageService } from 'primeng/api'
import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { ToastModule } from 'primeng/toast'
import { MultiSelect, MultiSelectModule } from 'primeng/multiselect';

@NgModule({
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        ConfirmDialogModule,
        ToastModule,
        MultiSelectModule
    ],
    declarations: [AppComponent],
    providers: [MenuService, AppBreadcrumbService, MessageService, ConfirmationService],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    bootstrap: [AppComponent],
})
export class AppModule {}
