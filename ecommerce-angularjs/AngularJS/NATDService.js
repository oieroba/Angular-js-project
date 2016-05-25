var WebApiUrl = 'http://96.31.91.68/lappws/api/';

// Admin Settings Services

var Key = '';
natApp.factory('TokenKeyService', function ($http) {
    return {
        SetTokanKey: function (key) {
            Key = key;
            return null;
        },
        CheckTokanKey: function () {
            return null;
        },

    };
});

natApp.factory('CouncilInfoService', function ($http) {
    return {
        BoardAuthorityGet: function (Key) {

            return $http.get(WebApiUrl + 'Board/BoardAuthorityGet/' + Key);
        },

        SaveBoardAuthority: function (BoardAuthorityId, StateCode, Name, Code, Acronym, Url, PhysicalAddressLine1, PhysicalAddressLine2, PhysicalAddressCity, PhysicalAddressState, PhysicalAddressZip, IsMailingSameasPhysical, MailingAddressLine1, MailingAddressLine2, MailingAddressCity, MailingAddressState, MailingAddressZip, ContactPhone, ContactEmail, ContactFax, AlternatePhone, IsActive, CreatedBy, CreatedOn, ModifiedBy, ModifiedOn, BoardAuthorityGuid, Key) {

            return $http.post(WebApiUrl + 'Board/BoardAuthoritySave/' + Key + '/', { BoardAuthorityId: BoardAuthorityId, StateCode: StateCode, Name: Name, Code: Code, Acronym: Acronym, Url: Url, PhysicalAddressLine1: PhysicalAddressLine1, PhysicalAddressLine2: PhysicalAddressLine2, PhysicalAddressCity: PhysicalAddressCity, PhysicalAddressState: PhysicalAddressState, PhysicalAddressZip: PhysicalAddressZip, IsMailingSameasPhysical: IsMailingSameasPhysical, MailingAddressLine1: MailingAddressLine1, MailingAddressLine2: MailingAddressLine2, MailingAddressCity: MailingAddressCity, MailingAddressState: MailingAddressState, MailingAddressZip: MailingAddressZip, ContactPhone: ContactPhone, ContactEmail: ContactEmail, ContactFax: ContactFax, AlternatePhone: AlternatePhone, SystemName: null, SystemAbbreviation: null, SystemUrl: null, ApplicationSystemUrl: null, SystemContact: null, IsActive: IsActive, CreatedBy: CreatedBy, CreatedOn: CreatedOn, ModifiedBy: ModifiedBy, ModifiedOn: ModifiedOn, BoardAuthorityGuid: BoardAuthorityGuid });
        },

        GetStateByCountryID: function (Key, ID) {

            return $http.get(WebApiUrl + 'State/StateGetByCountryID/' + Key + '?CountryID=' + ID);
        },
    };
});
natApp.factory('ConfigurationService', function ($http) {
    return {
        //Application Configuration
        GetAllConfigurationList: function (Key) {

            return $http.get(WebApiUrl + 'Configuration/ConfigurationGetAll/' + Key);
        },
        UpdateConfiguration: function (key) {
            return $http.get(WebApiUrl + +key);
        },
        GetConfiguration: function (key) {
            return $http.get(WebApiUrl + +key);
        },
        //Codes
        InsertCode: function (key) {
            return $http.post(WebApiUrl + +key);
        },
        UpdateCode: function (key) {
            return $http.get(WebApiUrl + +key);
        },
        GetCodeList: function (key) {
            return $http.get(WebApiUrl + +key);
        },
        GetCode: function (key) {
            return $http.get(WebApiUrl + +key);
        },
        DeleteCode: function (key) {
            return $http.get(WebApiUrl + +key);
        },
        //DocumentList
        InsertDocument: function (key) {
            return $http.post(WebApiUrl + +key);
        },
        UpdateDocument: function (key) {
            return $http.get(WebApiUrl + +key);
        },
        GetDocumentList: function (key) {
            return $http.get(WebApiUrl + +key);
        },
        GetDocument: function (key) {
            return $http.get(WebApiUrl + +key);
        },
        DeleteDocument: function (key) {
            return $http.get(WebApiUrl + +key);
        },
        //ApplicationStatusColor
        UpdateStatusColor: function (key) {
            return $http.get(WebApiUrl + +key);
        },
        GetStatusColorList: function (key) {
            return $http.get(WebApiUrl + +key);
        },
        GetStatusColor: function (key) {
            return $http.get(WebApiUrl + +key);
        },
        //DeficiencyReason
        InsertDeficiencyReason: function (key) {
            return $http.post(WebApiUrl + +key);
        },
        UpdateDeficiencyReason: function (key) {
            return $http.get(WebApiUrl + +key);
        },
        GetDeficiencyReasonList: function (key) {
            return $http.get(WebApiUrl + +key);
        },
        GetDeficiencyReason: function (key) {
            return $http.get(WebApiUrl + +key);
        },
        DeleteDeficiencyReason: function (key) {
            return $http.get(WebApiUrl + +key);
        }
    };
});
natApp.factory('LoginwemailService', function ($http) {
    return {
        Login: function (Email, Password, LoginWithoutEmail) {

            return $http.post(WebApiUrl + 'User/Login', { Email: Email, Password: Password, LastName: '', AccessCode: '', LicenseNumber: '', LoginWithoutEmail: LoginWithoutEmail });
        },
        ForgetPassword: function (Email) {

            return $http.get(WebApiUrl + 'User/ForgetPassword?Email=' + Email);
        },
    };
});
natApp.factory('LoginwoemailService', function ($http) {
    return {
        Login: function (LastName, AccessCode, LicenseNumber, LoginWithoutEmail) {
            return $http.post(WebApiUrl + 'User/Login', { Email: '', Password: '', LastName: LastName, AccessCode: AccessCode, LicenseNumber: LicenseNumber, LoginWithoutEmail: LoginWithoutEmail });
        },
        ResetAccessCode: function (LastName, SSN, LicenseNumber, key) {
            return $http.post(WebApiUrl + 'User/ResetAccessCode/', { LastName: LastName, SSN: SSN, LicenseNumber: LicenseNumber });
        },
    };

});


natApp.factory('UserAccountService', function ($http) {
    return {
        UsersSearch: function (key, UserName, UserTypeId, FirstName, LastName, Phone, PositionTitle, Email, UserStatusId, SourceId, Gender, IsPending, DateOfBirth, DOB, SourceName, UserTypeName, UserStatusName) {
            return $http.post(WebApiUrl + 'Users/UsersSearch/' + key, { UserName: UserName, UserTypeId: UserTypeId, FirstName: FirstName, LastName: LastName, Phone: Phone, PositionTitle: PositionTitle, Email: Email, UserStatusId: UserStatusId, SourceId: SourceId, Gender: Gender, IsPending: IsPending, DateOfBirth: DateOfBirth, DOB: DOB, SourceName: SourceName, UserTypeName: UserTypeName, UserStatusName: UserStatusName });
        },
        UsersSave: function (UserId, UserName, UserTypeId, FirstName, LastName, Phone, PositionTitle, Email, UserStatusId, SourceId, Gender, IsPending, DateOfBirth, IsDeleted, UserRoles, key) {

            return $http.post(WebApiUrl + 'Users/UsersSave/' + key, { UserId: UserId, UserName: UserName, UserTypeId: UserTypeId, FirstName: FirstName, LastName: LastName, Phone: Phone, PositionTitle: PositionTitle, Email: Email, UserStatusId: UserStatusId, SourceId: SourceId, Gender: Gender, IsPending: IsPending, DateOfBirth: DateOfBirth, IsDeleted: IsDeleted, UserRoles: UserRoles });
        },
        UsersDeletebyID: function (ID, key) {
            return $http.get(WebApiUrl + 'Users/UsersDeletebyID/' + key + '?ID=' + ID);
        },
        UpdateUser: function (key) {
            return $http.get(WebApiUrl + +key);
        },
        UsersGetAll: function (key) {
            return $http.get(WebApiUrl + 'Users/UsersGetAll/' + key);
        },
        UsersGetBYID: function (key, ID) {
            return $http.get(WebApiUrl + 'Users/UsersGetBYID/' + key + '?ID=' + ID);
        },
        UserStatusGetAll: function (key) {

            return $http.get(WebApiUrl + 'Users/UserStatusGetAll/' + key);
        },
        UserTypeGetAll: function (key) {
            return $http.get(WebApiUrl + 'Users/UserTypeGetAll/' + key);
        },
        LookupGetBYLookupTypeID: function (key) {
            return $http.get(WebApiUrl + 'Lookup/LookupGetBYLookupTypeID/' + key + '?LookupTypeID=37');
        },
        RoleGetbyUserTypeId: function (UserTypeId, key) {
            return $http.get(WebApiUrl + 'Role/RoleGetbyUserTypeId/' + key + '?UserTypeId=' + UserTypeId);
        },
        SourceGetAll: function (key) {
            return $http.get(WebApiUrl + 'Source/SourceGetAll/' + key);
        },
        UserRoleGetBYUserID: function (UserId, key) {
            return $http.get(WebApiUrl + 'Users/UserRoleGetBYUserID/' + key + '?UserId=' + UserId);
        },
    };
});

natApp.factory('RolesService', function ($http) {
    return {
        UserRoleGetAll: function (key) {

            return $http.post(WebApiUrl + 'Users/UserRoleGetAll/' + key);
        }
    };
});
natApp.factory('PasswordManagementService', function ($http) {
    return {
        SearchUser: function (key) {

            return $http.post(WebApiUrl + +key);
        },
        GetUserList: function (key) {

            return $http.get(WebApiUrl + +key);
        }
    };
});
natApp.factory('MessageAndBulletinsService', function ($http) {
    return {
        InsertMessage: function (key) {

            return $http.post(WebApiUrl + +key);
        },
        DeleteUser: function (key) {

            return $http.post(WebApiUrl + +key);
        },
        UpdateMessage: function (key) {

            return $http.get(WebApiUrl + +key);
        },
        GetMessageList: function (key) {

            return $http.get(WebApiUrl + +key);
        },
        GetMessage: function (key) {

            return $http.get(WebApiUrl + +key);
        },
    };
});
natApp.factory('ApplicationTextService', function ($http) {
    return {
        InsertInstruction: function (key) {

            return $http.post(WebApiUrl + +key);
        },
        UpdateInstruction: function (key) {

            return $http.get(WebApiUrl + +key);
        },
        GetInstructionList: function (key) {

            return $http.get(WebApiUrl + +key);
        },
        GetInstruction: function (key) {

            return $http.get(WebApiUrl + +key);
        },
    };
});
natApp.factory('EmailTemplateService', function ($http) {

});
natApp.factory('TaskScheduleService', function ($http) {
    return {
        SearchScheduledTask: function (key) {

            return $http.post(WebApiUrl + +key);
        },
        ModifyScheduledTask: function (key) {

            return $http.get(WebApiUrl + +key);
        },
        GetScheduledTaskList: function (key) {

            return $http.get(WebApiUrl + +key);
        },
    };
});
natApp.factory('ExceptionLogService', function ($http) {
    return {
        SearchLog: function (key) {

            return $http.post(WebApiUrl + +key);
        },
        GetLogList: function (key) {

            return $http.get(WebApiUrl + +key);
        },
    };
});

natApp.factory('LicenseRenewalHASnAService', function ($http) {
    return {
        IndividualRenewalSave: function (key, IndividualRenewal) {

            return $http.post(WebApiUrl + 'Renewal/IndividualRenewalSave/' + key, { IndividualRenewal: IndividualRenewal });
        },
        Delete: function (key) {

            return $http.post(WebApiUrl + +key);
        },
        Update: function (key) {

            return $http.get(WebApiUrl + +key);
        },
        GetList: function (key) {

            return $http.get(WebApiUrl + +key);
        },
        IndividualRenewalGet: function (key, IndividualId) {

            return $http.get(WebApiUrl + 'Renewal/IndividualRenewalGet/' + key + '?IndividualId=' + IndividualId);
        },
        ContactTypeGetAll: function (key) {

            return $http.get(WebApiUrl + 'TypeValues/ContactTypeGetAll/' + key);
        },
        GetServerDate: function () {
            return $http.get(WebApiUrl + 'Common/ServerDateTimeGet');
        },
        ApplicationTypeGetAll: function (key) {
            return $http.get(WebApiUrl + 'TypeValues/ApplicationTypeGetAll/' + key);
        },
        LicenseTypeGetAll: function (key) {
            return $http.get(WebApiUrl + 'TypeValues/LicenseTypeGetAll/' + key);
        },
    };
});

natApp.factory('ProcessPaymentService', function ($http) {
    return {
        ProcessPayment: function (key, ApplicationNumber, ApplicationId, IndividualId, CardNumber, CVV, ExpirationMonths, ExpirationYears, Amount, Description, InvoiceNumber, FirstName, LastName, Address, City, StateCode, Zip, Country, EmailAddress, TransactionObject, RequestedLicenseStatusTypeId) {

            return $http.post(WebApiUrl + 'Payment/ProcessPayment/' + key, { ApplicationNumber: ApplicationNumber, ApplicationId: ApplicationId, IndividualId: IndividualId, CardNumber: CardNumber, CVV: CVV, ExpirationMonths: ExpirationMonths, ExpirationYears: ExpirationYears, Amount: Amount, Description: Description, InvoiceNumber: InvoiceNumber, FirstName: FirstName, LastName: LastName, Address: Address, City: City, StateCode: StateCode, Zip: Zip, Country: Country, EmailAddress: EmailAddress, TransactionObject: TransactionObject, RequestedLicenseStatusTypeId: RequestedLicenseStatusTypeId });

        },
        MonthListGet: function (key) {
            return $http.get(WebApiUrl + 'Payment/MonthListGet/' + key);
        },
        YearListGet: function (key) {

            return $http.get(WebApiUrl + 'Payment/YearListGet/' + key);
        },
        GetStateByCountryID: function (Key, ID) {

            return $http.get(WebApiUrl + 'State/StateGetByCountryID/' + Key + '?CountryID=' + ID);
        },
        CountryGetAll: function (key) {

            return $http.get(WebApiUrl + 'Country/CountryGetAll/' + key);
        },
        InitiatePayment: function (key, ApplicationId, IndividualId, IndividualLicenseId, LicenseTypeId, LicenseNumber, TransactionDeviceTy, FeeDetailsList, TransactionObject) {

            return $http.post(WebApiUrl + 'Payment/InitiatePayment/' + key, { ApplicationId: ApplicationId, IndividualId: IndividualId, IndividualLicenseId: IndividualLicenseId, LicenseTypeId: LicenseTypeId, LicenseNumber: LicenseNumber, TransactionDeviceTy: TransactionDeviceTy, FeeDetailsList: FeeDetailsList, TransactionObject: TransactionObject });
        },
    };
}); // Brijesh
// Back Office Services
natApp.factory('BackofficeAutomatedTaskService', function ($http) {

});
natApp.factory('BackofficeLoginstaffService', function ($http) {
    return {
        Login: function (Email, Password) {
            return $http.post(WebApiUrl + '', { Email: Email, Password: Password });
        }
    };
});
natApp.factory('BackofficeDashboardStaffService', function ($http) {
    return {
        UpdateTask: function (key) {

            return $http.get(WebApiUrl + +key);
        },
        GetTaskList: function (key) {

            return $http.get(WebApiUrl + +key);
        },
        GetTask: function (key) {

            return $http.get(WebApiUrl + +key);
        },
        DeleteTask: function (key) {

            return $http.get(WebApiUrl + +key);
        }
    };
});
natApp.factory('BackofficeLicenseRenewalHASnA_BOService', function ($http) {
    return {
        Insert: function (key) {

            return $http.post(WebApiUrl + +key);
        },
        Delete: function (key) {

            return $http.post(WebApiUrl + +key);
        },
        Update: function (key) {

            return $http.get(WebApiUrl + +key);
        },
        GetLicenseeRenewalList: function (key) {

            return $http.get(WebApiUrl + 'Renewal/RenewalGetAll/' + key);
        },
        Get: function (key) {

            return $http.get(WebApiUrl + +key);
        },
    };
});

natApp.factory('DashboardLicenseeService', function ($http) {
    return {
        UpdateAddress: function (key) {

            return $http.post(WebApiUrl + +key);
        }
    };
});

natApp.factory('BackofficeIndividualService', function ($http) {
    return {

        GetStateByCountryID: function (Key, ID) {

            return $http.get(WebApiUrl + 'State/StateGetByCountryID/' + Key + '?CountryID=' + ID);
        },
        CountryGetAll: function (key) {

            return $http.get(WebApiUrl + 'Country/CountryGetAll/' + key);
        },
    };
});

natApp.factory('IndividualDocumentSaveService', function ($http) {
    return {
        IndividualDocumentSave: function (key) {
            debugger;
            return $http.post(WebApiUrl + 'Individual/IndividualDocumentSave/' + key,
                {
                    IndividualId: IndividualId,
                    ApplicationId: ApplicationId,
                    Email: Email,
                    SendEmail: SendEmail,
                    DocumentUploadList: DocumentUploadList
                })
        },
    };
});



