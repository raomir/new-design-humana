import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { PrimeNGConfig } from 'primeng/api'
import { RippleModule } from 'primeng/ripple'
import { AppComponent } from 'src/app/app.component'
import { AppBreadcrumbComponent } from '../breadcrumb/app.breadcrumb.component'
import { AppFooterComponent } from '../footer/app.footer.component'
import { AppInlineMenuComponent } from '../inlinemenu/app.inlinemenu.component'
import { AppMenuComponent } from '../menu/app.menu.component'
import { MenuService } from '../menu/app.menu.service'
import { AppTopbarComponent } from '../topbar/app.topbar.component'

@Component({
    selector: 'app-main',
    templateUrl: './app.main.component.html',
    standalone: true,
    imports: [
        AppBreadcrumbComponent,
        AppFooterComponent,
        RouterOutlet,
        AppMenuComponent,
        AppInlineMenuComponent,
        AppTopbarComponent,
        RippleModule,
        CommonModule,
    ],
})
export class AppMainComponent {
    overlayMenuActive: boolean = true

    staticMenuDesktopInactive = false

    staticMenuMobileActive: boolean = true

    sidebarActive = true

    sidebarStatic = true

    menuClick: boolean = true

    menuHoverActive = false

    topbarMenuActive: boolean = true

    topbarItemClick: boolean = true

    activeTopbarItem: any

    configActive: boolean = true

    configClick: boolean = true

    searchActive: boolean = true

    searchClick: boolean = true

    activeInlineProfile: boolean = false

    pinActive: boolean = true

    constructor(
        private menuService: MenuService,
        private primengConfig: PrimeNGConfig,
        public app: AppComponent
    ) {
        console.log('aca')
    }

    onLayoutClick() {
        if (!this.topbarItemClick) {
            this.activeTopbarItem = null
            this.topbarMenuActive = false
        }

        if (this.configActive && !this.configClick) {
            this.configActive = false
        }

        if (this.searchActive && !this.searchClick) {
            this.searchActive = false
        }

        if (!this.menuClick) {
            if ((this.isSlim() || this.isHorizontal()) && !this.isMobile()) {
                this.menuService.reset()
                this.menuHoverActive = false
            }

            if (this.overlayMenuActive || this.staticMenuMobileActive) {
                this.overlayMenuActive = false
                this.staticMenuMobileActive = false
            }
        }

        this.configClick = false
        this.searchClick = false
        this.menuClick = false
        this.topbarItemClick = false
    }

    onSidebarClick() {
        this.menuClick = true
    }

    onToggleMenu(event: any) {
        this.menuClick = true

        if (this.overlayMenuActive) {
            this.overlayMenuActive = false
        }

        if (this.sidebarActive) {
            this.sidebarStatic = !this.sidebarStatic
        }

        event.preventDefault()
    }

    onSidebarMouseOver() {
        if (this.app.menuMode === 'sidebar' && !this.sidebarStatic) {
            this.sidebarActive = this.isDesktop()
            setTimeout(() => {
                this.pinActive = this.isDesktop()
            }, 200)
        }
    }

    onSidebarMouseLeave() {
        if (this.app.menuMode === 'sidebar' && !this.sidebarStatic) {
            setTimeout(() => {
                this.sidebarActive = false
                this.pinActive = false
            }, 250)
        }
    }

    onMenuButtonClick(event: any) {
        this.menuClick = true

        if (this.isOverlay()) {
            this.overlayMenuActive = !this.overlayMenuActive
        }

        if (this.isDesktop()) {
            this.staticMenuDesktopInactive = !this.staticMenuDesktopInactive
        } else {
            this.staticMenuMobileActive = !this.staticMenuMobileActive
        }

        event.preventDefault()
    }

    onTopbarItemClick(event: any, item: any) {
        this.topbarItemClick = true

        if (this.activeTopbarItem === item) {
            this.activeTopbarItem = null
        } else {
            this.activeTopbarItem = item
        }

        event.preventDefault()
    }

    onTopbarSubItemClick(event: any) {
        event.preventDefault()
    }

    onRippleChange(event: any) {
        this.app.ripple = event.checked
        this.primengConfig.ripple = event.checked
    }

    onConfigClick() {
        this.configClick = true
    }

    isStatic() {
        return this.app.menuMode === 'static'
    }

    isOverlay() {
        return this.app.menuMode === 'overlay'
    }

    isSlim() {
        return this.app.menuMode === 'slim'
    }

    isHorizontal() {
        return this.app.menuMode === 'horizontal'
    }

    isSidebar() {
        return this.app.menuMode === 'sidebar'
    }

    isDesktop() {
        return window.innerWidth > 991
    }

    isMobile() {
        return window.innerWidth <= 991
    }
}
