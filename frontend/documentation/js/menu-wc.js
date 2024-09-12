'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">frontend documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AdminModule.html" data-type="entity-link" >AdminModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-AdminModule-34fffd81724ffeb3cb88bc07ca1185d39f75342b2377277a60a046ee4da7597adaf59f77e6752b272769ad2df7d24b3f62f0ee76516ca6741c5c2a11f3f5665d"' : 'data-bs-target="#xs-components-links-module-AdminModule-34fffd81724ffeb3cb88bc07ca1185d39f75342b2377277a60a046ee4da7597adaf59f77e6752b272769ad2df7d24b3f62f0ee76516ca6741c5c2a11f3f5665d"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AdminModule-34fffd81724ffeb3cb88bc07ca1185d39f75342b2377277a60a046ee4da7597adaf59f77e6752b272769ad2df7d24b3f62f0ee76516ca6741c5c2a11f3f5665d"' :
                                            'id="xs-components-links-module-AdminModule-34fffd81724ffeb3cb88bc07ca1185d39f75342b2377277a60a046ee4da7597adaf59f77e6752b272769ad2df7d24b3f62f0ee76516ca6741c5c2a11f3f5665d"' }>
                                            <li class="link">
                                                <a href="components/BlankComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BlankComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/BreadcrumbComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BreadcrumbComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CustomizerComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CustomizerComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FullComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FullComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HeaderComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HeaderComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NavItemComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NavItemComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SidebarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SidebarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/WelcomeComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >WelcomeComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AdminRoutingModule.html" data-type="entity-link" >AdminRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AgendaModule.html" data-type="entity-link" >AgendaModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-AgendaModule-2e2bb113f40e4a30833a2c31ca72ce45bffdd46d3d1d56f2d426797b538077564503e215bbaa334a6b3bc3098fa23eb07442c644008ce3c5355f5ab6b73eea1f"' : 'data-bs-target="#xs-components-links-module-AgendaModule-2e2bb113f40e4a30833a2c31ca72ce45bffdd46d3d1d56f2d426797b538077564503e215bbaa334a6b3bc3098fa23eb07442c644008ce3c5355f5ab6b73eea1f"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AgendaModule-2e2bb113f40e4a30833a2c31ca72ce45bffdd46d3d1d56f2d426797b538077564503e215bbaa334a6b3bc3098fa23eb07442c644008ce3c5355f5ab6b73eea1f"' :
                                            'id="xs-components-links-module-AgendaModule-2e2bb113f40e4a30833a2c31ca72ce45bffdd46d3d1d56f2d426797b538077564503e215bbaa334a6b3bc3098fa23eb07442c644008ce3c5355f5ab6b73eea1f"' }>
                                            <li class="link">
                                                <a href="components/AgendaComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AgendaComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TrainingDialog.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TrainingDialog</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AgendaRoutingModule.html" data-type="entity-link" >AgendaRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-AppModule-26c9623e288cddf2c6869ca4bfb454fa09028b2ab46642048ac3ca5b7dcd8b886b69f17a8e3d4acdc1fa0b98f92f9a25001051cf40af71c707c72cb6d3fb9495"' : 'data-bs-target="#xs-components-links-module-AppModule-26c9623e288cddf2c6869ca4bfb454fa09028b2ab46642048ac3ca5b7dcd8b886b69f17a8e3d4acdc1fa0b98f92f9a25001051cf40af71c707c72cb6d3fb9495"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-26c9623e288cddf2c6869ca4bfb454fa09028b2ab46642048ac3ca5b7dcd8b886b69f17a8e3d4acdc1fa0b98f92f9a25001051cf40af71c707c72cb6d3fb9495"' :
                                            'id="xs-components-links-module-AppModule-26c9623e288cddf2c6869ca4bfb454fa09028b2ab46642048ac3ca5b7dcd8b886b69f17a8e3d4acdc1fa0b98f92f9a25001051cf40af71c707c72cb6d3fb9495"' }>
                                            <li class="link">
                                                <a href="components/AppComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ErrorComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ErrorComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link" >AppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ClientModule.html" data-type="entity-link" >ClientModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-ClientModule-030aa7a63ced3fbf1cb0679f4c8213e777abf17b102efcbd6c3bd376ccad5105ffdaf4f54cc571bcc0fc568c41a0ea15f98df39a68cdc2fe7df6e79d9e2f861a"' : 'data-bs-target="#xs-components-links-module-ClientModule-030aa7a63ced3fbf1cb0679f4c8213e777abf17b102efcbd6c3bd376ccad5105ffdaf4f54cc571bcc0fc568c41a0ea15f98df39a68cdc2fe7df6e79d9e2f861a"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ClientModule-030aa7a63ced3fbf1cb0679f4c8213e777abf17b102efcbd6c3bd376ccad5105ffdaf4f54cc571bcc0fc568c41a0ea15f98df39a68cdc2fe7df6e79d9e2f861a"' :
                                            'id="xs-components-links-module-ClientModule-030aa7a63ced3fbf1cb0679f4c8213e777abf17b102efcbd6c3bd376ccad5105ffdaf4f54cc571bcc0fc568c41a0ea15f98df39a68cdc2fe7df6e79d9e2f861a"' }>
                                            <li class="link">
                                                <a href="components/AddClientComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AddClientComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AppClientDialogContentComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppClientDialogContentComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ClientComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ClientComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DetailClientComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DetailClientComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditClientComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditClientComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/OkDialogComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OkDialogComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/ClientRoutingModule.html" data-type="entity-link" >ClientRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/InstructorModule.html" data-type="entity-link" >InstructorModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-InstructorModule-869276d7b970ff88132363279f240d0a173be2ec06c72c171676c0a9eb3dbea492323a89c296c16dfc6814ae195e5158792a76e002cb64adf494db26adc05af8"' : 'data-bs-target="#xs-components-links-module-InstructorModule-869276d7b970ff88132363279f240d0a173be2ec06c72c171676c0a9eb3dbea492323a89c296c16dfc6814ae195e5158792a76e002cb64adf494db26adc05af8"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-InstructorModule-869276d7b970ff88132363279f240d0a173be2ec06c72c171676c0a9eb3dbea492323a89c296c16dfc6814ae195e5158792a76e002cb64adf494db26adc05af8"' :
                                            'id="xs-components-links-module-InstructorModule-869276d7b970ff88132363279f240d0a173be2ec06c72c171676c0a9eb3dbea492323a89c296c16dfc6814ae195e5158792a76e002cb64adf494db26adc05af8"' }>
                                            <li class="link">
                                                <a href="components/AddInstructorComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AddInstructorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AppInstructorDialogContentComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppInstructorDialogContentComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DetailInstructorComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DetailInstructorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditInstructorComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditInstructorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/InstructorComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >InstructorComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/InstructorRoutingModule.html" data-type="entity-link" >InstructorRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/InvoicingModule.html" data-type="entity-link" >InvoicingModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-InvoicingModule-a3bfc815bcc5fede230177af1bfca5743b7d9f04abd3c2cf9e258abc240013f878d60adde58a9bf82f583042d03f30012edffbbb6005b2bfb34ae7fef8dbc225"' : 'data-bs-target="#xs-components-links-module-InvoicingModule-a3bfc815bcc5fede230177af1bfca5743b7d9f04abd3c2cf9e258abc240013f878d60adde58a9bf82f583042d03f30012edffbbb6005b2bfb34ae7fef8dbc225"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-InvoicingModule-a3bfc815bcc5fede230177af1bfca5743b7d9f04abd3c2cf9e258abc240013f878d60adde58a9bf82f583042d03f30012edffbbb6005b2bfb34ae7fef8dbc225"' :
                                            'id="xs-components-links-module-InvoicingModule-a3bfc815bcc5fede230177af1bfca5743b7d9f04abd3c2cf9e258abc240013f878d60adde58a9bf82f583042d03f30012edffbbb6005b2bfb34ae7fef8dbc225"' }>
                                            <li class="link">
                                                <a href="components/AddComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AddComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AddInvoiceDialogContentComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AddInvoiceDialogContentComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ClientTrainingComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ClientTrainingComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DetailComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DetailComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DetailInvoiceComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DetailInvoiceComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DetailPdfComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DetailPdfComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DetailTrainingInvoiceComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DetailTrainingInvoiceComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditTrainingInvoiceComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditTrainingInvoiceComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/InvoiceComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >InvoiceComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/InvoiceDialogContentComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >InvoiceDialogContentComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/InvoicingRoutingModule.html" data-type="entity-link" >InvoicingRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/MaterialModule.html" data-type="entity-link" >MaterialModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/PublicModule.html" data-type="entity-link" >PublicModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/PublicRoutingModule.html" data-type="entity-link" >PublicRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/TrainingModule.html" data-type="entity-link" >TrainingModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-TrainingModule-b5b8e630c648bfbd08511e3196455726c64ee4445911ddb7074c7a9bc1b16e82dc22774053b80276d901fdbae9db6339eccb9ca3924f5da9d87a3518e9f638e6"' : 'data-bs-target="#xs-components-links-module-TrainingModule-b5b8e630c648bfbd08511e3196455726c64ee4445911ddb7074c7a9bc1b16e82dc22774053b80276d901fdbae9db6339eccb9ca3924f5da9d87a3518e9f638e6"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-TrainingModule-b5b8e630c648bfbd08511e3196455726c64ee4445911ddb7074c7a9bc1b16e82dc22774053b80276d901fdbae9db6339eccb9ca3924f5da9d87a3518e9f638e6"' :
                                            'id="xs-components-links-module-TrainingModule-b5b8e630c648bfbd08511e3196455726c64ee4445911ddb7074c7a9bc1b16e82dc22774053b80276d901fdbae9db6339eccb9ca3924f5da9d87a3518e9f638e6"' }>
                                            <li class="link">
                                                <a href="components/AddTrainingComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AddTrainingComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AppTrainingDialogContentComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppTrainingDialogContentComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DetailTrainingComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DetailTrainingComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditTrainingComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditTrainingComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ErrorDialogComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ErrorDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LifeCycleComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LifeCycleComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TrainingComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TrainingComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TrainingLifecycleDialogComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TrainingLifecycleDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TrainingLifecycleDialogContentComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TrainingLifecycleDialogContentComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/TrainingRoutingModule.html" data-type="entity-link" >TrainingRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/VendorModule.html" data-type="entity-link" >VendorModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-VendorModule-efec0d1b1e3fa1f3de7d91c2a9fd3bf11ac081f4e164a1cbdcca584bf07312a29482216c4b741eddae3534ff6e3c41b6f2728666cedb056d281cf1730eb460b4"' : 'data-bs-target="#xs-components-links-module-VendorModule-efec0d1b1e3fa1f3de7d91c2a9fd3bf11ac081f4e164a1cbdcca584bf07312a29482216c4b741eddae3534ff6e3c41b6f2728666cedb056d281cf1730eb460b4"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-VendorModule-efec0d1b1e3fa1f3de7d91c2a9fd3bf11ac081f4e164a1cbdcca584bf07312a29482216c4b741eddae3534ff6e3c41b6f2728666cedb056d281cf1730eb460b4"' :
                                            'id="xs-components-links-module-VendorModule-efec0d1b1e3fa1f3de7d91c2a9fd3bf11ac081f4e164a1cbdcca584bf07312a29482216c4b741eddae3534ff6e3c41b6f2728666cedb056d281cf1730eb460b4"' }>
                                            <li class="link">
                                                <a href="components/AddVendorComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AddVendorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AppVendorDialogContentComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppVendorDialogContentComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DetailVendorComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DetailVendorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditVendorComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditVendorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/VendorComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VendorComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/VendorRoutingModule.html" data-type="entity-link" >VendorRoutingModule</a>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#components-links"' :
                            'data-bs-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/BrandingComponent.html" data-type="entity-link" >BrandingComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/OkDialogComponent-1.html" data-type="entity-link" >OkDialogComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/WelcomeComponent-1.html" data-type="entity-link" >WelcomeComponent</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AuthGuard.html" data-type="entity-link" >AuthGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ClientService.html" data-type="entity-link" >ClientService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ColorService.html" data-type="entity-link" >ColorService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CoreService.html" data-type="entity-link" >CoreService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CustomeDateFormatter.html" data-type="entity-link" >CustomeDateFormatter</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DatesService.html" data-type="entity-link" >DatesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GlobalErrorHandlerService.html" data-type="entity-link" >GlobalErrorHandlerService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/InstructorService.html" data-type="entity-link" >InstructorService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/InvoicingService.html" data-type="entity-link" >InvoicingService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NavService.html" data-type="entity-link" >NavService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TrainingService.html" data-type="entity-link" >TrainingService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/VendorService.html" data-type="entity-link" >VendorService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/apps.html" data-type="entity-link" >apps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/apps-1.html" data-type="entity-link" >apps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AppSettings.html" data-type="entity-link" >AppSettings</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ClientModel.html" data-type="entity-link" >ClientModel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ColorModel.html" data-type="entity-link" >ColorModel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CustomCalendarEvent.html" data-type="entity-link" >CustomCalendarEvent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FileHandleModel.html" data-type="entity-link" >FileHandleModel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GroupModel.html" data-type="entity-link" >GroupModel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/InstructorModel.html" data-type="entity-link" >InstructorModel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/InvoiceModel.html" data-type="entity-link" >InvoiceModel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LifecycleModel.html" data-type="entity-link" >LifecycleModel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/NavItem.html" data-type="entity-link" >NavItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/notifications.html" data-type="entity-link" >notifications</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ProductItem.html" data-type="entity-link" >ProductItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/profiledd.html" data-type="entity-link" >profiledd</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/quicklinks.html" data-type="entity-link" >quicklinks</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/quicklinks-1.html" data-type="entity-link" >quicklinks</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StandardInvoice.html" data-type="entity-link" >StandardInvoice</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TrainingInvoice.html" data-type="entity-link" >TrainingInvoice</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TrainingModel.html" data-type="entity-link" >TrainingModel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Vendor.html" data-type="entity-link" >Vendor</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#pipes-links"' :
                                'data-bs-target="#xs-pipes-links"' }>
                                <span class="icon ion-md-add"></span>
                                <span>Pipes</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="pipes-links"' : 'id="xs-pipes-links"' }>
                                <li class="link">
                                    <a href="pipes/FormatTrainingDatesPipe.html" data-type="entity-link" >FormatTrainingDatesPipe</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});