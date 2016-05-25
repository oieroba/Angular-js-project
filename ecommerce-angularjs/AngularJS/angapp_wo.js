var natApp = angular.module('natApp', ['ui.router', 'ui.bootstrap', 'ngSanitize', 'ngCookies']);
natApp.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
         .state('DomainLogin', {
             url: '/',
             //templateUrl: 'Pages/UI_Login/Loginwoemail.html',
             templateUrl: 'Pages/UI_Login/Loginwo.html',
             controller: 'LoginwoController'
         })
        // Admin Setting Start
        .state('UserAccount', {
            url: '/Admin/UserAccount',
            templateUrl: 'Pages/UI_Backoffice/Administration/UserAccount.html',
            controller: 'UserAccountController'
        })
    .state('Roles', {
        url: '/Admin/Roles',
        templateUrl: 'Pages/UI_Backoffice/Administration/Roles.html',
        controller: 'RolesController'
    })
    .state('Configuration', {
        url: '/Admin/Configuration',
        templateUrl: 'Pages/UI_Backoffice/Administration/Configuration.html',
        controller: 'ConfigurationController'
    })
    .state('PasswordManagement', {
        url: '/Admin/PasswordManagement',
        templateUrl: 'Pages/UI_Backoffice/Administration/PasswordManagement.html',
        controller: 'PasswordManagementController'
    })
    .state('MessageAndBulletins', {
        url: '/Admin/MessageAndBulletins',
        templateUrl: 'Pages/UI_Backoffice/Administration/MessageAndBulletins.html',
        controller: 'MessageAndBulletinsController'
    })
    .state('ApplicationText', {
        url: '/Admin/ApplicationText',
        templateUrl: 'Pages/UI_Backoffice/Administration/ApplicationText.html',
        controller: 'ApplicationTextController'
    })
    .state('CouncilInfo', {
        url: '/Admin/CouncilInfo',
        templateUrl: 'Pages/UI_Backoffice/Administration/CouncilInfo.html',
        controller: 'CouncilInfoController'
    })
    .state('EmailTemplate', {
        url: '/Admin/EmailTemplate',
        templateUrl: 'Pages/UI_Backoffice/Administration/EmailTemplate.html',
        controller: 'EmailTemplateController'
    })
    .state('TaskSchedule', {
        url: '/Admin/TaskSchedule',
        templateUrl: 'Pages/UI_Backoffice/Administration/TaskSchedule.html',
        controller: 'TaskScheduleController'
    })
    .state('ExceptionLog', {
        url: '/Admin/ExceptionLog',
        templateUrl: 'Pages/UI_Backoffice/Administration/ExceptionLog.html',
        controller: 'ExceptionLogController'
    })
    // Back Office Start
    .state('BackofficeAutomatedTask', {
        url: '/Backoffice/AutomatedTask',
        templateUrl: 'Pages/UI_Backoffice/UI/AutomatedTask.html',
        controller: 'BackofficeAutomatedTaskController'
    })
     .state('BackofficeDashboardStaff', {
         url: '/Backoffice/DashboardStaff',
         templateUrl: 'Pages/UI_Backoffice/UI/DashboardStaff.html',
         controller: 'BackofficeDashboardStaffController'
     })
     .state('BackofficeIndividual', {
         url: '/Backoffice/Individual',
         templateUrl: 'Pages/UI_Backoffice/UI/Individual.html',
         controller: 'BackofficeIndividualController'
     })
     .state('BackofficeLicenseApplicationAUD_BO', {
         url: '/Backoffice/LicenseApplicationAUD_BO',
         templateUrl: 'Pages/UI_Backoffice/UI/LicenseApplicationAUD_BO.html',
         controller: 'BackofficeLicenseApplicationAUD_BOController'
     })
     .state('BackofficeLicenseApplicationHASnA_BO', {
         url: '/Backoffice/LicenseApplicationHASnA_BO',
         templateUrl: 'Pages/UI_Backoffice/UI/LicenseApplicationHASnA_BO.html',
         controller: 'BackofficeLicenseApplicationHASnA_BOController'
     })
      .state('BackofficeLicenseApplicationSPL_BO', {
          url: '/Backoffice/LicenseApplicationSPL_BO',
          templateUrl: 'Pages/UI_Backoffice/UI/LicenseApplicationSPL_BO.html',
          controller: 'BackofficeLicenseApplicationSPL_BOController'
      })
    .state('BackofficeLicenseRenewalAUD', {
        url: '/Backoffice/LicenseRenewalAUD',
        templateUrl: 'Pages/UI_Backoffice/UI/LicenseRenewalAUD.html',
        controller: 'BackofficeLicenseRenewalAUDController'
    })
    .state('BackofficeLicenseRenewalHASnA_BO', {
        url: '/Backoffice/LicenseRenewalHASnA_BO',
        templateUrl: 'Pages/UI_Backoffice/UI/LicenseRenewalHASnA_BO.html',
        controller: 'BackofficeLicenseRenewalHASnA_BOController'
    })
    .state('BackofficeLicenseRenewalSPL', {
        url: '/Backoffice/LicenseRenewalSPL',
        templateUrl: 'Pages/UI_Backoffice/UI/LicenseRenewalSPL.html',
        controller: 'BackofficeLicenseRenewalSPLController'
    })
     .state('BackofficeLoginstaff', {
         url: '/Backoffice/Loginstaff',
         templateUrl: 'Pages/UI_Backoffice/UI/Loginstaff.html',
         controller: 'BackofficeLoginstaffController'
     })
     .state('BackofficePrintQueue', {
         url: '/Backoffice/PrintQueue',
         templateUrl: 'Pages/UI_Backoffice/UI/PrintQueue.html',
         controller: 'BackofficePrintQueueController'
     })
    // Light Version Pages Start
    .state('Loginwemail', {
        url: '/User/Loginwemail',
        templateUrl: 'Pages/UI_Login/Loginwemail.html',
        controller: 'LoginwemailController'
    })
    .state('Loginwoemail', {
        url: '/User/Loginwoemail',
        templateUrl: 'Pages/UI_Login/Loginwoemail.html',
        controller: 'LoginwoemailController'
    })
    .state('Register', {
        url: '/User/Register',
        templateUrl: 'Pages/UI_Login/Register.html',
        controller: 'RegisterController'
    })
    .state('LicenseApplication', {
        url: '/User/LicenseApplication',
        templateUrl: 'Pages/UI_Individual/Application/LicenseApplication.html',
        controller: 'LicenseApplicationController'
    })
    .state('DashboardApplicant', {
        url: '/User/DashboardApplicant',
        templateUrl: 'Pages/UI_Individual/Dashboard/DashboardApplicant.html',
        controller: 'DashboardApplicantController'
    })
    .state('DashboardLicensee', {
        url: '/User/DashboardLicensee',
        templateUrl: 'Pages/UI_Individual/Dashboard/DashboardLicensee.html',
        controller: 'DashboardLicenseeController'
    })
    .state('LicenseRenewalAUD', {
        url: '/User/LicenseRenewalAUD',
        templateUrl: 'Pages/UI_Individual/Renewal/LicenseRenewalAUD.html',
        controller: 'LicenseRenewalAUDController'
    })
    .state('LicenseRenewalHASnA', {
        url: '/User/LicenseRenewalHASnA',
        templateUrl: 'Pages/UI_Individual/Renewal/RenewalHASnA.html',
        controller: 'RenewalHASnAController'
    })
    .state('LicenseRenewalSPL', {
        url: '/User/LicenseRenewalSPL',
        templateUrl: 'Pages/UI_Individual/Renewal/LicenseRenewalSPL.html',
        controller: 'LicenseRenewalSPLController'
    })
    .state('Payment', {
        url: '/User/Payment',
        templateUrl: 'Pages/UI_Individual/UI/Payment.html',
        controller: 'PaymentController'
    })
    .state('PaymentConformation', {
        url: '/User/PaymentConformation',
        templateUrl: 'Pages/UI_Individual/UI/PaymentConformation.html',
        controller: 'PaymentConformationController'
    });
});
natApp.directive('onFinishRender', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit('ngRepeatFinished');
                });
            }
        }
    }
});

natApp.filter('unsafe', function ($sce) { return $sce.trustAsHtml; });
