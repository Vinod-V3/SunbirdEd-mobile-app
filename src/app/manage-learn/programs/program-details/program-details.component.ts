import { Component, OnInit } from '@angular/core';
import { AppHeaderService } from '@app/services';
import { LibraryFiltersLayout } from '@project-sunbird/common-consumption';
import { TranslateService } from '@ngx-translate/core';
import { GenericPopUpService } from '../../shared';
import { solutionsList } from './program-details.component.spec.data'

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
  programDetails:any={
    data: solutionsList,
    programJoined:false,
    requestForPIIConsent:true,
    count: 3,
    programName: 'TEST_SCOPE_PROGRAM',
    programId: '5ff438b04698083dbfab7284',
    description: "View and participate in educational programs active in your location and designed for your role."
  }
  solutionsList:any=[]
  filteredList:any=[]
  sharingStatus='ACTIVE'
  endDate=Date()

  constructor(private headerService: AppHeaderService, private translate: TranslateService, private popupService: GenericPopUpService) {
    this.translate.get(['ALL','FRMELEMNTS_LBL_PROJECTS','FRMELEMNTS_LBL_OBSERVATIONS','FRMELEMNTS_LBL_COURSES','FRMELEMNTS_LBL_SURVEYS']).subscribe((translation)=>{
      this.filtersList = Object.keys(translation).map(translateItem => { return translation[translateItem]})
    })
  }

  ngOnInit() {}

  ionViewWillEnter(){
    this.headerConfig = this.headerService.getDefaultPageConfig()
    this.headerConfig.showHeader = true
    this.headerConfig.showBurgerMenu = false
    this.headerConfig.actionButtons = []
    this.headerService.updatePageConfig(this.headerConfig)
    this.readMoreOrLess()
    this.formatList()
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