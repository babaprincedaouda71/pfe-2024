import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AdminRoutingModule} from './admin-routing.module';
import {BlankComponent} from "./layout/blank/blank.component";
import {SidebarComponent} from "./layout/sidebar/sidebar.component";
import {NavItemComponent} from "./layout/nav-item/nav-item.component";
import {FullComponent} from "./layout/full/full.component";
import {HeaderComponent} from "./layout/header/header.component";
import {BreadcrumbComponent} from "./layout/breadcrumb/breadcrumb.component";
import {CustomizerComponent} from "./layout/customizer/customizer.component";
import {TablerIconsModule} from "angular-tabler-icons";
import {NgScrollbar} from "ngx-scrollbar";
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {FormsModule} from "@angular/forms";
import {MatTooltip} from "@angular/material/tooltip";
import {MatToolbar} from "@angular/material/toolbar";
import {
  MatAnchor,
  MatButton,
  MatFabButton,
  MatIconAnchor,
  MatIconButton,
  MatMiniFabButton
} from "@angular/material/button";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatBadge} from "@angular/material/badge";
import {MatListItem, MatListItemIcon, MatListSubheaderCssMatStyler, MatNavList} from "@angular/material/list";
import {MatIcon} from "@angular/material/icon";
import {TranslateModule} from "@ngx-translate/core";
import {MatDrawer, MatSidenav, MatSidenavContainer, MatSidenavContent} from "@angular/material/sidenav";
import {MatDivider} from "@angular/material/divider";
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from "@angular/material/expansion";
import {BrandingComponent} from "./layout/sidebar/branding.component";
import {WelcomeComponent} from './welcome/welcome.component';

@NgModule({
  declarations: [
    BlankComponent,
    SidebarComponent,
    NavItemComponent,
    FullComponent,
    HeaderComponent,
    BreadcrumbComponent,
    CustomizerComponent,
    WelcomeComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    NgScrollbar,
    MatButtonToggleGroup,
    FormsModule,
    MatButtonToggle,
    MatTooltip,
    MatToolbar,
    MatIconButton,
    MatButton,
    MatMenuTrigger,
    MatMenu,
    MatAnchor,
    MatMenuItem,
    MatBadge,
    MatMiniFabButton,
    MatListSubheaderCssMatStyler,
    MatListItemIcon,
    MatIcon,
    MatListItem,
    TranslateModule,
    MatSidenavContainer,
    MatSidenav,
    MatNavList,
    MatIconAnchor,
    MatFabButton,
    MatDivider,
    MatDrawer,
    MatAccordion,
    MatExpansionPanelTitle,
    MatExpansionPanelHeader,
    MatExpansionPanel,
    BrandingComponent,
    MatSidenavContent,
    TablerIconsModule
  ]
})
export class AdminModule { }
