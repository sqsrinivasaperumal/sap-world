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
    userChooseDefaultResume: "/users/choose-default-resume",
    jobPostingCreate: '/jobpostings/create',
    changeJobStatus: '/jobpostings/change-status',
    changeEmployerStatus: '/employers/change-status',
    jobPostingUpdate: '/jobpostings/update',
    skillTagList: '/skill-tags/list',
    countryList: '/country/list',
    languageList: '/language/list',
    employerList: '/employers/list',
    forgotPassword: '/accounts/request-reset-password',
    jobPostingList: '/jobpostings/list',
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
}

module.exports = routes;
