const routes = {
    login: '/oauth/token',
    employerSignup: '/employers/signup',
    userSignup: '/users/signup',
    accountVerify: '/accounts/verify',
    listIndustries: '/industries/list',
    employerProfile: '/employers/profile',
    userProfile: '/users/profile',
    userList: '/users/list',
    userJobScoring: '/jobpostings/job-scoring',
    userScoring: '/jobpostings/user-scoring',
    userView: '/users/view',
    userUpdate: "/users/update",
    updateUserPassword: "/accounts/update-password",
    jobApply: "/jobpostings/apply",
    applicationsListForUser: "/jobpostings/applications/list-for-user",
    applicationsListForEmp: "/jobpostings/applications/list",
    userPhotoUpdate: "/users/update-photo",
    employerPhotoUpdate: "/employers/update-photo",
    userResumeUpdate: "/users/update-doc-resume",
    userResumeDelete: "/users/delete-resume",
    userCoverUpdate: "/users/update-doc-cover",
    userCoverDelete: "/users/delete-cover",
    userChooseDefaultResume: "/users/choose-default-resume",
    jobPostingCreate: '/jobpostings/create',
    changeJobStatus: '/jobpostings/change-status',
    changeEmployerStatus: '/employers/change-status',
    jobPostingUpdate: '/jobpostings/update',
    skillTagList: '/skill-tags/list',
    countryList: '/country/list',
    programList: '/program/list',
    languageList: '/language/list',
    employerList: '/employers/list',
    forgotPassword: '/accounts/request-reset-password',
    jobPostingList: '/jobpostings/list',
    jobPostingListCount: '/jobpostings/list/users/count',
    resetPassword: '/accounts/reset-password',
    jobDelete: '/jobpostings/delete',
    updateCompanyProfile: '/employers/update-company-profile',
    shortListUser: '/jobpostings/applications/short-list-user',
    sendMail: '/jobpostings/send-email',
    saveProfile: '/employers/save-profile',
    savedProfiles: '/employers/saved-profiles',
    jobPostingView: '/jobpostings/view',
    employerProfileView: '/employers/view',
    employerCompanyProfile: '/employers/company-profile',
    employersUpdate: '/employers/update',
    applicationDelete: '/user/application/delete',
    adminDashboardCount: '/admins/list',
    adminProfile: '/admins/profile',
    adminsCreate: '/admins/create',
    adminPhotoUpdate: '/admins/update-photo',
    adminDashboardDetails: '/admins/dashboard-details',
    adminDashboardEmployeeDetails: '/admins/employee-list',
    adminDashboardUserDetails: '/admins/user-list',
    userDashboard: '/users/user-dashboard',
    employerDashboard: '/employers/employers-dashboard',
	
	skillTagFind : '/skill-tags/find',
	skillTagCreates : '/skill-tags/creates',
	skillTagDelete : '/skill-tags/delete',
	skillTagUpdate : '/skill-tags/update',
	skillData : '/skill-tags/data',
	industriesList : 'industries/list',
	industriesCreate : 'industries/create',
	industriesDelete : 'industries/delete',
	industriesUpdate : 'industries/update',
	
	programList : 'program/list',
	programCreate : 'program/create',
	programDelete : 'program/delete',
	programUpdate : 'program/update',

	workauthorizationList : 'workauthorization/list',
	workauthorizationCreate : 'workauthorization/create',
	workauthorizationDelete : 'workauthorization/delete',
	workauthorizationUpdate : 'workauthorization/update',
	
}

module.exports = routes;
