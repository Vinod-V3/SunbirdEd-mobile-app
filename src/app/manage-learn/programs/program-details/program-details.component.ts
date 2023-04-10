import { Component, OnInit } from '@angular/core';
import { AppHeaderService } from '@app/services';
import { LibraryFiltersLayout } from '@project-sunbird/common-consumption';
import { TranslateService } from '@ngx-translate/core';
import { GenericPopUpService } from '../../shared';
import { ActivatedRoute } from '@angular/router';
import { urlConstants } from '../../core/constants/urlConstants';
import { LoaderService, UtilsService } from '../../core';
import { KendraApiService } from '../../core/services/kendra-api.service';

@Component({
  selector: 'app-program-details',
  templateUrl: './program-details.component.html',
  styleUrls: ['./program-details.component.scss'],
})
export class ProgramDetailsComponent implements OnInit {
  headerConfig = {
    showHeader : true,
    showBurgerMenu : false,
    actionButtons : []
  }
  filtersList : any = []
  selectedFilterIndex = 0
  layout = LibraryFiltersLayout.ROUND
  selectedSection: any
  showMore:boolean=false
  description
  characterLimit = 150
  programDetails:any={}
  solutionsList:any=[]
  filteredList:any=[]
  sharingStatus='ACTIVE'
  endDate=Date()
  programId
  count = 0;
  limit = 25;
  page = 1;

  constructor(private headerService: AppHeaderService, private translate: TranslateService, private popupService: GenericPopUpService,
    private activatedRoute: ActivatedRoute, private loader: LoaderService, private utils: UtilsService, private kendraService: KendraApiService) {
    this.translate.get(['ALL','FRMELEMNTS_LBL_PROJECTS','FRMELEMNTS_LBL_OBSERVATIONS','FRMELEMNTS_LBL_COURSES','FRMELEMNTS_LBL_SURVEYS']).subscribe((translation)=>{
      this.filtersList = Object.keys(translation).map(translateItem => { return translation[translateItem]})
    })
    activatedRoute.params.subscribe((param)=>{
      this.programId = param.id
      this.getSolutions()
    })
  }

  ngOnInit() {}

  ionViewWillEnter(){
    this.headerConfig = this.headerService.getDefaultPageConfig()
    this.headerConfig.showHeader = true
    this.headerConfig.showBurgerMenu = false
    this.headerConfig.actionButtons = []
    this.headerService.updatePageConfig(this.headerConfig)
  }

  async getSolutions() {
    this.loader.startLoader();
    let payload = await this.utils.getProfileInfo();
    if (payload) {
      const config = {
        url:`${urlConstants.API_URLS.SOLUTIONS_LISTING}${this.programId}?page=${this.page}&limit=${this.limit}&search=`,
        payload: payload,
      };
      this.kendraService.post(config).subscribe(
        (success) => {
          this.loader.stopLoader();
          if (success.result.data) {
            this.programDetails = success.result
            this.count = success.result.count;
            this.formatList()
            this.readMoreOrLess()
          }
        },
        (error) => {
          this.loader.stopLoader();
        }
      );
    } else {
      this.loader.stopLoader();
    }
  }

  readMoreOrLess(){
    if(this.showMore){
      this.description = this.programDetails.description
    }else{
      if(this.programDetails.description.length > this.characterLimit){
        this.description = this.programDetails.description.slice(0,this.characterLimit)+'...'
      }else{
        this.description = this.programDetails.description
      }
    }
  }

  formatList(){
    this.programDetails.data.forEach(data => {
     let sectionName=data.type=='improvementProject'?'projects':data.type+'s'
     let index = this.solutionsList.findIndex((val)=>{return val.sectionName==sectionName})
     if(index!==-1){
      this.solutionsList[index].sectionList.push(data)
     }else{
      let order=data.type=='improvementProject'?0:data.type=='observation'?1:data.type=='course'?2:3
      this.solutionsList.push({sectionName:sectionName,sectionList:[data],order:order})
     }
    });
    this.filteredList=this.solutionsList.sort((a,b)=>{return a.order - b.order})
    this.selectedSection=this.solutionsList[0]?.sectionName
  }

  onFilterChange(event){
    this.selectedFilterIndex = event.data.index
    this.filteredList=this.solutionsList
    if(event.data.index==0){
      this.selectedSection=this.solutionsList[0]?.sectionName
    }else{
      let index =this.solutionsList.findIndex((data)=>{
        return data.sectionName == event.data.text.toLowerCase()
      })
      if(index==-1){
        this.filteredList=[]
      }
      this.selectedSection = event.data.text.toLowerCase()
    }
  }

  joinProgram(){
    this.popupService.showJoinProgramForProjectPopup("FRMELEMNTS_LBL_JOIN_PROGRAM_POPUP",this.programDetails.programName,"all the resources in this program","FRMELEMNTS_LBL_JOIN_PROGRAM_POPUP").then(
      (data:any)=>{
        if(data){
          this.programDetails.programJoined = true
        }
      }
    )
  }
  
  showConsentPopup(){}

  cardClick(){
    if(!this.programDetails.programJoined){
      this.joinProgram()
    }
  }

  save(event){
    this.showConsentPopup()
  }

}