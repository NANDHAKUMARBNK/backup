import { GridModule, PDFModule } from "@progress/kendo-angular-grid";
import { NgModule } from "@angular/core";
import { LibBwUiCompCoreComponent } from "./lib-bw-ui-comp-core.component";
import { TextareaComponent } from "./pattern/atoms/textarea/textarea.component";
import { ButtonComponent } from "./pattern/atoms/button/button.component";
import { SelectComponent } from "./pattern/atoms/select/select.component";
import { DividerComponent } from "./pattern/atoms/divider/divider.component";
import { ImageComponent } from "./pattern/atoms/image/image.component";
import { InputComponent } from "./pattern/atoms/input/input.component";
import { BwControlErrorMessageComponent } from "./pattern/atoms/bw-control-error-message/bw-control-error-message.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { DivComponent } from "./pattern/atoms/div/div.component";
import { TextComponent } from "./pattern/atoms/text/text.component";
import { LabelComponent } from "./pattern/atoms/label/label.component";
import { TooltipComponent } from "./pattern/atoms/tooltip/tooltip.component";
import { AlphaSearchComponent } from "./pattern/atoms/alpha-search/alpha-search.component";
import { CheckboxComponent } from "./pattern/atoms/checkbox/checkbox.component";
import { CardComponent } from "./pattern/atoms/card/card.component";
import { HorizontalLabelComponent } from "./pattern/atoms/horizontal-label/horizontal-label.component";
import { AvatarComponent } from "./pattern/atoms/avatar/avatar.component";
import { SplitButtonComponent } from "./pattern/atoms/split-button/split-button.component";
import { PaginationComponent } from "./pattern/atoms/pagination/pagination.component";
import { DropDownsModule } from "@progress/kendo-angular-dropdowns";
import { ToggleSwitchComponent } from "./pattern/atoms/toggle-switch/toggle-switch.component";
import { InputsModule } from "@progress/kendo-angular-inputs";
import { ToastrComponent } from "./pattern/atoms/toastr/toastr.component";
import { TabComponent } from "./pattern/atoms/tab/tab.component";
import { IconsModule } from "@progress/kendo-angular-icons";
import { LayoutModule } from "@progress/kendo-angular-layout";
import { AccordionComponent } from "./pattern/atoms/accordion/accordion.component";
import { GridComponentAtom } from "./pattern/molecules/grid/grid.component";
import { ImageTextComponent } from "./pattern/molecules/image-text/image-text.component";
import { IconTextComponent } from "./pattern/molecules/icon-text/icon-text.component";
import { LinkComponent } from "./pattern/atoms/link/link.component";
import { CardTableComponent } from "./pattern/organism/card-table/card-table.component";
import { SideNavComponent } from "./pattern/molecules/side-nav/side-nav.component";
import { TreeViewModule } from "@progress/kendo-angular-treeview";
import { DoubleIconComponent } from "./pattern/molecules/double-icon/double-icon.component";
import { IconInputComponent } from "./pattern/molecules/icon-input/icon-input.component";
import { HomeComponent } from "./pattern/templates/home/home.component";
import { HeaderComponent } from "./pattern/molecules/header/header.component";
import { ConfirmModalComponent } from "./pattern/templates/confirm-modal/confirm-modal.component";
import { DialogModule } from "@progress/kendo-angular-dialog";
import { ComboButtonComponent } from "./pattern/molecules/combo-button/combo-button.component";
import { BreadCrumbComponent } from "./pattern/molecules/bread-crumb/bread-crumb.component";
import { NavigationModule } from "@progress/kendo-angular-navigation";
import { LabelSelectButtonComponent } from "./pattern/organism/label-select-button/label-select-button.component";
import { RadioComponent } from "./pattern/atoms/radio/radio.component";
import { PDFExportModule } from "@progress/kendo-angular-pdf-export";
import { ExcelExportModule } from "@progress/kendo-angular-excel-export";
import { CaptchaComponent } from "./pattern/atoms/captcha/captcha.component";
import { FooterComponent } from "./pattern/molecules/footer/footer.component";
import { DateInputsModule } from "@progress/kendo-angular-dateinputs";
import { LabelModule } from "@progress/kendo-angular-label";
import { IntlModule } from "@progress/kendo-angular-intl";
import { AlertAddDocumentModalComponent } from "./pattern/templates/alert-add-document-modal/alert-add-document-modal.component";
import { InputFileComponent } from "./pattern/atoms/input-file/input-file.component";
import { ErrorPageComponent } from "./pattern/templates/errorPage/error-page/error-page.component";
import { BasicLoaderComponent } from "./pattern/atoms/basic-loader/basic-loader.component";
import { IndicatorsModule } from "@progress/kendo-angular-indicators";
import { PopupComponent } from "./pattern/atoms/popup/popup.component";
import { PopupModule } from "@progress/kendo-angular-popup";
import { SchedulerModule } from "@progress/kendo-angular-scheduler";
import { RTL } from "@progress/kendo-angular-l10n";
import { DateComponent } from "./pattern/atoms/date/date.component";
import { TextComboboxRadioComponent } from "./pattern/organism/text-combobox-radio/text-combobox-radio.component";
import { MeetingsDetailSendEmailUsersModalComponent } from "./pattern/templates/send-email-modal/send-email-modal.component";
import { ButtonsModule } from "@progress/kendo-angular-buttons";
import { ButtonGroupComponent } from "./pattern/atoms/button-group/button-group.component";
import { UploadsModule } from "@progress/kendo-angular-upload";
import { MeetingsDiscussionComponent } from "./pattern/templates/meetings-discussion/meetings-discussion.component";
import { ReplyDiscussionComponent } from "./pattern/templates/reply-discussion/reply-discussion.component";
import { IconPopupComponent } from "./pattern/atoms/icon-popup/icon-popup.component";
import { BarChartComponent } from './pattern/atoms/bar-chart/bar-chart.component';
import { NewQuestionsVotingsComponent } from './pattern/templates/new-questions-votings/new-questions-votings.component';
import { NewQuestionComponent } from './pattern/templates/new-question/new-question.component';
import { SettingsRecentUpdatesComponent } from './pattern/templates/settings-recent-updates/settings-recent-updates.component';


@NgModule({
  declarations: [
    LibBwUiCompCoreComponent,
    ButtonComponent,
    InputComponent,
    TextareaComponent,
    SelectComponent,
    DividerComponent,
    ImageComponent,
    BwControlErrorMessageComponent,
    DivComponent,
    TextComponent,
    LabelComponent,
    TooltipComponent,
    AlphaSearchComponent,
    CheckboxComponent,
    CardComponent,
    HorizontalLabelComponent,
    AvatarComponent,
    SplitButtonComponent,
    PaginationComponent,
    ToggleSwitchComponent,
    ToastrComponent,
    TabComponent,
    GridComponentAtom,
    AccordionComponent,
    ImageTextComponent,
    IconTextComponent,
    LinkComponent,
    CardTableComponent,
    SideNavComponent,
    DoubleIconComponent,
    IconInputComponent,
    HomeComponent,
    HeaderComponent,
    ConfirmModalComponent,
    ComboButtonComponent,
    BreadCrumbComponent,
    LabelSelectButtonComponent,
    RadioComponent,
    CaptchaComponent,
    FooterComponent,
    AlertAddDocumentModalComponent,
    InputFileComponent,
    ErrorPageComponent,
    BasicLoaderComponent,
    PopupComponent,
    DateComponent,
    TextComboboxRadioComponent,
    MeetingsDetailSendEmailUsersModalComponent,
    ButtonGroupComponent,
    MeetingsDiscussionComponent,
    ReplyDiscussionComponent,
    IconPopupComponent,
    BarChartComponent,
    NewQuestionsVotingsComponent,
    NewQuestionComponent,
    SettingsRecentUpdatesComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    DropDownsModule,
    GridModule,
    InputsModule,
    IconsModule,
    LayoutModule,
    TreeViewModule,
    DialogModule,
    NavigationModule,
    PDFExportModule,
    ExcelExportModule,
    PDFModule,
    DateInputsModule,
    LabelModule,
    IntlModule,
    IndicatorsModule,
    PopupModule,
    SchedulerModule,
    ButtonsModule,
    UploadsModule,
  ],
  exports: [
    LibBwUiCompCoreComponent,
    BwControlErrorMessageComponent,
    ButtonComponent,
    InputComponent,
    TextareaComponent,
    SelectComponent,
    DividerComponent,
    ImageComponent,
    FormsModule,
    ReactiveFormsModule,
    DivComponent,
    TextComponent,
    LabelComponent,
    TooltipComponent,
    AlphaSearchComponent,
    CheckboxComponent,
    CardComponent,
    HorizontalLabelComponent,
    AvatarComponent,
    SplitButtonComponent,
    PaginationComponent,
    DropDownsModule,
    ToggleSwitchComponent,
    ToastrComponent,
    TabComponent,
    GridComponentAtom,
    AccordionComponent,
    ImageTextComponent,
    IconTextComponent,
    LinkComponent,
    CardTableComponent,
    SideNavComponent,
    GridModule,
    InputsModule,
    IconsModule,
    LayoutModule,
    PDFExportModule,
    DoubleIconComponent,
    IconInputComponent,
    HomeComponent,
    HeaderComponent,
    ConfirmModalComponent,
    ComboButtonComponent,
    BreadCrumbComponent,
    LabelSelectButtonComponent,
    RadioComponent,
    ExcelExportModule,
    CaptchaComponent,
    FooterComponent,
    PDFModule,
    DateInputsModule,
    LabelModule,
    IntlModule,
    AlertAddDocumentModalComponent,
    InputFileComponent,
    ErrorPageComponent,
    BasicLoaderComponent,
    PopupComponent,
    PopupModule,
    SchedulerModule,
    DateComponent,
    TextComboboxRadioComponent,
    MeetingsDetailSendEmailUsersModalComponent,
    ButtonsModule,
    ButtonGroupComponent,
    UploadsModule,
    MeetingsDiscussionComponent,
    ReplyDiscussionComponent,
    IconPopupComponent,
    BarChartComponent,
    NewQuestionComponent
  ],
  entryComponents: [
    ConfirmModalComponent,
    AlertAddDocumentModalComponent,
    MeetingsDetailSendEmailUsersModalComponent,
    MeetingsDiscussionComponent,
    ReplyDiscussionComponent,
    NewQuestionComponent
  ],
  // providers:    [{ provide: RTL, useValue: true }]
})
export class LibBwUiCompCoreModule {}
