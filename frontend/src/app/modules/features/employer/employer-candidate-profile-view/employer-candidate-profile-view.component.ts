import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { CandidateProfile } from '@data/schema/create-candidate';
import { JobPosting } from '@data/schema/post-job';
import { EmployerService } from '@data/service/employer.service';
import { UserService } from '@data/service/user.service';
import { SharedService } from '@shared/service/shared.service';
import { UtilsHelperService } from '@shared/service/utils-helper.service';
import { Location } from '@angular/common';
import { EmployerSharedService } from '@data/service/employer-shared.service';
import { DataService } from '@shared/service/data.service';

@Component({
  selector: 'app-employer-candidate-profile-view',
  templateUrl: './employer-candidate-profile-view.component.html',
  styleUrls: ['./employer-candidate-profile-view.component.css']
})
export class EmployerCandidateProfileViewComponent implements OnInit {
	
	/**
	**	Variable declaration
	**/
	
	public isOpenedResumeModal: boolean;
	public isOpenedSendMailModal: boolean;
	public userDetails: CandidateProfile;
	public userID: string;
	public jobId: string;
	public employeeID: any;
	public pathUser: any;
	public postedJobsDetails: JobPosting;
	public postedJobsMatchDetails:any[] =[];
	public nationality: any[] = [];

	constructor(
		private userService: UserService,
		private route: ActivatedRoute,
		public sharedService: SharedService,
		private location: Location,
		private dataService: DataService,
		public utilsHelperService: UtilsHelperService,
		private employerService: EmployerService,
		private employerSharedService: EmployerSharedService,
		private router: Router
	) {
		
		this.route.queryParams.subscribe(params => {
			if(params && !this.utilsHelperService.isEmptyObj(params)) {
				let urlQueryParams = {...params};
				if(urlQueryParams && urlQueryParams.jobId) {
					sessionStorage.setItem('jobId',urlQueryParams.jobId);
				}
				if(urlQueryParams && urlQueryParams.id) {
					sessionStorage.setItem('userId',urlQueryParams.id);
				}
				if(urlQueryParams && urlQueryParams.employee) {
					sessionStorage.setItem('employeeID',urlQueryParams.employee);
				}
				if(urlQueryParams.path){
					sessionStorage.setItem('view-user-path',urlQueryParams.path);
					this.router.navigate([], {queryParams: {path: null}, queryParamsHandling: 'merge'});
				}
			}
		});	 
		var jobIds:any=0;
		var userIds:any=0;
		if(sessionStorage.getItem('jobId')){
			jobIds = parseInt(sessionStorage.getItem('jobId'));
		}if(sessionStorage.getItem('userId')){
			userIds = parseInt(sessionStorage.getItem('userId'));
		}if(sessionStorage.getItem('employeeID')){
			this.employeeID = parseInt(sessionStorage.getItem('employeeID'));
		}
		this.jobId = jobIds;
		this.userID = userIds;
		this.router.navigate([], {queryParams: {id: null,jobId:null,path:null,employee:null}, queryParamsHandling: 'merge'});
	}
	
	/**
	**	When page init call after the page loads
	**/
	
	ngOnInit(): void {
		this.dataService.getCountryDataSource().subscribe(
			response => {
				if (response && Array.isArray(response) && response.length) {
					this.nationality = response;
				}
			}
		);
		if(this.userID) {
			this.onGetCandidateInfo();
		}
		if(this.jobId) {
			this.onGetPostedJob();
		}
	}
	
	/**
	**	Click the back Button 
	**	Route navigation path assigning
	**/
	
	onRedirectBack = () => {
		//this.location.back();
		if(sessionStorage.getItem('view-user-path')=='applicants'){
			this.router.navigate(['/employer/dashboard'], {queryParams: {activeTab: 'applicants'}});
		}else if(sessionStorage.getItem('view-user-path')=='savedprofile'){
			this.router.navigate(['/employer/dashboard'], {queryParams: {activeTab: 'savedProfile'}});
		}else{
			this.router.navigate(['/employer/job-candidate-matches/details/view'], { queryParams: {jobId: this.jobId, userId: this.userID} });
		}
	}
	
	/**
	**	To get the posted job details
	**/
	
	onGetPostedJob() {
		let requestParams: any = {};
		requestParams.expand = 'company';
		requestParams.id = this.jobId;
		this.employerService.getPostedJobDetails(requestParams).subscribe(
			response => {
				if (response && response.details) {
					this.postedJobsDetails = response.details;
					if(response['details']['company']){
						if(response['details']['company']['id']){
							if(!this.employeeID ){
								this.employeeID = response['details']['company']['id'];
								this.onGetPostedJobs(response['details']['company']['id']);
							}
						}else{
							if(this.employeeID){
								// this.onGetPostedJobs(this.employeeID);
							}
						} 
					}else{
						if(this.employeeID){
							//this.onGetPostedJobs(this.employeeID);
						}
					}
				}
			}, error => {
			}
		)
	}

	/**
	**	To get the matched job candidate lists
	**/
	
	onGetCandidateInfo() {
		let requestParams: any = {};
		requestParams.id = this.userID;
		this.userService.profileView(requestParams).subscribe(
			response => {
				if(response && response.details) {
					this.userDetails = {...response.details, meta: response.meta};
					if(this.employeeID){
						this.onGetPostedJobs(this.employeeID);
					}
					if(sessionStorage.getItem('view-user-path')=='savedprofile'){
						if(sessionStorage.getItem('employeeID')){
							this.onGetPostedJobs(this.employeeID);
						}
					}
				}
			}, error => {
			}
		)
	}

	/**
	**	To assign the resume popup status
	**/
	
	onToggleResumeForm = (status) => {
		this.isOpenedResumeModal = status;
	}

	/**
	**	To assign send mail Status Assign
	**/
	
	onToggleSendMail = (status) => {
		this.isOpenedSendMailModal = status;
	}
	
	/**
	**	To get the posted job details
	**	Matched for the user details
	**/

	onGetPostedJobs(companyId) {
		let requestParams: any ={};
		requestParams.page = 1;
		requestParams.limit = 1000;
		requestParams.expand = 'company';
		requestParams.company = companyId;
		requestParams.skills_filter = 'false';
		requestParams.work_authorization = '';
		requestParams.visa_sponsered = false;
	if(this.userDetails && this.userDetails.city ){
			requestParams.city = this.userDetails.city;
			requestParams.country = this.userDetails.country;
		}
		if(this.userDetails && this.userDetails.city && this.userDetails.willing_to_relocate == true ) {
			requestParams.work_authorization = this.userDetails.work_authorization;
			requestParams.visa_sponsered = this.userDetails.visa_sponsered;
			requestParams.city = [this.userDetails.city];
			if(this.userDetails && this.userDetails.preferred_locations) {
				if(this.userDetails.preferred_locations.length !=0) {
					var temp:any[]= this.userDetails.preferred_locations.filter(function(a,b){ return a.city!='' && a.city!=null&&a.country!=''&&a.country!=null});
					if(temp.length!=0){
						var tempData=temp.map(function(a,b){ return a.city});
						tempData[tempData.length]=this.userDetails.city;
						tempData =tempData.filter(function(item, pos) {
							return tempData.indexOf(item) == pos;
						})
						if(tempData && tempData.length){
							requestParams.city = tempData.join(',');
						}
					}
				}
			}
		}
		if(this.userDetails && this.userDetails.country && this.userDetails.willing_to_relocate == true ) {
			requestParams.country = [this.userDetails.country];
			if(this.userDetails && this.userDetails.preferred_locations ) {
				if(this.userDetails.preferred_locations.length !=0) {
					var temp:any[]= this.userDetails.preferred_locations.filter(function(a,b){ return a.city!='' && a.city!=null&&a.country!=''&&a.country!=null});
						if(temp.length!=0){
							var temp=temp.map(function(a,b){ return a.country});
						}
						if( this.userDetails.authorized_country && this.userDetails.authorized_country.length && this.userDetails.authorized_country.length !=0){
							var authorized_countrys= this.nationality.filter((el) => {
								return this.userDetails.authorized_country.some((f) => {
									return f === el.id ;
								});
							});
							if(authorized_countrys.length !=0){
								authorized_countrys = authorized_countrys.map(function(a,b){ return a.nicename.toLowerCase()});
								//temp = temp.concat(authorized_countrys);
							}
						}
						if(temp.length!=0){
							var tempData=temp;
							if(tempData.filter(function(a,b){ return a == 'europe'}).length==1){
								var EUCountry =['austria','liechtenstein','belgium','lithuania','czechia',
								'luxembourg','denmark','malta','estonia','etherlands','finland','norway',
								'france','poland','germany','portugal','greece','slovakia','hungary',
								'slovenia','iceland','spain','italy','sweden','latvia','switzerland','reland'
								]
								tempData = tempData.concat(EUCountry);
							}
							//tempData[tempData.length]=this.userDetails.country;
							tempData =tempData.filter(function(item, pos) {
								return tempData.indexOf(item) == pos;
							})
							if(tempData && tempData.length){
								requestParams.country = tempData.join(',');
							}
						}
					} else if(this.userDetails.authorized_country && this.userDetails.authorized_country.length && this.userDetails.authorized_country.length !=0){
						var authorized_countrys= this.nationality.filter((el) => {
							return this.userDetails.authorized_country.some((f) => {
								return f === el.id ;
							});
						});
						if(authorized_countrys.length !=0){
							authorized_countrys = authorized_countrys.map(function(a,b){ return a.nicename.toLowerCase()});
						}
						var temp:any[] = authorized_countrys ; 
						if(temp.length!=0){
							var tempData=temp;
							if(tempData.filter(function(a,b){ return a == 'europe'}).length==1){
								var EUCountry =['austria','liechtenstein','belgium','lithuania','czechia',
								'luxembourg','denmark','malta','estonia','etherlands','finland','norway',
								'france','poland','germany','portugal','greece','slovakia','hungary',
								'slovenia','iceland','spain','italy','sweden','latvia','switzerland','reland'
								]
								tempData = tempData.concat(EUCountry);
							}
							tempData[tempData.length]=this.userDetails.country;
							tempData =tempData.filter(function(item, pos) {
								return tempData.indexOf(item) == pos;
							})
							if(tempData && tempData.length){
								requestParams.country = tempData.join(',');
							}
						}
					} 
				}
			} else{
			if(this.userDetails && this.userDetails.authorized_country && this.userDetails.authorized_country.length && this.userDetails.authorized_country.length !=0){
				var authorized_countrys= this.nationality.filter((el) => {
					return this.userDetails.authorized_country.some((f) => {
						return f === el.id ;
					  });
				});
				if(authorized_countrys.length !=0){
					authorized_countrys = authorized_countrys.map(function(a,b){ return a.nicename.toLowerCase()});
				}
				var temp:any[] = authorized_countrys ; 
				if(temp.length!=0){
					var tempData=temp;
					if(tempData.filter(function(a,b){ return a == 'europe'}).length==1){
						var EUCountry =['austria','liechtenstein','belgium','lithuania','czechia',
						'luxembourg','denmark','malta','estonia','etherlands','finland','norway',
						'france','poland','germany','portugal','greece','slovakia','hungary',
						'slovenia','iceland','spain','italy','sweden','latvia','switzerland','reland'
						]
						tempData = tempData.concat(EUCountry);
					}
					tempData[tempData.length]=this.userDetails.country;
					tempData =tempData.filter(function(item, pos) {
						return tempData.indexOf(item) == pos;
					})
					if(tempData && tempData.length){
						requestParams.country = tempData.join(',');
					}
				}
			}
		} 
		if(this.userDetails && this.userDetails.skills && this.userDetails.skills.length) {
			var temps = [];
			if(this.userDetails.hands_on_experience && this.userDetails.hands_on_experience.length){
				for(let i=0;i<this.userDetails.hands_on_experience.length;i++){
					if(this.userDetails.hands_on_experience[i]['skill_id']  &&this.userDetails.hands_on_experience[i]['skill_id'] !=''){
						temps.push(this.userDetails.hands_on_experience[i]['skill_id']);
					}
				}
			}
			requestParams.skills = temps.join(',')
			requestParams.skills_filter = 'false';
		}	
		if(this.userDetails && this.userDetails.job_type) {
			if(this.userDetails.job_type && this.userDetails.job_type['length']) {
				requestParams.type = this.userDetails.job_type['join'](',')
			}
		}
		if(this.userDetails && this.userDetails.experience) {
			requestParams.max_experience = this.userDetails.experience;
		}	
		const removeEmpty = this.utilsHelperService.clean(requestParams)
		this.employerService.getPostedJob(removeEmpty).subscribe(
			response => {
				if(response && response.items && response.items.length > 0) {
					this.postedJobsMatchDetails=response.items;
				}       
			}, error => {
			}
		)
	}
  
}
