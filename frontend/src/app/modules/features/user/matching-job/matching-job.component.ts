import { LabelType, Options } from '@angular-slider/ngx-slider';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { EmployerService } from '@data/service/employer.service';
import { UserSharedService } from '@data/service/user-shared.service';
import { DataService } from '@shared/service/data.service';
import { SharedService } from '@shared/service/shared.service';
import { UtilsHelperService } from '@shared/service/utils-helper.service';
import {PageEvent} from '@angular/material/paginator';

@Component({
  selector: 'app-matching-job',
  templateUrl: './matching-job.component.html',
  styleUrls: ['./matching-job.component.css']
})
export class MatchingJobComponent implements OnInit {

  public isOpenedResumeSelectModal: boolean = false;
  public page: number = 1;
  public limit: number = 10;
  length = 0;
  pageIndex = 1;
  pageSizeOptions = [5, 10, 25];
  showFirstLastButtons = true;
  public postedJobs: any[] = [];
  public nationality: any[] = [];
  public postedJobMeta: any;
  public userInfo: any;
  public currentJobDetails: any;
  public sortByValue: string = 'created_at.desc';
  public experienceFilter: { value: {min: number, max: number}; text: string; }[];
  public queryParams: any = { type: [], sort: ''};
  public minMaxExp: any[] = [];
  public skills: any[] = [];
  public customObject: any = Object;

  public minSalary: number = 30000;
  public maxSalary: number = 300000;
  public options: Options = {
    floor: 30000,
    ceil: 300000,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return "<b>Min:</b> " + value;
        case LabelType.High:
          return "<b>Max:</b> " + value;
        default:
          return "" + value;
      }
    }
  };
  public skillItems: any = {};
  public customParseInt: any = parseInt;
  public cityString: string;
  public skillString: any;
  tempQueryParams: any;

  constructor(
    public sharedService: SharedService,
    private router: Router,
    private route: ActivatedRoute,
    public utilsHelperService: UtilsHelperService,
    private dataService: DataService,
    private employerService: EmployerService,
    private userSharedService: UserSharedService
  ) {
    this.experienceFilter = [
      {value: {min: 0, max: 1}, text: 'Freshers'},
      {value: {min: 1, max: 3}, text: '1 - 3 Years'},
      {value: {min: 3, max: 5}, text: '3 - 5 Years'},
      {value: {min: 5, max: 7}, text: '5 - 7 Years'},
      {value: {min: 7, max: 10}, text: '7 - 10 Years'},
      {value: {min: 10, max: 20}, text: '10 Years & above'}
    ]
    this.route.queryParams.subscribe(params => {
      if(params && !this.utilsHelperService.isEmptyObj(params)) {
        let urlQueryParams = {...params};
        // this.skillString = this.route.snapshot.queryParamMap.get('search');
        this.cityString = this.route.snapshot.queryParamMap.get('city');

        const jobTypes = this.route.snapshot.queryParamMap.get('type');
        if(jobTypes) {
          var jobTypesSplited = new Array();
          jobTypesSplited = jobTypes.split(",");
          if(jobTypesSplited && jobTypesSplited.length) {
            for (let a in jobTypesSplited ) {
              jobTypesSplited[a] = parseInt(jobTypesSplited[a], 10);
            }
            urlQueryParams.type = jobTypesSplited;
          }
        }

        const skillTags = this.route.snapshot.queryParamMap.get('skills');
        if(skillTags) {
          let skillArray = new Array();
          skillArray = skillTags.split(",");
          if(skillArray && skillArray.length) {
            for (let a in skillArray ) {
              skillArray[a] = parseInt(skillArray[a], 10);
            }
            this.skills = skillArray;
          }
        }

        const minExperience = this.route.snapshot.queryParamMap.get('min_experience');
        const maxExperience = this.route.snapshot.queryParamMap.get('max_experience');
        if(parseInt(minExperience) >= 0 && parseInt(maxExperience) >= 0) {
          const tempExp = this.experienceFilter.filter((val) => {
            return ((val.value.min >= parseInt(minExperience)) && (val.value.max <= parseInt(maxExperience)))
          })
          if(tempExp.length) {
            this.minMaxExp = [...tempExp]
          }
        }

        const minSalary = this.route.snapshot.queryParamMap.get('min_salary');
        const maxSalary = this.route.snapshot.queryParamMap.get('max_salary');
        if(minSalary) {
          this.minSalary = parseInt(minSalary);
        }

        if(maxSalary) {
          this.maxSalary = parseInt(maxSalary);
        }

        this.queryParams = {...this.queryParams, ...urlQueryParams };
      }
    });
  }

validateAPI = 0;
  ngOnInit(): void {
	  this.userSharedService.getUserProfileDetails().subscribe(
      response => {
        this.userInfo = response;
		
        if(this.userInfo && this.userInfo.skills && this.userInfo.skills.length && this.validateAPI == 0) {
          
        }
      }
    )
	  this.dataService.getCountryDataSource().subscribe(
		response => {
        if (response && Array.isArray(response) && response.length) {
          this.nationality = response;
		  this.onGetPostedJob();
          this.validateAPI++;
	
        }
      }
    );
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };

    

    this.experienceFilter = [
      {value: {min: 0, max: 1}, text: 'Freshers'},
      {value: {min: 1, max: 3}, text: '1 - 3 Years'},
      {value: {min: 3, max: 5}, text: '3 - 5 Years'},
      {value: {min: 5, max: 7}, text: '5 - 7 Years'},
      {value: {min: 7, max: 10}, text: '7 - 10 Years'},
      {value: {min: 10, max: 20}, text: '10 Years & above'}
    ]

    this.dataService.getSkillDataSource().subscribe(
      response => {
        this.skillItems = response
      }
    );
  }

  ngDoCheck(): void {
    this.tempQueryParams = {...this.queryParams}
  }

  ngOnDestroy(): void {
    this.validateAPI = null;
  }

  onGetPostedJob() {
	  //this.userInfo.authorized_country = this.findCountry(this.userInfo.authorized_country);
    let requestParams: any = {...this.queryParams};
    requestParams.page = this.page;
    requestParams.limit = this.limit;
    requestParams.expand = 'company';
    requestParams.work_authorization = '';
    requestParams.visa_sponsered = false;
	
    if(this.userInfo && this.userInfo.city && this.userInfo.willing_to_relocate == true) {
      requestParams.work_authorization = this.userInfo.work_authorization;
      requestParams.visa_sponsered = this.userInfo.visa_sponsered;
	  
		  requestParams.city = [this.userInfo.city];
	  
	  if(this.userInfo && this.userInfo.preferred_locations) {
			if(this.userInfo.preferred_locations.length !=0) {
				var temp= this.userInfo.preferred_locations.filter(function(a,b){ return a.city!='' && a.city!=null&&a.country!=''&&a.country!=null});
				if(temp.length!=0){
					var tempData=temp.map(function(a,b){ return a.city});
					tempData[tempData.length]=this.userInfo.city;
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
    if(this.userInfo && this.userInfo.country && this.userInfo.willing_to_relocate == true) {
      requestParams.country = [this.userInfo.country];
	  if(this.userInfo && this.userInfo.preferred_locations || this.userInfo.authorized_country ) {
			if(this.userInfo.preferred_locations.length !=0) {
				var temp= this.userInfo.preferred_locations.filter(function(a,b){ return a.city!='' && a.city!=null&&a.country!=''&&a.country!=null});
				if(this.userInfo.authorized_country.length && this.userInfo.authorized_country.length !=0){
					//temp = temp.concat(this.userInfo.authorized_country);
				}
				
				if(temp.length!=0){
					var tempData=temp.map(function(a,b){ return a.country});
					if(tempData.filter(function(a,b){ return a == 'europe'}).length==1){
						var EUCountry =['austria','liechtenstein','belgium','lithuania','czechia',
						'luxembourg','denmark','malta','estonia','etherlands','finland','norway',
						'france','poland','germany','portugal','greece','slovakia','hungary',
						'slovenia','iceland','spain','italy','sweden','latvia','switzerland','reland'
						]
					}
					tempData[tempData.length]=this.userInfo.country;
					tempData =tempData.filter(function(item, pos) {
								return tempData.indexOf(item) == pos;
							})
					if(tempData && tempData.length){
						requestParams.country = tempData.join(',');
					}
				}
			}/* else if(this.userInfo.authorized_country.length && this.userInfo.authorized_country.length !=0){
				
				var temp = this.userInfo.authorized_country ; 
				if(temp.length!=0){
					var tempData=temp.map(function(a,b){ return a.country});
					if(tempData.filter(function(a,b){ return a == 'europe'}).length==1){
						var EUCountry =['austria','liechtenstein','belgium','lithuania','czechia',
						'luxembourg','denmark','malta','estonia','etherlands','finland','norway',
						'france','poland','germany','portugal','greece','slovakia','hungary',
						'slovenia','iceland','spain','italy','sweden','latvia','switzerland','reland'
						]
					}
					tempData[tempData.length]=this.userInfo.country;
					tempData =tempData.filter(function(item, pos) {
								return tempData.indexOf(item) == pos;
							})
					if(tempData && tempData.length){
						requestParams.country = tempData.join(',');
					}
				}
			} */
	  }
    }/* else{
		if(this.userInfo.authorized_country.length && this.userInfo.authorized_country.length !=0){
				
			var temp = this.userInfo.authorized_country ; 
			if(temp.length!=0){
				var tempData=temp.map(function(a,b){ return a.country});
				if(tempData.filter(function(a,b){ return a == 'europe'}).length==1){
					var EUCountry =['austria','liechtenstein','belgium','lithuania','czechia',
					'luxembourg','denmark','malta','estonia','etherlands','finland','norway',
					'france','poland','germany','portugal','greece','slovakia','hungary',
					'slovenia','iceland','spain','italy','sweden','latvia','switzerland','reland'
					]
				}
				tempData[tempData.length]=this.userInfo.country;
				tempData =tempData.filter(function(item, pos) {
							return tempData.indexOf(item) == pos;
						})
				if(tempData && tempData.length){
					requestParams.country = tempData.join(',');
				}
			}
		}
	} */
    
    if(this.userInfo && this.userInfo.skills && this.userInfo.skills.length) {
		var temps = [];
		if(this.userInfo.hands_on_experience && this.userInfo.hands_on_experience.length){
			for(let i=0;i<this.userInfo.hands_on_experience.length;i++){
				if(this.userInfo.hands_on_experience[i]['skill_id']  &&this.userInfo.hands_on_experience[i]['skill_id'] !=''){
					temps.push(this.userInfo.hands_on_experience[i]['skill_id']);
				}
				
			}
			
		}
      requestParams.skills = temps.join(',')
    }

    if(this.queryParams && this.queryParams.skills && this.queryParams.skills.length) {
      const tempSkill = (this.queryParams && this.queryParams.skills) ? this.queryParams.skills.split(',') : [];
      //const tempSkillsMerged = [...this.userInfo.skills, ...tempSkill];
      const tempSkillsMerged = [...tempSkill];
      if(tempSkillsMerged && tempSkillsMerged.length) {
		  if(this.userInfo.hands_on_experience && this.userInfo.hands_on_experience.length){
			for(let i=0;i<this.userInfo.hands_on_experience.length;i++){
				if(this.userInfo.hands_on_experience[i]['skill_id']  &&this.userInfo.hands_on_experience[i]['skill_id'] !=''){
					//tempSkillsMerged.push(this.userInfo.hands_on_experience[i]['skill_id']);
				}
				
			}
			
		}
		  
        const removedDuplicates = tempSkillsMerged.filter( function( item, index, inputArray ) {
          return inputArray.indexOf(item) == index;
        });

        requestParams.skills = removedDuplicates.join(',')
      }

    }
	/* if(!this.route.snapshot.queryParamMap.get('min_experience')) {
      requestParams.min_experience = this.userInfo.experience;
    } */
    if(requestParams.type && requestParams.type.length) {
      requestParams.type = requestParams.type.join(',')
    }else{
		if(this.userInfo && this.userInfo.job_type) {
			requestParams.type = this.userInfo.job_type;
			if(requestParams.type && requestParams.type.length) {
			  requestParams.type = requestParams.type.join(',')
			}
		}
    }

	
    const removeEmpty = this.utilsHelperService.clean(requestParams)

    this.employerService.getPostedJob(removeEmpty).subscribe(
      response => {
        if(response && response.items && response.items.length > 0) {
			this.postedJobs =[];
          this.postedJobs = [...this.postedJobs, ...response.items];
        }
		 this.postedJobMeta = { ...response.meta };
		if(this.postedJobMeta.total){
			this.length = this.postedJobMeta.total;
		}
       
      }, error => {
      }
    )
  }

  onToggleResumeSelectModal = (status, item?) => {
    if(!this.utilsHelperService.isEmptyObj(item)) {
      this.currentJobDetails = item;
    }
    this.isOpenedResumeSelectModal = status;
  }

  onLoadMoreJob = () => {
    this.page = this.page + 1;
    this.onGetPostedJob();
  }

  onSortByValues = (fieldName, value) => {
    if(value != 'undefined' || value != '' || value != null) {
      this.onRedirectRouteWithQuery({[fieldName]: value})
    }else {
      this.onRedirectRouteWithQuery({[fieldName]: ''})
    }
  }

  onFiltertByJobType = (fieldName, value) => {
    if(value != 'undefined') {
		this.page=1;
      if(this.queryParams && Array.isArray(this.queryParams.type)) {
        let index = this.queryParams.type.indexOf(value);
        if(index > -1) {
          this.queryParams.type.splice(index, 1)
        }else {
          this.queryParams.type.push(value)
        }
      }


      if( this.queryParams.type &&  this.queryParams.type.length) {
        this.onRedirectRouteWithQuery({[fieldName]: this.queryParams.type.join(',')})
      }else {
        this.onRedirectRouteWithQuery({[fieldName]: [].toString()})
      }
    }
  }

  onFiltertBySkill = (item) => {
    if(item != 'undefined') {
		this.page=1;
      let index = this.skills.findIndex((element) => {
        return element == item.id;
      });
      if(index > -1) {
        this.skills.splice(index, 1)
      }else {
        this.skills.push(parseInt(item.id))
      }

      if( this.skills &&  this.skills.length) {
        this.onRedirectRouteWithQuery({skills: this.skills.join(',')})
      }else {
        this.onRedirectRouteWithQuery({skills: [].toString()})
      }
    }
  }

  onFiltertByExperience = (item) => {
    if(item != 'undefined') {
		this.page=1;
      let index = this.minMaxExp.findIndex((element) => {
        return ((element.value.min == item.value.min) && (element.value.max == item.value.max))
      });

      if(index > -1) {
        this.minMaxExp.splice(index, 1)
      }else {
        this.minMaxExp.push(item)
      }

      const min = Math.min.apply(null, this.minMaxExp.map(function(item) {
        if(item && item.value && (item.value.min || item.value.min == 0)) {
          return item.value.min;
        }
      }));
      const max = Math.max.apply(null, this.minMaxExp.map(function(item) {
        if(item && item.value && (item.value.max || item.value.max == 0)) {
          return item.value.max;
        }
      }));


      if(this.minMaxExp.length == 0) {
        this.onRedirectRouteWithQuery({min_experience: "", max_experience: ""})
      }

      if((min || min ==0) && max && this.minMaxExp.length) {
        this.onRedirectRouteWithQuery({min_experience: min, max_experience: max})
      }
    }
  }

  onFilterWithSalary = (event) => {
	  this.page=1;
    if(event != 'undefined') {
      this.onRedirectRouteWithQuery({min_salary: event.value, max_salary: event.highValue})
    }else {
      this.onRedirectRouteWithQuery({min_salary: '', max_salary: ''})
    }
  }

  onRedirectRouteWithQuery = (params: any = {}) => {
    this.queryParams = { ...this.queryParams, ...params };
    const removeEmpty = this.utilsHelperService.clean(this.queryParams);

    if(removeEmpty && removeEmpty.type && Array.isArray(removeEmpty.type)) {
      removeEmpty.type = removeEmpty.type.join(',');
    }


    const navigationExtras: NavigationExtras = {
      queryParams: {...removeEmpty}
    };

    this.router.navigate([], navigationExtras);
  }

  onClearFilter = () => {
    const navigationExtras: NavigationExtras = {
      queryParams: {activeTab:'matches'}
    };

    this.router.navigate([], navigationExtras);
    // this.onRedirectRouteWithQuery({activeTab:'matches', 'id': this.selectedJob.id})
  }

  onCheckExpDefault = (item) => {
    if(((item.value.min >= parseInt(this.queryParams.min_experience)) && (item.value.max <= parseInt(this.queryParams.max_experience)))) {
     return true;
    }
    return false;
  }
  
  handlePageEvent(event: PageEvent) {
		//this.length = event.length;
		//this.pageSize = event.pageSize;
		this.page = event.pageIndex+1;
		this.onGetPostedJob();
	}
	
	findCountry(value){
		if(value){
			if(this.nationality){
				var array = this.nationality.filter(f=>{ return value.includes(f.id)})

				if(array.length !=0){
					var temp = array.map(function(a,b){
						return a['nicename'];
					})
					if(temp.length !=0){
						return temp;
					}
				}
			
			}
			
		}
		
		return [];
	}

}

export interface queryParams {
  type: any[];
  min_salary: number;
  max_salary: number;
  skills: any[];
}
