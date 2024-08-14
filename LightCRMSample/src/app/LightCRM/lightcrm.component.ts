  import { Component, Input, ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
  import { AppContainer } from 'app/gx/base/app-container';
  import { ActivatedRoute } from '@angular/router';
  import { CompositeNavigation } from 'app/gx/navigation/composite-navigation';
  import { PanelComponent} from 'app/gx/base/panel.component';
  import { GAMService} from 'app/gx/auth/gam.service';
  import { AppBarService } from 'app/gx/base/app-bar.service';
  import { NavigationStyle } from 'app/gx/base/view-manager';
  import { CommonModule as gxCommonModule}  from 'app/common.module';

  import { UIComponentElement } from 'app/gx/ui/model/ui-component';
  import { UIActionBarElement } from 'app/gx/ui/model/ui-actionbar';
  import { UIFormElement } from 'app/gx/ui/model/ui-form';

  import { LightCRMService  } from './lightcrm.service';

  @Component({
    selector: 'LightCRM',
    templateUrl: './lightcrm.component.html',
    providers: [
      LightCRMService,
    ],
    styles: [":host { display: flex; flex: 1; }"],
    standalone: true,
    imports: [gxCommonModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
  })
  export class LightCRMComponent extends PanelComponent {

    __routingPath = 'LightCRM';

    __pushToNavigationStack = true;

    __views = [
      {
        name: "ViewAny",
        type: "any",
        os: "Any Platform",
        device: "Any Device Kind",
        minShortestBound: 0,
        maxShortestBound: 0,
        minLongestBound: 0,
        maxLongestBound: 0,
        navigationStyle: "default",
        appBarBindFn: this.bindAppBar_ViewAny.bind(this),
        UIModelDefaults: this.getUIModelDefaults_ViewAny.bind(this),
        theme: "GeneXusUnanimo.UnanimoAngular"
      }

    ];

    state: LightCRMStateModel;


    panelService = inject(LightCRMService);
    protected gam = inject(GAMService);
    private appBarService = inject(AppBarService);

    constructor() {
      super();
        this.state = new LightCRMStateModel();

      this.initState();
      this.initParameters(null);
      this.initUIModel();
    }

    initState() {
      this.state = new LightCRMStateModel();
    }

    initControllers() {
      const defaultPage = 1;
      this.goPage( defaultPage.toString(), "tab["+defaultPage+"]");
      this.cdr.markForCheck();
    }


    bindAppBar_ViewAny(navigationStyle: NavigationStyle) {
      this.state.uiModel.ctrlApplicationbar.visible = true;
      this.state.uiModel.ctrlApplicationbar.showBackButton = this.nvg.canGoBack();
      this.state.uiModel.ctrlApplicationbar.navigationItems = [
        {
            id: "_WorkWithDevicesCompany",
            caption: this.app.translate("Companies"),
            class: "MenuItem",
            icon: this.app.createFromID('img_company'),
            onClick: this._WorkWithDevicesCompany,
        },
        {
            id: "_WorkWithDevicesContact",
            caption: this.app.translate("Contacts"),
            class: "MenuItem",
            icon: this.app.createFromID('img_contact'),
            onClick: this._WorkWithDevicesContact,
        },
        {
            id: "_WorkWithDevicesMeeting",
            caption: this.app.translate("Meetings"),
            class: "MenuItem",
            icon: this.app.createFromID('img_meeting'),
            onClick: this._WorkWithDevicesMeeting,
        }
      ];
      this.state.uiModel.ctrlApplicationbar.onBackButtonClick = () => this.__Cancel();
      this.appBarService.setAppbar(this.state.uiModel.ctrlApplicationbar);
    }

    getUIModelDefaults_ViewAny( containerName?: string) {
      return [];
    }

    goPage = (id: string, element:string) => {
        if (element) {
          const page = element.match(/tab\[([0-9]+)\]/i);
          if (page && page.length > 0) {
            if (+page[1] === 1) {
              this._WorkWithDevicesCompany();
              return;
            }if (+page[1] === 2) {
              this._WorkWithDevicesContact();
              return;
            }if (+page[1] === 3) {
              this._WorkWithDevicesMeeting();
              return;
            };
          }
      }
    }

    // Actions
    _WorkWithDevicesCompany = async (): Promise<any> => {
      const __aSt = this.startAction();
      try {
        await this.navigate(['WorkWithCompany-Company_List' ], __aSt);
      } catch (e) {
        this.processCompositeError(e);
      } finally {
        this.endAction(__aSt);
      }
    } 
    _WorkWithDevicesContact = async (): Promise<any> => {
      const __aSt = this.startAction();
      try {
        await this.navigate(['WorkWithContact-Contact_List' ], __aSt);
      } catch (e) {
        this.processCompositeError(e);
      } finally {
        this.endAction(__aSt);
      }
    } 
    _WorkWithDevicesMeeting = async (): Promise<any> => {
      const __aSt = this.startAction();
      try {
        await this.navigate(['WorkWithMeeting-Meeting_List' ], __aSt);
      } catch (e) {
        this.processCompositeError(e);
      } finally {
        this.endAction(__aSt);
      }
    } 

    async navigate(nvgCommand, act) {
      this.nvg.navigateOption(nvgCommand[0], 'type', 'no-push');
      return await super.navigate(nvgCommand, act);
    }

    async navigateForResult(nvgCommand, act) {
      this.nvg.navigateOption(nvgCommand[0], 'type', 'no-push');
      return await super.navigateForResult(nvgCommand, act);
    }




  }

  class LightCRMStateModel {
    uiModel: LightCRMUIModel;

    constructor() {
        this.uiModel = new LightCRMUIModel();

    }
  }

  class LightCRMUIModel {

    constructor() {
      this.ctrlForm.applicationBar = this.ctrlApplicationbar;
    }
    ctrlForm = new UIFormElement();
    ctrlApplicationbar = new UIActionBarElement();
  } 