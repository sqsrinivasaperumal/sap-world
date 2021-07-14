import { Component, DoCheck, Input, OnDestroy, OnInit } from '@angular/core';
import { CandidateProfile } from '@data/schema/create-candidate';
import { JobPosting } from '@data/schema/post-job';
import { AccountService } from '@data/service/account.service';
import { UtilsHelperService } from '@shared/service/utils-helper.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '@data/service/user.service';

import * as $ from 'jquery';

declare var $: any;

@Component({
  selector: 'app-contact-card',
  templateUrl: './contact-card.component.html',
  styleUrls: ['./contact-card.component.css']
})
export class ContactCardComponent implements OnInit, DoCheck, OnDestroy {

  @Input() userInfo: any;
  @Input() postedJobsMatchDetails: any[] =[];
  @Input() isEdit: boolean;
  @Input() isResume?: boolean;
  @Input() isMail?: boolean = false;
  @Input() isMatch?: boolean = false;
  @Input() isMatchesView?: boolean = true;
  @Input() isContactIcon?: boolean = true;
  @Input() isMultipleMatches?: boolean = false;
  @Input() isUploadShow?: boolean = false;
  @Input() isUploadShowResume?: boolean = false;
  @Input() jobInfo?: JobPosting;

  public isOpenedContactInfoModal: boolean;
  public isOpenedResumeModal: boolean;
  public isOpenedCoverModal: boolean;
  public togglecoverSelectModal: boolean;
  public toggleresumeSelectModal: boolean;
  public isMatchView: boolean =false;
  public randomNum: number;
  public selectedResumeUrl: any;
  public selectedCoverUrl: any;
  public selectedResume: any = {};
  public selectedCover: any = {};
  public validateOnAPI: number = 0;
  public currentUserInfo: CandidateProfile;
  public isOpenedSendMailModal: boolean;
  public accountUserSubscription: Subscription;
  public loggedUserInfo: any;
  public selected: any[]=[];
toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];
  constructor(
    public utilsHelperService: UtilsHelperService,
    private router: Router,
    private userService: UserService,
    private accountService: AccountService
  ) { }

  ngOnInit(): void {
	  
    this.randomNum = Math.random();

    this.accountUserSubscription = this.accountService
      .isCurrentUser()
      .subscribe(response => {
        this.loggedUserInfo = response;
      });
  }

  ngDoCheck(): void {
    if(this.userInfo && this.userInfo.doc_resume && Array.isArray(this.userInfo.doc_resume)) {
      this.selectedResume = this.utilsHelperService.onGetFilteredValue(this.userInfo.doc_resume, 'default', 1);
	  if(!this.selectedResume || this.selectedResume==undefined){
		  this.selectedResume =this.userInfo.doc_resume[0];
	  }
    }
    if(this.userInfo && this.userInfo.doc_cover && Array.isArray(this.userInfo.doc_cover)) {
      this.selectedCover = this.userInfo.doc_cover[0];
    }
  }
ngAfterViewInit(): void {
	setTimeout( async () => {
	
	if(this.isMatch==true){
		this.isMatchView =true;
		$("#selectpicker").selectpicker();		
	}else{
		this.isMatchView =false;
	}
	},500);
	setTimeout( async () => {
	
	if(this.postedJobsMatchDetails.length!=0){
		if(this.isMatch==true){
			this.isMatchView =true;
			$("#selectpicker").selectpicker();		
		}else{
			this.isMatchView =false;
		}	
	}else{
		this.isMatchView =false;
	}
	},2000);
	
	
}
  ngOnDestroy(): void {
	  
    this.validateOnAPI = null;
  }

  onToggleContactInfoModal = (status) => {
    this.isOpenedContactInfoModal = status;
  }

  onToggleResumeForm = (status, selectedResumeUrl?) => {
    if (selectedResumeUrl) {
      this.selectedResumeUrl = selectedResumeUrl;
    }
    this.isOpenedResumeModal = status;
  }

  onToggleCoverForm = (status, selectedCoverUrl?) => {
    if (selectedCoverUrl) {
      this.selectedCoverUrl = selectedCoverUrl;
    }
    this.isOpenedCoverModal = status;
  }

  onToggleSendMail = (status,item?) => {
    if(item && !this.utilsHelperService.isEmptyObj(item)) {
      this.currentUserInfo = item;
    }
    this.isOpenedSendMailModal = status;
  }

  censorWord = (str) => {
    if(str && str.length) {
      return str[0] + "*".repeat(str.length - 2) + str.slice(-1);
    }

  }

 censorEmail = (email) => {
   if(email && email.length) {
    let arr = email.split("@");
      return this.censorWord(arr[0]) + "@" + this.censorWord(arr[1]);
   }
   return "";
 }

 censorPhoneNumber = (str: string) => {
  if(str && str.length) {
    return str.slice(0, 2) + str.slice(2).replace(/.(?=...)/g, '*');
  }
  return "";
 }

 censorEmployer = (str: string) => {
  if(str && str.length) {
    var first = str.substring(0, 1);
    var last = str.substring(str.length - 1);

    let mask = str.substring(1, str.length - 1).replace(/.(?=)/g, '*');

    return first + mask + last;
  }
  return "";
 }

  onTabChange(){
    const navigationExtras = {queryParams:{ activeTab: "matches"}}

    this.router.navigate([], navigationExtras);
  }
	
	OpenMatchesWithID(){
		
		if(this.selected.length!=0){
			var selectedIds = this.selected.join(',');
			this.router.navigate(['/employer/job-multiple-candidate-matches'], { queryParams: {jobId: selectedIds,id: this.userInfo.id,employeeId:this.postedJobsMatchDetails[0].company.id} });
		}
	}
	
	onToggleCoverSelectModal(status){
		if(status==true){
			
			this.userService.profile().subscribe(
			  response => {
				  this.isUploadShow = false;
				if(response['details']){
					this.userInfo = response['details'];
					if(this.userInfo && this.userInfo.doc_cover && Array.isArray(this.userInfo.doc_cover)) {
					  this.selectedCover = this.userInfo.doc_cover[0];
					}
					this.userInfo['meta'] = response['meta'];
				}
			  }, error => {
				//this.modalService.dismissAll();
			  }
			)
			
		}else{
			this.togglecoverSelectModal = false;
			this.isUploadShow = true;
		}
	}
	onToggleResumeSelectModal(status){
		if(status==true){
			
			this.userService.profile().subscribe(
			  response => {
				  this.isUploadShowResume = false;
				if(response['details']){
					this.userInfo = response['details'];
					if(this.userInfo && this.userInfo.doc_resume && Array.isArray(this.userInfo.doc_resume)) {
					  this.selectedResume = this.utilsHelperService.onGetFilteredValue(this.userInfo.doc_resume, 'default', 1);
						if(!this.selectedResume || this.selectedResume==undefined){
							  this.selectedResume =this.userInfo.doc_resume[0];
						 }
					}
					this.userInfo['meta'] = response['meta'];
				}
			  }, error => {
				//this.modalService.dismissAll();
			  }
			)
			
		}else{
			this.toggleresumeSelectModal = false;
			this.isUploadShowResume = true;
		}
	}
	openCoverselect(status){
		if(status==true){
			this.togglecoverSelectModal = true;
		}
		
	}
	openResumselect(status){
		if(status==true){
			this.toggleresumeSelectModal = true;
		}
		
	}
}
