/// <reference path="../Modules/UI_Backoffice/UI/ucLicenseRenewalHASnA_BO_BC.html" />
natApp.controller("GlobalController", function ($scope, $controller, ConfigurationService, $filter) {
    $scope.$on('$viewContentLoaded', function () {
        $.getScript("/Styles/JS/validation.js", function (data, textStatus, jqxhr) {
            //Validation.js file is loaded after content is loaded in ui view
        });
    });

    $scope.isSessionActive = function () {
        if (sessionStorage.Key == "" || sessionStorage.Key == undefined || sessionStorage.Key == "undefined") {
            // $scope.logout();
            return false;
        }
        else {
            return true;
        }
    };

    $scope.CheckResponse = function (response) {
        if (response.StatusCode == 04 && response.ResponseReason == null) {
            showStatusMessage(response.Message, "error");
        }
        else if (response.StatusCode == 03 && response.ResponseReason == null) {
            sessionStorage.Key = "";
            sessionStorage.URL = window.location.href;
            window.location.href = '#/User/Loginwoemail';
        }
        else if (response.StatusCode == 02 && response.ResponseReason == null) {
            showStatusMessage(response.Message, "error");
        }
        else if (response.StatusCode == 01 && response.ResponseReason != null) {
            showStatusMessage(JSON.parse(response.ResponseReason)[0].Message, "error");
        }
        else if (response.StatusCode == 00 && response.ResponseReason == null) {
            return true;
        }
        else {
            return false;
        }
    };

    $scope.Key;

    $scope.logout = function (flag) {
        sessionStorage.Key = "";
        if (flag == "Applicant") {
            window.location.href = '#/User/Loginwemail';
        }
        else if (flag == "Licensee") {
            window.location.href = '#/User/Loginwoemail';
        }
        else if (flag == "Staff") {
            window.location.href = '#/Backoffice/Loginstaff';
        }
    };

    $scope.getAllConfiguration = function () {
        try {
            ShowLoader("Loading...");
            ConfigurationService.ConfigurationGetAll(sessionStorage.Key)
			.success(function (response) {

			    if ($scope.CheckResponse(response)) {

			    } else {

			        //else of CheckResponse
			    }
			    HideLoader();
			})
			.error(function (data) {

			    HideLoader();
			    showStatusMessage(data.message, "error");
			});
        }
        catch (ex) {
            HideLoader();
            showStatusMessage(ex.message, "error");
        }
    };
    $scope.getConfigurationBYID = function (ID) {
        try {
            ShowLoader("Loading...");
            ConfigurationService.ConfigurationGetBYID(sessionStorage.Key, ID)
			.success(function (response) {

			    if ($scope.CheckResponse(response)) {

			    } else {

			        //else of CheckResponse
			    }
			    HideLoader();
			})
			.error(function (data) {

			    HideLoader();
			    showStatusMessage(data.message, "error");
			});
        }
        catch (ex) {
            HideLoader();
            showStatusMessage(ex.message, "error");
        }
    }

});

natApp.controller("HeaderController", function ($scope, $controller) {
    $controller('GlobalController', { $scope: $scope });
    $scope.init = function () {
        $scope.getAllConfiguration();
    }
});

natApp.controller("HeaderLicenseeController", function ($scope, $controller) {
    $controller('GlobalController', { $scope: $scope });
});

natApp.controller("HeaderApplicantController", function ($scope, $controller) {
    $controller('GlobalController', { $scope: $scope });
});

// Admin Settings Controllers
natApp.controller("UserAccountController", function ($scope, $controller, UserAccountService, RolesService) {
    $controller('GlobalController', { $scope: $scope });
    // Variables
    $scope.Type;
    $scope.Role = [];;
    $scope.Status;
    $scope.UserId = "";
    $scope.UserRoleID = "";
    $scope.UserName = "";
    $scope.Email = "";
    $scope.Pending;
    $scope.LastName = "";
    $scope.FirstName = "";
    $scope.PositionTitle = "";
    $scope.Phone = "";
    $scope.IsPendingID = "";
    $scope.DOB = "";
    $scope.Role = "";
    $scope.ChangePassword = false;
    $scope.Password = "";
    $scope.RepeatPassword = "";
    $scope.SourceID = "";
    $scope.IsPending = [{ status: true }, { status: false }];
    $scope.UserType = [];
    $scope.UserStatus = [];
    $scope.Gender = [];
    $scope.RoleList = [];

    // page init method
    $scope.init = function () {
        HideLoader();
        if ($scope.isSessionActive()) {
            angular.element(document.querySelector("#searchdata")).show();
            angular.element(document.querySelector("#newuser")).hide();
            angular.element(document.querySelector("#passrule")).hide();
            angular.element(document.querySelector("#Userac_footer")).hide();
            angular.element(document.querySelector("#changePass")).hide();
            angular.element(document.querySelector("#ua")).hide();
            $scope.getUserList();
            $scope.userTypeGetAll();
            $scope.userStatusGetAll();
            $scope.lookupGetBYLookupTypeID();
            $scope.sourceGetAll();
        }
        else {
            window.location.href = "#/Backoffice/Loginstaff";
        }
    }

    // Search user
    $scope.searchUser = function () {
        try {
            ShowLoader("Please wait...");
            UserName = $scope.SearchUserName;
            UserTypeId = $scope.SearchUserTypeID;
            FirstName = "";
            LastName = $scope.SearchLastName;
            Phone = null;
            PositionTitle = null;
            Email = $scope.SearchEmail;
            UserStatusId = $scope.SearchStatusID;
            SourceId = null;
            Gender = "";
            IsPending = $scope.SearchIsPending;
            DateOfBirth = null;
            DOB = null;
            SourceName = null;
            UserTypeName = $("#ddlUserType").val();
            UserStatusName = $("#ddlStatus").val();
            UserAccountService.UsersSearch(sessionStorage.Key, UserName, UserTypeId, FirstName, LastName, Phone, PositionTitle, Email, UserStatusId, SourceId, Gender, IsPending, DateOfBirth, DOB, SourceName, UserTypeName, UserStatusName)
					.success(function (response) {
					    if ($scope.CheckResponse(response)) {
					        HideLoader();
					        $scope.UserList = response.Users;
					    } else {
					        alert("session expired");
					    }
					})
					.error(function (data) {
					    HideLoader();
					    showStatusMessage(data, "error");
					});
        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
        HideLoader();
    }

    // Save & Update user
    $scope.saveUser = function (status) {
        hideStatusMessage();
        try {
            ShowLoader("Please wait...");
            if ($scope.isSessionActive()) {

                if (validateData('UI_BackofficeAdministrationUserAccountvalidation') && $scope.validateRole()) {
                    UserName = $scope.UserName;
                    UserTypeId = $scope.UserTypeID;
                    FirstName = $scope.FirstName
                    LastName = $scope.LastName;
                    Phone = $scope.Phone;
                    PositionTitle = $scope.PositionTitle;
                    Email = $scope.Email;
                    UserStatusId = $scope.UserStatusID;
                    SourceId = $scope.SourceID;
                    IsPending = $scope.IsPendingID;
                    Gender = $scope.GenderID;
                    DateOfBirth = $("#txtDateOfBirth").val();
                    if (status == 0) {
                        UserId = 0;
                        IsDeleted = false;
                    }
                    else if (status == 1) {
                        UserId = $scope.UserId;
                        IsDeleted = false;
                    }
                    else if (status == 2) {
                        UserId = $scope.UserId;
                        IsDeleted = true;
                    }
                    UserRoles = $scope.RoleList;

                    UserAccountService.UsersSave(UserId, UserName, UserTypeId, FirstName, LastName, Phone, PositionTitle, Email, UserStatusId, SourceId, Gender, IsPending, DateOfBirth, IsDeleted, UserRoles, sessionStorage.Key)
                            .success(function (response) {
                                if ($scope.CheckResponse(response)) {
                                    showStatusMessage(response.Message, "success");
                                    $scope.getUserList();
                                    $scope.clearData();
                                    angular.element(document.querySelector("#searchdata")).show();
                                    angular.element(document.querySelector("#newuser")).hide();
                                } else {
                                    //else of CheckResponse
                                }
                                HideLoader();
                            })
                            .error(function (data) {
                                showStatusMessage(data.message, "error");
                            });
                }
            }
        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
        HideLoader();
    }

    // Delete user
    $scope.deleteUser = function (Id, Name) {
        try {

            $scope.UserId = Id;
            //var r = confirm("Are you Sure to Delete User " + Name);
            //if (r == true) {
            try {
                UserAccountService.UsersDeletebyID(Id, sessionStorage.Key)
                        .success(function (response) {
                            if ($scope.CheckResponse(response)) {
                                showStatusMessage(response.Message, "success");
                                $scope.getUserList();
                            } else {
                                // else of CheckResponse
                            }
                        })
                        .error(function (data) {
                            showStatusMessage(data, "error");
                        });
            }
            catch (ex) {
                showStatusMessage(ex.message, "error");
            }
            //}
        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }

    // Get User Detail by UserId
    $scope.getUser = function (ID) {
        try {
            ShowLoader("Please wait...");
            resetValidation();
            hideStatusMessage();
            hideValidationSummary();
            UserAccountService.UsersGetBYID(sessionStorage.Key, ID)
			.success(function (response) {
			    if ($scope.CheckResponse(response)) {
			        HideLoader();
			        angular.element(document.querySelector("#newuser")).show();
			        angular.element(document.querySelector("#changePass")).show();
			        angular.element(document.querySelector("#Userac_footer")).show();
			        angular.element(document.querySelector("#ua")).show();
			        angular.element(document.querySelector("#ca")).hide();
			        angular.element(document.querySelector("#passrule")).hide();
			        angular.element(document.querySelector("#searchdata")).hide();
			        Users = response.Users;

			        $scope.LastName = Users[0].LastName;
			        $scope.FirstName = Users[0].FirstName;
			        $scope.Email = Users[0].Email;
			        $scope.UserName = Users[0].UserName;
			        $scope.UserStatusID = Users[0].UserStatusId;
			        $scope.UserTypeID = Users[0].UserTypeId;
			        $scope.PositionTitle = Users[0].PositionTitle;
			        $scope.Phone = Users[0].Phone;
			        $scope.IsPendingID = Users[0].IsPending;
			        $scope.GenderID = Users[0].Gender;
			        $scope.DOB = Users[0].DateOfBirth;
			        $scope.userRoleGetBYUserID(ID);
			        $scope.UserId = ID;

			    } else {
			        // Else of CheckResponse Method
			    }
			})
				.error(function (data) {
				    showStatusMessage(data, "error");
				});
        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }

    // Get User List
    $scope.getUserList = function () {
        try {
            UserAccountService.UsersGetAll(sessionStorage.Key)
					.success(function (response) {
					    if ($scope.CheckResponse(response)) {
					        $scope.UserList = response.Users;
					        HideLoader();
					    } else {
					        alert("session expired");
					        HideLoader();
					    }
					})
					.error(function (data) {
					    HideLoader();
					    showStatusMessage(data, "error");
					});
        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
            HideLoader();
        }
    }

    // Get User Role List
    $scope.getUserRoleList = function () {
        try {
            RolesService.UserRoleGetAll(sessionStorage.Key)
					.success(function (response) {
					    if ($scope.CheckResponse(response)) {
					        $scope.RoleList = response.UserRole;
					    } else {
					        alert("session expired");
					    }
					})
					.error(function (data) {
					    showStatusMessage(data, "error");
					});
        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }

    // Get UserType List
    $scope.userTypeGetAll = function () {
        try {
            UserAccountService.UserTypeGetAll(sessionStorage.Key)
					.success(function (response) {
					    if ($scope.CheckResponse(response)) {
					        $scope.UserType = response.UserType;

					    } else {
					        alert("session expired");
					    }
					})
					.error(function (data) {
					    showStatusMessage(data, "error");
					});
        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }

    // Get UserStatus List
    $scope.userStatusGetAll = function () {
        try {
            UserAccountService.UserStatusGetAll(sessionStorage.Key)
					.success(function (response) {
					    if ($scope.CheckResponse(response)) {
					        $scope.UserStatus = response.UserStatus;

					    } else {
					        alert("session expired");
					    }
					})
					.error(function (data) {
					    showStatusMessage(data, "error");
					});
        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }

    // Get Lookup List for Gender
    $scope.lookupGetBYLookupTypeID = function () {
        try {
            UserAccountService.LookupGetBYLookupTypeID(sessionStorage.Key)
					.success(function (response) {
					    if ($scope.CheckResponse(response)) {
					        $scope.Gender = response.Lookup;

					    } else {
					        alert("session expired");
					    }
					})
					.error(function (data) {
					    showStatusMessage(data, "error");
					});
        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }

    // Get RoleList by UserTypeId
    $scope.roleGetbyUserTypeId = function (UserTypeId) {
        hideStatusMessage();
        if (UserTypeId != null && UserTypeId != "" && UserTypeId != "undefined") {
            try {
                UserAccountService.RoleGetbyUserTypeId(UserTypeId, sessionStorage.Key)
                        .success(function (response) {
                            if ($scope.CheckResponse(response)) {
                                $scope.Role = response.Role;
                                $scope.RoleList = [];
                                angular.forEach($scope.Role, function (value, index) {
                                    record = angular.fromJson($scope.Role[index]);
                                    $scope.RoleList.push({ UserID: 0, UserRoleID: 0, RoleId: record.RoleId, Selected: false, Grantable: false });
                                });
                            } else {
                                //else of CheckResponse method
                            }
                        })
                        .error(function (data) {
                            showStatusMessage(data.Message, "error");
                        });
            }
            catch (ex) {
                showStatusMessage(ex.message, "error");
            }
        }
    }

    // Get User Role List by UserID
    $scope.userRoleGetBYUserID = function (UserId) {
        hideStatusMessage();

        if (UserId != null && UserId != "" && UserId != "undefined") {
            try {
                UserAccountService.UserRoleGetBYUserID(UserId, sessionStorage.Key)
                        .success(function (response) {
                            if ($scope.CheckResponse(response)) {
                                $scope.R = response.UserRole;
                                $scope.RoleList = [];
                                $scope.Role = [];
                                angular.forEach($scope.R, function (value, index) {


                                    record = angular.fromJson($scope.R[index]);
                                    $scope.Role.push({ RoleId: record.RoleID, Name: record.Role, Selected: record.Selected, Grantable: record.Grantable });
                                    $scope.RoleList.push({ UserID: UserId, UserRoleID: record.UserRoleID, RoleId: record.RoleID, Selected: record.Selected, Grantable: record.Grantable });
                                    //$scope.RoleList.push({ UserID: 0, UserRoleID: 0, RoleId: record.RoleId, Selected: false, Grantable: false });
                                });
                            } else {
                                //else of CheckResponse method
                            }
                        })
                        .error(function (data) {
                            showStatusMessage(data, "error");
                        });
            }
            catch (ex) {
                showStatusMessage(ex.message, "error");
            }
        }
    }

    // Get Source List
    $scope.sourceGetAll = function () {
        try {
            UserAccountService.SourceGetAll(sessionStorage.Key)
					.success(function (response) {
					    if ($scope.CheckResponse(response)) {
					        $scope.SourceID = response.Source[0].SourceId;
					    } else {
					        //else of CheckResponse method
					    }
					})
					.error(function (data) {
					    showStatusMessage(data, "error");
					});
        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }

    // Select UserRole Checkbox
    $scope.isSelected = function (Id, status) {
        //var statu;
        if ($scope.UserId == "" || $scope.UserId == null) {
            $scope.UserId = 0;
        }
        for (var i = 0; i < $scope.RoleList.length; i++) {
            if ($scope.RoleList[i].RoleId == Id) {
                $scope.RoleList[i].UserID = $scope.UserId;
                if (status == 1) {
                    if ($scope.RoleList[i].Selected == true) {
                        $scope.RoleList[i].Selected = false;
                    }
                    else {
                        $scope.RoleList[i].Selected = true;
                    }
                }
                else if (status == 2) {
                    if ($scope.RoleList[i].Grantable == true) {
                        $scope.RoleList[i].Grantable = false;
                    }
                    else {
                        $scope.RoleList[i].Grantable = true;
                    }
                }
                break;
            }
        }
        //return statu;
    };

    // Clear the All element
    $scope.clearData = function () {
        try {
            // New User Control
            $scope.LastName = "";
            $scope.FirstName = "";
            $scope.PositionTitle = "";
            $scope.Phone = "";
            $scope.DOB = "";
            $scope.GenderID = "";
            $scope.IsPendingID = "";
            $scope.Role = [];
            $scope.Email = "";
            $scope.UserName = "";
            $scope.UserStatusID = "";
            $scope.UserTypeID = "";

            //Search Control
            $scope.SearchUserTypeID = "";
            $scope.SearchRoleID = "";
            $scope.SearchStatusID = "";
            $scope.SearchLastName = "";
            $scope.SearchUserName = "";
            $scope.SearchEmail = "";
            $scope.SearchIsPending = "";
        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }

    // Cancle Button
    $scope.canclePage = function () {

        resetValidation();
        hideStatusMessage();
        hideValidationSummary();
        $scope.getUserList();
        $scope.clearData();
    }

    // Check Role selected or not
    $scope.validateRole = function () {

        var flag = false;
        for (var i = 0; i < $scope.RoleList.length; i++) {
            if ($scope.RoleList[i].Selected == true || $scope.RoleList[i].Grantable == true) {
                return true;
            }
            else {
                flag = true;
            }
        }
        if (flag == true || $scope.RoleList.length <= 0) {
            showStatusMessage("Role is Required", "error");
            return false;
        }
    }

    angular.element(document.querySelector("#btnNewUser")).click(function () {
        ShowLoader("Please wait...");
        HideLoader();
        resetValidation();
        hideStatusMessage();
        hideValidationSummary();
        angular.element(document.querySelector("#searchdata")).hide();
        angular.element(document.querySelector("#newuser")).show();
        angular.element(document.querySelector("#passrule")).show();
        angular.element(document.querySelector("#Userac_footer")).show();
        angular.element(document.querySelector("#changePass")).hide();
        angular.element(document.querySelector("#ua")).hide();
        angular.element(document.querySelector("#ca")).show();
    })
    angular.element(document.querySelector("#Search")).click(function () {
        ShowLoader("Please wait...");
        HideLoader();
        resetValidation();
        hideStatusMessage();
        hideValidationSummary();
        angular.element(document.querySelector("#searchdata")).show();
        angular.element(document.querySelector("#newuser")).hide();
        angular.element(document.querySelector("#passrule")).hide();
        angular.element(document.querySelector("#Userac_footer")).hide();
        angular.element(document.querySelector("#changePass")).hide();
        angular.element(document.querySelector("#ua")).hide();
    });
    angular.element(document.querySelector("#cancel")).click(function () {
        ShowLoader("Please wait...");
        HideLoader();
        resetValidation();
        hideStatusMessage();
        hideValidationSummary();
        angular.element(document.querySelector("#searchdata")).show();
        angular.element(document.querySelector("#newuser")).hide();
        angular.element(document.querySelector("#passrule")).hide();
        angular.element(document.querySelector("#Userac_footer")).hide();
        angular.element(document.querySelector("#changePass")).hide();
        angular.element(document.querySelector("#ua")).hide();
    });
    angular.element(document.querySelector("#Close")).click(function () {
        ShowLoader("Please wait...");
        HideLoader();
        resetValidation();
        hideStatusMessage();
        hideValidationSummary();
        angular.element(document.querySelector("#searchdata")).hide();
        angular.element(document.querySelector("#newuser")).hide();
        angular.element(document.querySelector("#passrule")).hide();
        angular.element(document.querySelector("#Userac_footer")).hide();
        angular.element(document.querySelector("#changePass")).hide();
        angular.element(document.querySelector("#ua")).hide();
    });
});

natApp.controller("RolesController", function ($scope, $controller) {
    $controller('GlobalController', { $scope: $scope });
});

natApp.controller("PasswordManagementController", function ($scope, $controller) {
    $controller('GlobalController', { $scope: $scope });

    $scope.Type = "Select";
    $scope.Role = "Select";
    $scope.Status = "Select";
    $scope.LastName = "";
    $scope.UserName = "";
    $scope.Email = "";

    $scope.init = function () {
    }

    $scope.searchUser = function () {
        try {

        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }

    $scope.getUserList = function () {
        try {

        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }
});

natApp.controller("MessageAndBulletinsController", function ($scope, $controller) {
    $controller('GlobalController', { $scope: $scope });

    $scope.EffectiveDate = "";
    $scope.EndDate = "";
    $scope.SortOrder = "";
    $scope.MessageType = "Select";
    $scope.Status = "Select";
    $scope.Message = "";

    $scope.init = function () {

    }
    $scope.insertMessage = function () {
        try {

        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }
    $scope.updateMessage = function () {
        try {

        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }
    $scope.editMessage = function () {
        try {

        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }
    $scope.getMessageList = function () {
        try {

        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }
    $scope.getMessage = function () {
        try {

        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }
    $scope.deleteMessage = function () {
        try {

        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }
});

natApp.controller("ApplicationTextController", function ($scope, $controller) {
    $controller('GlobalController', { $scope: $scope });
    $scope.InstructionName = "";
    $scope.ApplicationType = "Select";
    $scope.OnStructionType = "Select";
    $scope.Content = "";

    $scope.init = function () {
        try {
        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }

    $scope.insertInstruction = function () {
        try {

        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }

    $scope.editInstruction = function () {
        try {

        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }

    $scope.updateInstruction = function () {
        try {

        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }

    $scope.getInstructionList = function () {
        try {

        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }

    $scope.getInstuction = function () {
        try {

        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }
});

natApp.controller("CouncilInfoController", function ($scope, $controller, CouncilInfoService) {
    $controller('GlobalController', { $scope: $scope });

    // Variables
    $scope.BoardAuthorityId = 0;
    $scope.StateCode = "";
    $scope.Name = "";
    $scope.Code = "";
    $scope.Acronym = "";
    $scope.Url = "";
    $scope.PhysicalAddressLine1 = "";
    $scope.PhysicalAddressLine2 = "";
    $scope.PhysicalAddressCity = "";
    $scope.PhysicalAddressState = "";
    $scope.PhysicalAddressZip = "";
    $scope.IsMailingSameasPhysical = false;

    $scope.MailingAddressLine1 = "";
    $scope.MailingAddressLine2 = "";
    $scope.MailingAddressCity = "";
    $scope.MailingAddressState = "";
    $scope.MailingAddressZip = "";

    $scope.ContactPhone = "";
    $scope.ContactEmail = "";
    $scope.ContactFax = "";
    $scope.AlternatePhone = "";

    $scope.SystemName = "";
    $scope.SystemAbbreviation = "";
    $scope.SystemUrl = "";
    $scope.ApplicationSystemUrl = "";
    $scope.SystemContact = "";

    $scope.IsActive = true;
    $scope.CreatedBy = "";
    $scope.CreatedOn = "";
    $scope.ModifiedBy = "";
    $scope.ModifiedOn = "";
    $scope.BoardAuthorityGuid = "";

    // page init method
    $scope.init = function () {
        HideLoader();
        if ($scope.isSessionActive()) {
            $scope.getStateByCountryID(235);
            $scope.getCouncilInfo();
        }
        else {
            window.location.href = "#/Backoffice/Loginstaff";
        }
    }

    // Update CouncilInfo
    $scope.updateCouncilInfo = function () {
        hideStatusMessage();
        try {
            if ($scope.isSessionActive()) {

                if (validateData('councilinfovalidation')) {
                    BoardAuthorityId = $scope.BoardAuthorityId;
                    StateCode = $scope.StateCode;
                    Name = $scope.Name;
                    Code = $scope.Code;
                    Acronym = $scope.Acronym;
                    Url = $scope.Url;
                    PhysicalAddressLine1 = $scope.PhysicalAddressLine1;
                    PhysicalAddressLine2 = $scope.PhysicalAddressLine2;
                    PhysicalAddressCity = $scope.PhysicalAddressCity;
                    PhysicalAddressState = $scope.PhysicalAddressState.toString();
                    PhysicalAddressZip = $scope.PhysicalAddressZip;
                    IsMailingSameasPhysical = $scope.IsMailingSameasPhysical;
                    MailingAddressLine1 = $scope.MailingAddressLine1;
                    MailingAddressLine2 = $scope.MailingAddressLine2;
                    MailingAddressCity = $scope.MailingAddressCity;
                    MailingAddressState = $scope.MailingAddressState.toString();
                    MailingAddressZip = $scope.MailingAddressZip;
                    ContactPhone = $scope.ContactPhone;
                    ContactEmail = $scope.ContactEmail;
                    ContactFax = $scope.ContactFax;
                    AlternatePhone = $scope.AlternatePhone;
                    IsActive = $scope.IsActive;
                    CreatedBy = $scope.CreatedBy;
                    CreatedOn = $scope.CreatedOn;
                    ModifiedBy = $scope.ModifiedBy;
                    ModifiedOn = $scope.ModifiedOn;
                    BoardAuthorityGuid = $scope.BoardAuthorityGuid;
                    CouncilInfoService.SaveBoardAuthority(BoardAuthorityId, StateCode, Name, Code, Acronym, Url, PhysicalAddressLine1, PhysicalAddressLine2, PhysicalAddressCity, PhysicalAddressState, PhysicalAddressZip, IsMailingSameasPhysical, MailingAddressLine1, MailingAddressLine2, MailingAddressCity, MailingAddressState, MailingAddressZip, ContactPhone, ContactEmail, ContactFax, AlternatePhone, IsActive, CreatedBy, CreatedOn, ModifiedBy, ModifiedOn, BoardAuthorityGuid, sessionStorage.Key)
					.success(function (response) {
					    if ($scope.CheckResponse(response)) {
					        showStatusMessage(response.Message, "success");
					        $scope.getCouncilInfo("", 2);
					    } else {
					        //else of CheckResponse
					    }
					})
					.error(function (data) {
					    showStatusMessage(data.message, "error");
					    $scope.getCouncilInfo("", 2);
					});
                }
            }
            else {
                sessionStorage.URL = window.location.href;
                window.location.href = '#/User/Loginwemail';
            }
        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }

    //Modify by DHRUV PATEL(Including try-catch)
    // Get State List by CountryID
    $scope.getStateByCountryID = function (CountryID) {
        try {
            CouncilInfoService.GetStateByCountryID(sessionStorage.Key, CountryID)
					.success(function (response) {
					    if ($scope.CheckResponse(response)) {
					        $scope.StatList = response.State;
					    } else {
					        //else of CheckResponse
					    }
					})
					.error(function (data) {
					    showStatusMessage(data.message, "error");
					});
        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }

    // Reset Page or Cancle Button
    $scope.reset = function () {
        resetValidation();
        hideStatusMessage();
        hideValidationSummary();
    }

    // get CouncilInfo Data
    $scope.getCouncilInfo = function () {
        try {
            ShowLoader("Loading...");
            CouncilInfoService.BoardAuthorityGet(sessionStorage.Key)
			.success(function (response) {
			    if ($scope.CheckResponse(response)) {
			        BoardAuthority = response.BoardAuthority;
			        $scope.BoardAuthorityId = BoardAuthority[0].BoardAuthorityId;
			        $scope.StateCode = BoardAuthority[0].StateCode;
			        $scope.Name = BoardAuthority[0].Name;
			        $scope.Code = BoardAuthority[0].Code;
			        $scope.Acronym = BoardAuthority[0].Acronym;
			        $scope.Url = BoardAuthority[0].Url;
			        $scope.PhysicalAddressLine1 = BoardAuthority[0].PhysicalAddressLine1;
			        $scope.PhysicalAddressLine2 = BoardAuthority[0].PhysicalAddressLine2;
			        $scope.PhysicalAddressCity = BoardAuthority[0].PhysicalAddressCity;
			        $scope.PhysicalAddressState = parseInt(BoardAuthority[0].PhysicalAddressState);
			        $scope.PhysicalAddressZip = BoardAuthority[0].PhysicalAddressZip;
			        $scope.IsMailingSameasPhysical = BoardAuthority[0].IsMailingSameasPhysical;
			        $scope.MailingAddressLine1 = BoardAuthority[0].MailingAddressLine1;
			        $scope.MailingAddressLine2 = BoardAuthority[0].MailingAddressLine2;
			        $scope.MailingAddressCity = BoardAuthority[0].MailingAddressCity;
			        $scope.MailingAddressState = parseInt(BoardAuthority[0].MailingAddressState);
			        $scope.MailingAddressZip = BoardAuthority[0].MailingAddressZip;
			        $scope.ContactPhone = BoardAuthority[0].ContactPhone;
			        $scope.ContactEmail = BoardAuthority[0].ContactEmail;
			        $scope.ContactFax = BoardAuthority[0].ContactFax;
			        $scope.AlternatePhone = BoardAuthority[0].AlternatePhone;
			        $scope.IsActive = BoardAuthority[0].IsActive;
			        $scope.CreatedBy = BoardAuthority[0].CreatedBy;
			        $scope.CreatedOn = BoardAuthority[0].CreatedOn;
			        $scope.ModifiedBy = BoardAuthority[0].ModifiedBy;
			        $scope.ModifiedOn = BoardAuthority[0].ModifiedOn;
			        $scope.BoardAuthorityGuid = BoardAuthority[0].BoardAuthorityGuid;
			    } else {
			        //else of CheckResponse
			    }
			    HideLoader();
			})
			.error(function (data) {
			    HideLoader();
			    showStatusMessage(data.message, "error");
			});
        }
        catch (ex) {
            HideLoader();
            showStatusMessage(ex.message, "error");
        }
    }

    $scope.makeSameAsPhysicalAddressOnChange = function () {
        if ($scope.IsMailingSameasPhysical == true) {
            $scope.MailingAddressLine1 = $scope.PhysicalAddressLine1;
            $scope.MailingAddressLine2 = $scope.PhysicalAddressLine2;
            $scope.MailingAddressCity = $scope.PhysicalAddressCity;
            $scope.MailingAddressState = $scope.PhysicalAddressState;
            $scope.MailingAddressZip = $scope.PhysicalAddressZip;
            $scope.IsMailingSameasPhysical = true;
            resetValidation();
        }
    }

    $scope.makeSameAsPhysicalAddress = function ($event) {
        var checkbox = $event.target;
        if (checkbox.checked) {
            $scope.MailingAddressLine1 = $scope.PhysicalAddressLine1;
            $scope.MailingAddressLine2 = $scope.PhysicalAddressLine2;
            $scope.MailingAddressCity = $scope.PhysicalAddressCity;
            $scope.MailingAddressState = $scope.PhysicalAddressState;
            $scope.MailingAddressZip = $scope.PhysicalAddressZip;

            $scope.IsMailingSameasPhysical = true;

        } else {
            $scope.MailingAddressLine1 = "";
            $scope.MailingAddressLine2 = "";
            $scope.MailingAddressCity = "";
            $scope.MailingAddressState = "";
            $scope.MailingAddressZip = "";

            $scope.IsMailingSameasPhysical = false;
        }
        resetValidation();
    }

});

natApp.controller("EmailTemplateController", function ($scope, $controller) {
    $controller('GlobalController', { $scope: $scope });

});

natApp.controller("TaskScheduleController", function ($scope, $controller) {
    $controller('GlobalController', { $scope: $scope });

    $scope.TaskName = "";
    $scope.NotificationName = "";

    $scope.init = function () {
    }

    $scope.searchScheduledTask = function () {
        try {

        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }

    $scope.modifyScheduledTask = function () {
        try {

        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }

    $scope.getScheduledTask = function () {
        try {

        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }
});

natApp.controller("ExceptionLogController", function ($scope, $controller) {
    $controller('GlobalController', { $scope: $scope });

    $scope.Severity = "";
    $scope.LogID = "";
    $scope.Application = "";
    $scope.Category = "";
    $scope.Title = "";
    $scope.Username = "";
    $scope.Message = "";
    $scope.TimeFrom = "";
    $scope.TimeTo = "";

    $scope.init = function () {
    }

    $scope.searchLog = function () {
        try {

        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }

    $scope.getLogList = function () {
        try {

        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }
});

natApp.controller("ConfigurationController", function ($scope, $controller, ConfigurationService) {
    $controller('GlobalController', { $scope: $scope });
    $scope.recordlist = [];

    //Codes
    $scope.Password = "";
    $scope.Description = "";
    //DocumentList
    $scope.ApplicationType = "";
    $scope.DocumentType = "";
    $scope.Applicant = false;
    $scope.Office = false;
    $scope.MaxSize = "";
    $scope.Description = "";
    //ApplicationStatusColor
    $scope.Active = "";
    $scope.ActiveOnProbation = "";
    //DeficiencyReason
    $scope.DRApplicationType = "";
    $scope.DeficiencyName = "";
    $scope.Description = "";
    $scope.LetterSubject = "";
    $scope.LetterContent = "";
    $scope.Other = false;
    $scope.IsActive = false;

    $scope.init = function () {
        try {
            //$scope.getApplicationConfigurationList("",1234);
        }
        catch (ex) {
        }
    };

    //Application Configuration
    $scope.getApplicationConfigurationList = function () {

        if ($scope.isSessionActive()) {
            try {
                ConfigurationService.GetAllConfigurationList(sessionStorage.Key)
                .success(function (response) {
                    if (response.StatusCode == null && response.Message != "") {

                        sessionStorage.Key = "";
                        sessionStorage.URL = window.location.href;
                        window.location.href = '#/User/Loginwemail';

                    } else {
                        $scope.recordlist = response;
                    }

                }).error(function (data) {
                    //showStatusMessage(data.message, "error");
                });
            }
            catch (ex) {
                showStatusMessage("getAllConfigurationList - GetAllConfigurationList - Error: " + ex.message, "error");
            }
        }
        else {
            sessionStorage.URL = window.location.href;
            window.location.href = '#/User/Loginwemail';
        }
    };
    $scope.editApplicationConfiguration = function () {
        try {

        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }
    $scope.updateApplicationConfiguration = function () {
        try {

        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }
    $scope.getApplicationConfiguration = function () {
        try {

        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }
    //Codes
    $scope.insertCode = function () {
        try {

        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }
    $scope.getCodesList = function () {
        try {

        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }
    $scope.getCode = function () {
        try {

        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }
    $scope.editCode = function () {
        try {

        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }
    $scope.deleteCode = function () {
        try {

        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }
    $scope.updateCode = function () {
        try {

        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }
    //DocumentList
    $scope.insertDocument = function () {
        try {

        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }
    $scope.getDocumentList = function () {
        try {

        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }
    $scope.getDocument = function () {
        try {

        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }
    $scope.editDocument = function () {
        try {

        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }
    $scope.deleteDocument = function () {
        try {

        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }
    $scope.updateDocument = function () {
        try {

        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }
    //ApplicationStatusColor
    $scope.getStatusColorList = function () {
        try {

        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }
    $scope.getStatusColor = function () {
        try {

        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }
    $scope.editStatusColor = function () {
        try {

        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }
    $scope.updateStatusColor = function () {
        try {

        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }
    //DeficiencyReason
    $scope.insertDeficiencyReason = function () {
        try {

        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }
    $scope.getDeficiencyReasonList = function () {
        try {

        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }
    $scope.getDeficiencyReason = function () {
        try {

        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }
    $scope.editDeficiencyReason = function () {
        try {

        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }
    $scope.updateDeficiencyReason = function () {
        try {

        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }
    $scope.deleteDeficiencyReason = function () {
        try {

        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }
});

// Back Office Controllers
natApp.controller("BackofficeAutomatedTaskController", function ($scope, $controller) {
    $controller('GlobalController', { $scope: $scope });
});

natApp.controller("BackofficeDashboardStaffController", function ($scope, $controller) {
    $controller('GlobalController', { $scope: $scope });

    $scope.init = function () {
        try {

            if ($scope.isSessionActive()) {


            }
            else {
                window.location.href = "#/Backoffice/Loginstaff";
                // Else of isSessionActive method
            }
        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }

    $scope.deleteTask = function () {
        try {

        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }

    $scope.updateTask = function () {
        try {

        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }

    $scope.getTaskList = function () {
        try {

        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }

    $scope.getTask = function () {
        try {

        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }
});

natApp.controller("BackofficeIndividualController", function ($scope, $controller, BackofficeIndividualService, UserAccountService) {
    $controller('GlobalController', { $scope: $scope });

    angular.element(document.querySelector("#plus")).hide();
    angular.element(document.querySelector("#Info")).show();
    angular.element(document.querySelector("#plus")).click(function () {

        //showLoader("please wait...");
        angular.element(document.querySelector("#Info")).show();
        angular.element(document.querySelector("#minus")).show();
        angular.element(document.querySelector("#plus")).hide();
    });
    angular.element(document.querySelector("#minus")).click(function () {

        //showLoader("please wait...");
        angular.element(document.querySelector("#Info")).hide();
        angular.element(document.querySelector("#plus")).show();
        angular.element(document.querySelector("#minus")).hide();
    });

    $scope.init = function () {
        try {

            if ($scope.isSessionActive()) {

                $("#Individual_alltab").hide();
                $("#searchdata").show();
                $("#Individual_AddNewBlock").hide();
                $scope.countryGetAll();
                $scope.userStatusGetAll();
            }
        }
        catch (ex) {

            showStatusMessage(ex.message, "error");
        }
    };

    angular.element(document.querySelector("#btnIndividual_search")).click(function () {
        // $scope.clearDataEmployment();

        $("#searchdata").hide();
        $("#Individual_alltab").show();
    });

    angular.element(document.querySelector("#btnIndividual_AddNew")).click(function () {
        // $scope.clearDataEmployment();

        $("#btnIndividual_AddNew").hide();
        $("#Individual_AddNewBlock").show();

    });

    angular.element(document.querySelector("#btnIndividual_AddNewBlockCancel")).click(function () {
        // $scope.clearDataEmployment();

        $("#Individual_AddNewBlock").hide();
        $("#btnIndividual_AddNew").show();

    });

    // Get State List by CountryID
    $scope.getStateByCountryID = function (CountryID) {

        try {
            BackofficeIndividualService.GetStateByCountryID(sessionStorage.Key, CountryID)
					.success(function (response) {

					    if ($scope.CheckResponse(response)) {
					        $scope.StatList = response.State;
					    } else {
					        //else of CheckResponse
					    }
					})
					.error(function (data) {

					    showStatusMessage(data.message, "error");
					});
        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }

    // Get Country List 
    $scope.countryGetAll = function () {

        try {

            BackofficeIndividualService.CountryGetAll(sessionStorage.Key)
					.success(function (response) {

					    if ($scope.CheckResponse(response)) {
					        $scope.CountryList = response.Country;
					    } else {
					        //else of CheckResponse
					    }
					})
					.error(function (data) {

					    showStatusMessage(data.message, "error");
					});
        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }

    // Get Country List 
    $scope.countrySelectChange = function (CountryID) {

        try {

            $scope.getStateByCountryID(CountryID);
            for (var i = 0; i < $scope.CountryList.length; i++) {
                if ($scope.CountryList[i].CountryId == CountryID) {
                    $scope.ZipRegx = $scope.CountryList[i].ZipRegex;
                }
            }

        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }

    // Get UserStatus List
    $scope.userStatusGetAll = function () {

        try {
            UserAccountService.UserStatusGetAll(sessionStorage.Key)
					.success(function (response) {

					    if ($scope.CheckResponse(response)) {
					        $scope.UserStatus = response.UserStatus;

					    } else {
					        alert("session expired");
					    }
					})
					.error(function (data) {

					    showStatusMessage(data, "error");
					});
        }
        catch (ex) {

            showStatusMessage(ex.message, "error");
        }
    }

});

natApp.controller("BackofficeLicenseApplicationAUD_BOController", function ($scope, $controller) {
    $controller('GlobalController', { $scope: $scope });
});

natApp.controller("BackofficeLicenseApplicationHASnA_BOController", function ($scope, $controller) {
    $controller('GlobalController', { $scope: $scope });

});

natApp.controller("BackofficeLicenseApplicationSPL_BOController", function ($scope, $controller) {
    $controller('GlobalController', { $scope: $scope });
});

natApp.controller("BackofficeLicenseRenewalAUDController", function ($scope, $controller) {
    $controller('GlobalController', { $scope: $scope });
});

natApp.controller("BackofficeLicenseRenewalHASnA_BOController", function ($scope, $controller, $filter, BackofficeLicenseRenewalHASnA_BOService, LicenseRenewalHASnAService, CouncilInfoService) {
    $controller('GlobalController', { $scope: $scope });
    //$controller('ucLicenseAppicationHASnAController', { $scope: $scope });
    $scope.LNAStatus = "option1";


    $scope.LNAStatus;
    $scope.RenewalPeriod = false;
    $scope.FirstName = "";
    $scope.LastName = "";
    $scope.MiddleName = "";
    $scope.DOB = "";

    $scope.Street = "";
    $scope.City = "";
    $scope.State;
    $scope.ZIP = "";

    $scope.MailingStreet = "";
    $scope.MailingCity = "";
    $scope.MailingState;
    $scope.MailingZIP = "";

    $scope.HomePhone = "";
    $scope.CellPhone = "";
    $scope.OfficePhone = "";
    $scope.Fax = "";
    $scope.EmailAddress = "";

    $scope.EmployeeName = "";
    $scope.PhysicalAddressStreet = "";
    $scope.City = "";
    $scope.PhysicalAddressZIP = "";
    $scope.WorkPhone = "";
    $scope.AlternatePhone = "";
    $scope.StartBirth = "";
    $scope.Fax = "";

    $scope.NoChanges = false;
    $scope.NBCHIS = false;
    $scope.AccountNumber = ""

    $scope.NoOfSponser = "";
    $scope.SponsersLicenseNumber = "";
    $scope.BusinessLocationStreet = "";
    $scope.BusinessLocationState = "";
    $scope.BusinessLocationZIP = "";
    $scope.BusinessLocationCity = "";

    $scope.NameOfBusinessLicense = "";
    $scope.BusinessLicense = "";
    $scope.RDBBusinessLicence = ""

    $scope.RDBAppropriateResponse;

    $scope.Military;
    $scope.BranchesArmy;
    $scope.BranchesMarine;
    $scope.BranchesNavy;
    $scope.BranchesAirForce;
    $scope.BranchesCostGuard;
    $scope.BranchesNational;
    $scope.MilitarySpecialist;
    $scope.FromDateOfService;
    $scope.ToDateOfService;

    $scope.RDBLegalInfoQ1;
    $scope.RDBLegalInfoQ2;
    $scope.RDBLegalInfoQ3;
    $scope.RDBLegalInfoQ4;
    $scope.RDBLegalInfoQ5;

    $scope.EducationInformationDate;
    $scope.EducationInformationCourse
    $scope.EducationInformationCEHours;

    $scope.AckAppliciant;
    $scope.AckAppliciantName;
    $scope.AckAppliciantDate;

    $scope.EmploymentInformation = [];
    $scope.IndividualCECourse = [];
    $scope.ContactTypeList = [];
    $scope.BusinessLicenseInformation = [];
    $scope.IndividualChildSupport = [];
    $scope.IndividualRenewal = [];
    $scope.chkEmployment = true;
    $scope.paymentFlag = false;

    if ($scope.LNAStatus = "Active") {
        angular.element(document.querySelector("#InactiveLicense")).hide();
    }
    else if ($scope.LNAStatus = "InActive") {
        angular.element(document.querySelector("#InactiveLicense")).show();
    }

    $scope.init = function () {
        try {

            if ($scope.isSessionActive()) {

                $("#LicenseRenewal_EmploymentInformation").hide();
                $("#LicenseRenewalLegalInfoText1").hide();
                $("#LicenseRenewalLegalInfoText2").hide();
                $("#LicenseRenewalLegalInfoText3").hide();
                $("#LicenseRenewalLegalInfoText4").hide();
                $("#LicenseRenewalLegalInfoText5").hide();
                $("#ContinuingEductationInfoRow").hide();

                angular.element(document.querySelector("#ContinuingEductationInfoRow")).hide();
                angular.element(document.querySelector("#optionsRadios1")).click(function () {
                    angular.element(document.querySelector("#InactiveLicense")).hide();
                });
                angular.element(document.querySelector("#optionsRadios2")).click(function () {
                    angular.element(document.querySelector("#InactiveLicense")).show();
                });

                angular.element(document.querySelector("#LicenseRenewal_EmploymentInformation")).hide();
                angular.element(document.querySelector("#btnEmploymentInformation")).click(function () {
                    $scope.clearDataEmployment();
                    angular.element(document.querySelector("#LicenseRenewal_EmploymentInformation")).show();
                    angular.element(document.querySelector("#btnEmploymentInformation")).hide();
                });
                angular.element(document.querySelector("#btnCancelEmployementInformation")).click(function () {
                    resetValidation();
                    angular.element(document.querySelector("#LicenseRenewal_EmploymentInformation")).hide();
                    angular.element(document.querySelector("#btnEmploymentInformation")).show();
                });

                angular.element(document.querySelector("#LicenseRenewalLegalInfoText1")).hide();
                angular.element(document.querySelector("#LicenseRenewalradioQ1Op1")).click(function () {
                    angular.element(document.querySelector("#LicenseRenewalLegalInfoText1")).show();
                });
                angular.element(document.querySelector("#LicenseRenewalradioQ1Op2")).click(function () {
                    angular.element(document.querySelector("#LicenseRenewalLegalInfoText1")).hide();
                });
                angular.element(document.querySelector("#LicenseRenewalLegalInfoText2")).hide();
                angular.element(document.querySelector("#LicenseRenewalradioQ2Op1")).click(function () {
                    angular.element(document.querySelector("#LicenseRenewalLegalInfoText2")).show();
                });
                angular.element(document.querySelector("#LicenseRenewalradioQ2Op2")).click(function () {
                    angular.element(document.querySelector("#LicenseRenewalLegalInfoText2")).hide();
                });
                angular.element(document.querySelector("#LicenseRenewalLegalInfoText3")).hide();
                angular.element(document.querySelector("#LicenseRenewalradioQ3Op1")).click(function () {
                    angular.element(document.querySelector("#LicenseRenewalLegalInfoText3")).show();
                });
                angular.element(document.querySelector("#LicenseRenewalradioQ3Op2")).click(function () {
                    angular.element(document.querySelector("#LicenseRenewalLegalInfoText3")).hide();
                });
                angular.element(document.querySelector("#LicenseRenewalLegalInfoText4")).hide();
                angular.element(document.querySelector("#LicenseRenewalradioQ4Op1")).click(function () {
                    angular.element(document.querySelector("#LicenseRenewalLegalInfoText4")).show();
                });
                angular.element(document.querySelector("#LicenseRenewalradioQ4Op2")).click(function () {
                    angular.element(document.querySelector("#LicenseRenewalLegalInfoText4")).hide();
                });
                angular.element(document.querySelector("#LicenseRenewalLegalInfoText5")).hide();
                angular.element(document.querySelector("#LicenseRenewalradioQ5Op1")).click(function () {
                    angular.element(document.querySelector("#LicenseRenewalLegalInfoText5")).show();
                });
                angular.element(document.querySelector("#LicenseRenewalradioQ5Op2")).click(function () {
                    angular.element(document.querySelector("#LicenseRenewalLegalInfoText5")).hide();
                });


                angular.element(document.querySelector("#btnContinuingEducationInfo")).click(function () {
                    angular.element(document.querySelector("#ContinuingEductationInfoRow")).show();
                    angular.element(document.querySelector("#btnContinuingEducationInfo")).hide();
                });
                angular.element(document.querySelector("#btnCancelContinuingEducationInfo")).click(function () {
                    angular.element(document.querySelector("#ContinuingEductationInfoRow")).hide();
                    angular.element(document.querySelector("#btnContinuingEducationInfo")).show();
                });
                angular.element(document.querySelector("#LicenseReHASBo")).hide();
                angular.element(document.querySelector("#LicenseAppClose")).hide();
                angular.element(document.querySelector("#searchdata")).hide();

                angular.element(document.querySelector("#LicenseBoAdd")).click(function () {
                    angular.element(document.querySelector("#LicenseReHASBo")).show();
                    angular.element(document.querySelector("#LicenseBoAdd")).hide();
                    angular.element(document.querySelector("#LicenseAppClose")).show();
                    angular.element(document.querySelector("#searchdata")).hide();
                });
                angular.element(document.querySelector("#CloseApp")).click(function () {
                    angular.element(document.querySelector("#LicenseReHASBo")).hide();
                    angular.element(document.querySelector("#LicenseBoAdd")).show();
                    angular.element(document.querySelector("#LicenseAppClose")).hide();
                    angular.element(document.querySelector("#searchdata")).hide();
                });
                angular.element(document.querySelector("#SearchCancel")).click(function () {
                    angular.element(document.querySelector("#searchdata")).hide();
                    angular.element(document.querySelector("#LicenseBoAdd")).show();
                });
                angular.element(document.querySelector("#Search")).click(function () {
                    angular.element(document.querySelector("#LicenseReHASBo")).hide();
                    angular.element(document.querySelector("#LicenseBoAdd")).show();
                    angular.element(document.querySelector("#LicenseAppClose")).hide();
                    angular.element(document.querySelector("#searchdata")).show();
                });
                angular.element(document.querySelector("#Close")).click(function () {
                    angular.element(document.querySelector("#LicenseReHASBo")).hide();
                    angular.element(document.querySelector("#LicenseBoAdd")).show();
                    angular.element(document.querySelector("#LicenseAppClose")).hide();
                    angular.element(document.querySelector("#searchdata")).hide();
                });


                if ($scope.LNAStatus = "option1") {
                    angular.element(document.querySelector("#InactiveLicense")).hide();
                }
                angular.element(document.querySelector("#optionsRadios1")).click(function () {
                    angular.element(document.querySelector("#InactiveLicense")).hide();
                });
                angular.element(document.querySelector("#optionsRadios2")).click(function () {
                    angular.element(document.querySelector("#InactiveLicense")).show();
                });

                angular.element(document.querySelector("#LicenseRenewal_EmploymentInformation")).hide();
                angular.element(document.querySelector("#btnEmploymentInformation")).click(function () {
                    angular.element(document.querySelector("#LicenseRenewal_EmploymentInformation")).show();
                    angular.element(document.querySelector("#btnEmploymentInformation")).hide();
                });
                angular.element(document.querySelector("#btnCancelEmployementInformation")).click(function () {
                    resetValidation();
                    angular.element(document.querySelector("#LicenseRenewal_EmploymentInformation")).hide();
                    angular.element(document.querySelector("#btnEmploymentInformation")).show();
                });

                angular.element(document.querySelector("#LicenseRenewalLegalInfoText1")).hide();
                angular.element(document.querySelector("#LicenseRenewalradioQ1Op1")).click(function () {
                    angular.element(document.querySelector("#LicenseRenewalLegalInfoText1")).show();
                });
                angular.element(document.querySelector("#LicenseRenewalradioQ1Op2")).click(function () {
                    angular.element(document.querySelector("#LicenseRenewalLegalInfoText1")).hide();
                });
                angular.element(document.querySelector("#LicenseRenewalLegalInfoText2")).hide();
                angular.element(document.querySelector("#LicenseRenewalradioQ2Op1")).click(function () {
                    angular.element(document.querySelector("#LicenseRenewalLegalInfoText2")).show();
                });
                angular.element(document.querySelector("#LicenseRenewalradioQ2Op2")).click(function () {
                    angular.element(document.querySelector("#LicenseRenewalLegalInfoText2")).hide();
                });
                angular.element(document.querySelector("#LicenseRenewalLegalInfoText3")).hide();
                angular.element(document.querySelector("#LicenseRenewalradioQ3Op1")).click(function () {
                    angular.element(document.querySelector("#LicenseRenewalLegalInfoText3")).show();
                });
                angular.element(document.querySelector("#LicenseRenewalradioQ3Op2")).click(function () {
                    angular.element(document.querySelector("#LicenseRenewalLegalInfoText3")).hide();
                });
                angular.element(document.querySelector("#LicenseRenewalLegalInfoText4")).hide();
                angular.element(document.querySelector("#LicenseRenewalradioQ4Op1")).click(function () {
                    angular.element(document.querySelector("#LicenseRenewalLegalInfoText4")).show();
                });
                angular.element(document.querySelector("#LicenseRenewalradioQ4Op2")).click(function () {
                    angular.element(document.querySelector("#LicenseRenewalLegalInfoText4")).hide();
                });
                angular.element(document.querySelector("#LicenseRenewalLegalInfoText5")).hide();
                angular.element(document.querySelector("#LicenseRenewalradioQ5Op1")).click(function () {
                    angular.element(document.querySelector("#LicenseRenewalLegalInfoText5")).show();
                });
                angular.element(document.querySelector("#LicenseRenewalradioQ5Op2")).click(function () {
                    angular.element(document.querySelector("#LicenseRenewalLegalInfoText5")).hide();
                });

                angular.element(document.querySelector("#ContinuingEductationInfoRow")).hide();
                angular.element(document.querySelector("#btnContinuingEducationInfo")).click(function () {
                    angular.element(document.querySelector("#ContinuingEductationInfoRow")).show();
                    angular.element(document.querySelector("#btnContinuingEducationInfo")).hide();
                });
                angular.element(document.querySelector("#btnCancelContinuingEducationInfo")).click(function () {
                    angular.element(document.querySelector("#ContinuingEductationInfoRow")).hide();
                    angular.element(document.querySelector("#btnContinuingEducationInfo")).show();
                });





                //$scope.IndividualRenewalGet();
                $scope.GetLicenseeRenewalList();
                $scope.getStateByCountryID(235);
                //$scope.check();
            }
            else {
                window.location.href = "#/User/Loginwoemail";
                // Else of isSessionActive method
            }
        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }

    $scope.getList = function () {
        try {

        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }

    $scope.IndividualRenewalGet = function () {
        try {

            ShowLoader("Please wait...");
            resetValidation();
            hideStatusMessage();
            hideValidationSummary();

            $scope.IndividualRenewal = [];

            LicenseRenewalHASnAService.IndividualRenewalGet(sessionStorage.Key, sessionStorage.UserId)//sessionStorage.UserId
			.success(function (response) {

			    if ($scope.CheckResponse(response)) {


			        $scope.IndividualRenewal = response.IndividualRenewal;
			        angular.forEach($scope.IndividualRenewal, function (value, index) {
			            //IndividualLicenseDetails

			            if ($scope.IndividualRenewal.IndividualLicense.length > 0) {
			                $scope.IndividualLicenseId = $scope.IndividualRenewal.IndividualLicense[0].IndividualLicenseId;
			                $scope.IndividualId = $scope.IndividualRenewal.IndividualLicense[0].IndividualId;
			                $scope.ApplicationId = $scope.IndividualRenewal.IndividualLicense[0].ApplicationId;
			                $scope.ApplicationTypeId = $scope.IndividualRenewal.IndividualLicense[0].ApplicationTypeId;
			                $scope.LicenseTypeId = $scope.IndividualRenewal.IndividualLicense[0].LicenseTypeId;
			                $scope.IsLicenseTemporary = $scope.IndividualRenewal.IndividualLicense[0].IsLicenseTemporary;
			                $scope.IsLicenseActive = $scope.IndividualRenewal.IndividualLicense[0].IsLicenseActive;
			                $scope.LicenseNumber = $scope.IndividualRenewal.IndividualLicense[0].LicenseNumber;
			                $scope.OriginalLicenseDate = $scope.IndividualRenewal.IndividualLicense[0].OriginalLicenseDate;
			                $scope.LicenseEffectiveDate = $scope.IndividualRenewal.IndividualLicense[0].LicenseEffectiveDate;
			                $scope.LicenseExpirationDate = $scope.IndividualRenewal.IndividualLicense[0].LicenseExpirationDate;
			                $scope.LicenseStatusTypeId = $scope.IndividualRenewal.IndividualLicense[0].LicenseStatusTypeId;
			                $scope.IsActive = $scope.IndividualRenewal.IndividualLicense[0].IsActive;

			            }


			            if ($scope.IsLicenseActive == true) {
			                $scope.LNAStatus = "Active";
			            }
			            else if ($scope.IsLicenseActive == false) {
			                $scope.LNAStatus = "InActive";
			                angular.element(document.querySelector("#InactiveLicense")).show();
			            }

			            //Individual
			            $scope.IndividualId = $scope.IndividualRenewal.Individual.IndividualId;
			            sessionStorage.IndividualId = $scope.IndividualRenewal.Individual.IndividualId;
			            $scope.FirstName = $scope.IndividualRenewal.Individual.FirstName;
			            $scope.MiddleName = $scope.IndividualRenewal.Individual.MiddleName;
			            $scope.LastName = $scope.IndividualRenewal.Individual.LastName;
			            $scope.SuffixId = $scope.IndividualRenewal.Individual.SuffixId;
			            $scope.SSN = $scope.IndividualRenewal.Individual.SSN;
			            $scope.IsItin = $scope.IndividualRenewal.Individual.IsItin;
			            $scope.DateOfBirth = $scope.IndividualRenewal.Individual.DateOfBirth;
			            $scope.EmailAddress = sessionStorage.Email;
			            $scope.RaceId = $scope.IndividualRenewal.Individual.RaceId;
			            $scope.Gender = $scope.IndividualRenewal.Individual.Gender;
			            $scope.HairColorId = $scope.IndividualRenewal.Individual.HairColorId;
			            $scope.EyeColorId = $scope.IndividualRenewal.Individual.EyeColorId;
			            $scope.Weight = $scope.IndividualRenewal.Individual.Weight;
			            $scope.Height = $scope.IndividualRenewal.Individual.Height;
			            $scope.PlaceOfBirth = $scope.IndividualRenewal.Individual.PlaceOfBirth;
			            $scope.CitizenshipId = $scope.IndividualRenewal.Individual.CitizenshipId;
			            $scope.ExternalId = $scope.IndividualRenewal.Individual.ExternalId;
			            $scope.ExternalId2 = $scope.IndividualRenewal.Individual.ExternalId2;
			            $scope.IsArchived = $scope.IndividualRenewal.Individual.IsArchived;
			            $scope.IndividualIsActive = $scope.IndividualRenewal.Individual.IsActive;

			            //Application
			            $scope.ApplicationId = $scope.IndividualRenewal.Application.ApplicationId;
			            sessionStorage.ApplicationId = $scope.IndividualRenewal.Individual.IndividualId;
			            $scope.ApplicationTypeId = $scope.IndividualRenewal.Application.ApplicationTypeId;
			            $scope.ApplicationStatusId = $scope.IndividualRenewal.Application.ApplicationStatusId;
			            $scope.ApplicationStatusReasonId = $scope.IndividualRenewal.Application.ApplicationStatusReasonId;
			            $scope.ApplicationNumber = $scope.IndividualRenewal.Application.ApplicationNumber;
			            sessionStorage.ApplicationNumber = $scope.IndividualRenewal.Application.ApplicationNumber;
			            $scope.ApplicationSubmitMode = $scope.IndividualRenewal.Application.ApplicationSubmitMode;
			            $scope.StartedDate = $scope.IndividualRenewal.Application.StartedDate;
			            $scope.SubmittedDate = $scope.IndividualRenewal.Application.SubmittedDate;
			            $scope.ApplicationStatusDate = $scope.IndividualRenewal.Application.ApplicationStatusDate;
			            $scope.PaymentDeadlineDate = $scope.IndividualRenewal.Application.PaymentDeadlineDate;
			            $scope.PaymentDate = $scope.IndividualRenewal.Application.PaymentDate;
			            $scope.ConfirmationNumber = $scope.IndividualRenewal.Application.ConfirmationNumber;
			            $scope.ReferenceNumber = $scope.IndividualRenewal.Application.ReferenceNumber;
			            $scope.IsFingerprintingNotRequired = $scope.IndividualRenewal.Application.IsFingerprintingNotRequired;
			            $scope.IsPaymentRequired = $scope.IndividualRenewal.Application.IsPaymentRequired;
			            $scope.CanProvisionallyHire = $scope.IndividualRenewal.Application.CanProvisionallyHire;
			            $scope.GoPaperless = $scope.IndividualRenewal.Application.GoPaperless;
			            $scope.LicenseRequirementId = $scope.IndividualRenewal.Application.LicenseRequirementId;
			            $scope.WithdrawalReasonId = $scope.IndividualRenewal.Application.WithdrawalReasonId;
			            $scope.LicenseTypeId = $scope.IndividualRenewal.Application.LicenseTypeId;
			            $scope.ApplicationIsActive = $scope.IndividualRenewal.Application.IsActive;

			            //IndividualAddress
			            if ($scope.IndividualRenewal.IndividualAddress.length > 0) {
			                $scope.IndividualAddressId = $scope.IndividualRenewal.IndividualAddress[0].IndividualAddressId;
			                $scope.IndividualId = $scope.IndividualRenewal.IndividualAddress[0].IndividualId;
			                $scope.AddressId = $scope.IndividualRenewal.IndividualAddress[0].AddressId;
			                $scope.AddressTypeId = $scope.IndividualRenewal.IndividualAddress[0].AddressTypeId;
			                $scope.BeginDate = $scope.IndividualRenewal.IndividualAddress[0].BeginDate;
			                $scope.EndDate = $scope.IndividualRenewal.IndividualAddress[0].EndDate;
			                $scope.IsMailingSameasPhysical = $scope.IndividualRenewal.IndividualAddress[0].IsMailingSameasPhysical;
			                $scope.IndividualAddressIsActive = $scope.IndividualRenewal.IndividualAddress[0].IsActive;
			                $scope.Street = $scope.IndividualRenewal.IndividualAddress[0].StreetLine1;
			                $scope.Street2 = $scope.IndividualRenewal.IndividualAddress[0].StreetLine2;
			                $scope.City = $scope.IndividualRenewal.IndividualAddress[0].City;
			                $scope.ZIP = $scope.IndividualRenewal.IndividualAddress[0].Zip;
			                $scope.State = $scope.IndividualRenewal.IndividualAddress[0].StateCode;
			                $scope.IsMailingSameasPhysical = $scope.IndividualRenewal.IndividualAddress[0].IsMailingSameasPhysical;

			                $scope.MailingStreet = $scope.IndividualRenewal.IndividualAddress[0].StreetLine1;
			                $scope.MailingStreet2 = $scope.IndividualRenewal.IndividualAddress[0].StreetLine2;
			                $scope.MailingCity = $scope.IndividualRenewal.IndividualAddress[0].City;
			                $scope.MailingZIP = $scope.IndividualRenewal.IndividualAddress[0].Zip;
			                $scope.MailingState = $scope.IndividualRenewal.IndividualAddress[0].StateCode;


			            }

			            //Contact
			            //$scope.contactTypeGetAll();
			            //if ($scope.IndividualRenewal.Contact.length > 0) {


			            //$scope.ContactId = $scope.IndividualRenewal.Contact[0].ContactId;
			            //$scope.ContactFirstName = $scope.IndividualRenewal.Contact[0].ContactFirstName;
			            //$scope.ContactLastName = $scope.IndividualRenewal.Contact[0].ContactLastName;
			            //$scope.ContactMiddleName = $scope.IndividualRenewal.Contact[0].ContactMiddleName;
			            //$scope.ContactTypeId = $scope.IndividualRenewal.Contact[0].ContactTypeId;
			            //$scope.Code = $scope.IndividualRenewal.Contact[0].Code;
			            //$scope.ContactInfo = $scope.IndividualRenewal.Contact[0].ContactInfo;
			            //$scope.DateContactValidated = $scope.IndividualRenewal.Contact[0].DateContactValidated;
			            //$scope.ContactIsActive = $scope.IndividualRenewal.Contact[0].IsActive;
			            //}
			            //var i = -1;
			            $scope.IndividualRenewal.Contact[0];
			            angular.forEach($scope.IndividualRenewal.Contact, function (val, ind) {
			                if ($scope.IndividualRenewal.Contact[ind].ContactTypeId == "1") {
			                    $scope.CellPhone = $scope.IndividualRenewal.Contact[ind].ContactInfo;
			                }
			                if ($scope.IndividualRenewal.Contact[ind].ContactTypeId == "2") {
			                    $scope.HomePhone = $scope.IndividualRenewal.Contact[ind].ContactInfo;
			                }
			            });
			            //if ($scope.ContactDetails.ContactTypeId == "1")
			            //{
			            //	$scope.CellPhone = $scope.ContactDetails.ContactInfo;
			            //}
			            //if ($scope.ContactDetails.ContactTypeId == "2") {
			            //	$scope.HomePhone = $scope.ContactDetails.ContactInfo;
			            //}

			            //EmploymentInformation
			            $scope.EmploymentInformation = [];
			            if ($scope.IndividualRenewal.IndividualEmployment.length > 0) {
			                for (var i in $scope.IndividualRenewal.IndividualEmployment) {
			                    $scope.EmploymentInformation.push($scope.IndividualRenewal.IndividualEmployment[i]);
			                }

			            }

			            //IndividualCertification
			            if ($scope.IndividualRenewal.IndividualCertification != null) {


			                $scope.IndividualCertificationId = $scope.IndividualRenewal.IndividualCertification.IndividualCertificationId;
			                $scope.IndividualId = $scope.IndividualRenewal.IndividualCertification.IndividualId;
			                $scope.CertificationTypeId = $scope.IndividualRenewal.IndividualCertification.CertificationTypeId;
			                $scope.ClinicalComptence = $scope.IndividualRenewal.IndividualCertification.ClinicalComptence;
			                $scope.IsClinicalComptence = $scope.IndividualRenewal.IndividualCertification.IsClinicalComptence;
			                $scope.DateIssued = $scope.IndividualRenewal.IndividualCertification.DateIssued;
			                $scope.ABAMember = $scope.IndividualRenewal.IndividualCertification.ABAMember;
			                $scope.PraxisExam = $scope.IndividualRenewal.IndividualCertification.PraxisExam;
			                $scope.IsNBCHIS = $scope.IndividualRenewal.IndividualCertification.IsNBCHIS;
			                $scope.NBCHISAccount = $scope.IndividualRenewal.IndividualCertification.NBCHISAccount;
			                $scope.NBCHISCertificate = $scope.IndividualRenewal.IndividualCertification.NBCHISCertificate;
			                $scope.DatePassed = $scope.IndividualRenewal.IndividualCertification.DatePassed;
			                $scope.ABA = $scope.IndividualRenewal.IndividualCertification.ABA;
			                $scope.ASHA = $scope.IndividualRenewal.IndividualCertification.ASHA;
			                $scope.IsNBCOTCertified = $scope.IndividualRenewal.IndividualCertification.IsNBCOTCertified;
			                $scope.IsNBCOTAppliedforRenewal = $scope.IndividualRenewal.IndividualCertification.IsNBCOTAppliedforRenewal;
			                $scope.IsNBCOTExamScheduled = $scope.IndividualRenewal.IndividualCertification.IsNBCOTExamScheduled;
			                $scope.NBCOTDateTaken = $scope.IndividualRenewal.IndividualCertification.NBCOTDateTaken;
			                $scope.NBCOTDatePassed = $scope.IndividualRenewal.IndividualCertification.NBCOTDatePassed;
			                $scope.NBCOTDateScheduled = $scope.IndividualRenewal.IndividualCertification.NBCOTDateScheduled;
			                $scope.IndividualCertificationIsActive = $scope.IndividualRenewal.IndividualCertification.IsActive;
			            }

			            //SponsorInformation
			            if ($scope.IndividualRenewal.SponsorInformation != null) {


			                $scope.SponsorId = $scope.IndividualRenewal.SponsorInformation.SponsorId;
			                $scope.SponserFirstName = $scope.IndividualRenewal.SponsorInformation.FirstName;
			                $scope.SponserMiddleName = $scope.IndividualRenewal.SponsorInformation.MiddleName;
			                $scope.SponserLastName = $scope.IndividualRenewal.SponsorInformation.LastName;
			                $scope.SponsersLicenseNumber = $scope.IndividualRenewal.SponsorInformation.SupervisorLicenseNumber;
			                $scope.BusinessLocationStreet1 = $scope.IndividualRenewal.SponsorInformation.SponsorAddress[0].StreetLine1;
			                $scope.BusinessLocationStreet2 = $scope.IndividualRenewal.SponsorInformation.SponsorAddress[0].StreetLine2;
			                $scope.BusinessLocationCity = $scope.IndividualRenewal.SponsorInformation.SponsorAddress[0].City;
			                $scope.BusinessLocationState = $scope.IndividualRenewal.SponsorInformation.SponsorAddress[0].StateCode;
			                $scope.BusinessLocationZIP = $scope.IndividualRenewal.SponsorInformation.SponsorAddress[0].Zip;
			            }

			            //BusinessLicenseInformation
			            if ($scope.IndividualRenewal.BusinessLicenseInformation.length != 0) {

			                $scope.BusinessLicenseInformation = $scope.IndividualRenewal.BusinessLicenseInformation;

			                for (var i in $scope.BusinessLicenseInformation) {
			                    if ($scope.BusinessLicenseInformation[i].ContentItemResponse == true) {
			                        $scope.ContentItemResponse = $scope.BusinessLicenseInformation[i].IndividualNVBusinessLicenseId;
			                    }
			                }
			                //$scope.IndividualNVBusinessLicenseId = $scope.IndividualRenewal.BusinessLicenseInformation[0].IndividualNVBusinessLicenseId;
			                //$scope.IndividualId = $scope.IndividualRenewal.BusinessLicenseInformation[0].IndividualId;
			                //$scope.ContentItemLkId = $scope.IndividualRenewal.BusinessLicenseInformation[0].ContentItemLkId;
			                //$scope.ContentItemHash = $scope.IndividualRenewal.BusinessLicenseInformation[0].ContentItemHash;
			                //$scope.ContentItemResponse = $scope.IndividualRenewal.BusinessLicenseInformation[0].ContentItemResponse;
			                //$scope.Status = $scope.IndividualRenewal.BusinessLicenseInformation[0].Status;
			                $scope.txtNameOfBusinessLicense = $scope.IndividualRenewal.BusinessLicenseInformation[0].NameonBusinessLicense;
			                $scope.txtBusinessLicense = $scope.IndividualRenewal.BusinessLicenseInformation[0].BusinessLicenseNumber;
			                //$scope.BusinessLicenseInformationIsActive = $scope.IndividualRenewal.BusinessLicenseInformation[0].IsActive;
			            }

			            //IndividualChildSupport
			            if ($scope.IndividualRenewal.IndividualChildSupport != null) {

			                $scope.IndividualChildSupport = $scope.IndividualRenewal.IndividualChildSupport;
			                for (var i in $scope.IndividualChildSupport) {
			                    if ($scope.IndividualChildSupport[i].ContentItemResponse == true) {
			                        $scope.RDBAppropriateResponse = $scope.IndividualChildSupport[i].IndividualChildSupportId;
			                    }
			                }
			                $scope.IndividualChildSupportId = $scope.IndividualRenewal.IndividualChildSupport[0].IndividualChildSupportId;
			                $scope.IndividualId = $scope.IndividualRenewal.IndividualChildSupport[0].IndividualId;
			                $scope.IndividualChildSupportContentItemLkId = $scope.IndividualRenewal.IndividualChildSupport[0].ContentItemLkId;
			                $scope.IndividualChildSupportContentItemNumber = $scope.IndividualRenewal.IndividualChildSupport[0].ContentItemNumber;
			                $scope.IndividualChildSupportContentItemResponse = $scope.IndividualRenewal.IndividualChildSupport[0].ContentItemResponse;
			                $scope.IndividualChildSupportIsActive = $scope.IndividualRenewal.IndividualChildSupport[0].IsActive;
			                $scope.IndividualChildSupportContentDescription = $scope.IndividualRenewal.IndividualChildSupport[0].ContentDescription;
			            }

			            //IndividualVeteran
			            if ($scope.IndividualRenewal.IndividualVeteran != null) {


			                $scope.IndividualVeteranId = $scope.IndividualRenewal.IndividualVeteran.IndividualVeteranId;
			                $scope.IndividualId = $scope.IndividualRenewal.IndividualVeteran.IndividualId;
			                $scope.Military = $scope.IndividualRenewal.IndividualVeteran.ServedInMilitary;
			                if ($scope.Military == true) {
			                    $scope.Military = "yes";
			                }
			                else {
			                    $scope.Military = "no";
			                }
			                $scope.SpouseofActiveMilitaryMember = $scope.IndividualRenewal.IndividualVeteran.SpouseofActiveMilitaryMember;
			                $scope.MilitarySpecialist = $scope.IndividualRenewal.IndividualVeteran.MilitaryOccupationSpeciality;

			                //$scope.FromDateOfService = $scope.IndividualRenewal.IndividualVeteran.ServiceDateFrom;
			                $scope.FromDateOfService = ($filter('date')(new Date($scope.IndividualRenewal.IndividualVeteran.ServiceDateFrom), 'MM/dd/yyyy'));

			                //$scope.ToDateOfService = $scope.IndividualRenewal.IndividualVeteran.ServiceDateTo;
			                $scope.FromDateOfService = ($filter('date')(new Date($scope.IndividualRenewal.IndividualVeteran.ServiceDateTo), 'MM/dd/yyyy'));

			                $scope.IndividualVeteranIsActive = $scope.IndividualRenewal.IndividualVeteran.IsActive;
			                $scope.VeteranBranches = [];
			                for (var i in $scope.IndividualRenewal.IndividualVeteran.VeteranBranches) {
			                    $scope.VeteranBranches.push($scope.IndividualRenewal.IndividualVeteran.VeteranBranches[i]);
			                }
			                //$scope.VeteranBranches = $scope.IndividualRenewal.IndividualVeteran.VeteranBranches[0];
			            }
			            //IndividualLegal
			            if ($scope.IndividualRenewal.IndividualLegal != null) {


			                $scope.IndividualLegal = $scope.IndividualRenewal.IndividualLegal;

			            }

			            //IndividualCEH
			            //if ($scope.IndividualRenewal.IndividualCEH.length > 0) {

			            //    $scope.IndividualCEH = $scope.IndividualRenewal.IndividualCEH[0];
			            //}

			            //IndividualAffidavit
			            if ($scope.IndividualRenewal.IndividualAffidavit != null) {


			                $scope.IndividualAffidavitId = $scope.IndividualRenewal.IndividualAffidavit.IndividualAffidavitId;
			                $scope.IndividualId = $scope.IndividualRenewal.IndividualAffidavit.IndividualId;
			                $scope.IndividualAffidavitContentItemLkId = $scope.IndividualRenewal.IndividualAffidavit.ContentItemLkId;
			                $scope.IndividualAffidavitContentItemHash = $scope.IndividualRenewal.IndividualAffidavit.ContentItemHash;
			                $scope.IndividualAffidavitContentItemResponse = $scope.IndividualRenewal.IndividualAffidavit.ContentItemResponse;
			                $scope.IndividualAffidavitDesc = $scope.IndividualRenewal.IndividualAffidavit.Desc;
			                $scope.IndividualAffidavitIsActive = $scope.IndividualRenewal.IndividualAffidavit.IsActive;
			            }

			            // Course Detail
			            if ($scope.IndividualRenewal.IndividualCECourse != null) {
			                $scope.IndividualCECourse = $scope.IndividualRenewal.IndividualCECourse;
			            }


			            //FeesDetails
			            if ($scope.IndividualRenewal.FeesDetails.length > 0) {


			                $scope.FeesDetails = $scope.IndividualRenewal.FeesDetails;
			                $scope.UnPaidFees = 0;
			                sessionStorage.RenewalFees = 0;
			                sessionStorage.LateFees = 0;
			                for (var i = 0; i < $scope.FeesDetails.length; i++) {
			                    if ($scope.FeesDetails[i].Status == "Unpaid") {


			                        $scope.UnPaidFees = $scope.UnPaidFees + $scope.FeesDetails[i].Amount;
			                        sessionStorage.Fees = $scope.UnPaidFees;
			                        $scope.InvoiceNumber = $scope.FeesDetails[i].InvoiceNumber;
			                    }
			                    if ($scope.FeesDetails[i].FeeType = "Renewal Fee") {
			                        sessionStorage.RenewalFees = $scope.UnPaidFees;
			                    }
			                    else if ($scope.FeesDetails[i].FeeType = "Late Fee") {
			                        sessionStorage.LateFees = $scope.FeesDetails[i].Amount;
			                    }
			                }
			                sessionStorage.InvoiceNumber = $scope.InvoiceNumber;
			            }
			            HideLoader();
			            //IndividualInfo = response.IndividualRenewal;

			        });





			    } else {
			        HideLoader();
			        // Else of CheckResponse Method
			    }
			})
				.error(function (data) {

				    HideLoader();
				    showStatusMessage(data, "error");
				});
        }
        catch (ex) {
            HideLoader();
            showStatusMessage(ex.message, "error");

        }
    }

    $scope.SaveEmploymentInfo = function () {
        try {
            if (validateData("UI_IndividualRenewalLicenseRenewalHASnAEmployementvalidation")) {
                //$scope.temp[0].EmployeeName = $scope.EmployeeName;
                //$scope.EmploymentInformation.push(EmploymentInfo);
                //$scope.check();
            }
            else {

            }
        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }

    $scope.insert = function () {
        try {

            //if (validateData()) {
            resetValidation();
            hideStatusMessage();
            hideValidationSummary();
            //$scope.IndividualRenewal = [];
            //$scope.IndividualRenewal.push(response.IndividualRenewal);

            $scope.IndividualRenewal.Individual.MiddleName = $scope.MiddleName;
            //	//IndividualLicenseDetails
            $scope.IndividualRenewal.IndividualLicense[0].IndividualLicenseId = $scope.IndividualLicenseId;
            $scope.IndividualRenewal.IndividualLicense[0].IndividualId = $scope.IndividualId;
            $scope.IndividualRenewal.IndividualLicense[0].ApplicationId = $scope.ApplicationId;
            $scope.IndividualRenewal.IndividualLicense[0].ApplicationTypeId = $scope.ApplicationTypeId;
            $scope.IndividualRenewal.IndividualLicense[0].LicenseTypeId = $scope.LicenseTypeId;
            $scope.IndividualRenewal.IndividualLicense[0].IsLicenseTemporary = $scope.IsLicenseTemporary;
            $scope.IndividualRenewal.IndividualLicense[0].IsLicenseActive = $scope.IsLicenseActive;
            $scope.IndividualRenewal.IndividualLicense[0].LicenseNumber = $scope.LicenseNumber;
            $scope.IndividualRenewal.IndividualLicense[0].OriginalLicenseDate = $scope.OriginalLicenseDate;
            $scope.IndividualRenewal.IndividualLicense[0].LicenseEffectiveDate = $scope.LicenseEffectiveDate;
            $scope.IndividualRenewal.IndividualLicense[0].LicenseExpirationDate = $scope.LicenseExpirationDate;
            $scope.IndividualRenewal.IndividualLicense[0].LicenseStatusTypeId = $scope.LicenseStatusTypeId;
            $scope.IndividualRenewal.IndividualLicense[0].IsActive = $scope.IsActive;

            //	//Individual
            $scope.IndividualRenewal.Individual.IndividualId = $scope.IndividualId;
            $scope.IndividualRenewal.Individual.FirstName = $scope.FirstName;
            $scope.IndividualRenewal.Individual.MiddleName = $scope.MiddleName;
            $scope.IndividualRenewal.Individual.LastName = $scope.LastName;
            $scope.IndividualRenewal.Individual.SuffixId = $scope.SuffixId;
            $scope.IndividualRenewal.Individual.SSN = $scope.SSN;
            $scope.IndividualRenewal.Individual.IsItin = $scope.IsItin;
            $scope.IndividualRenewal.Individual.DateOfBirth = $scope.DateOfBirth;
            $scope.IndividualRenewal.Individual.RaceId = $scope.RaceId;
            $scope.IndividualRenewal.Individual.Gender = $scope.Gender;
            $scope.IndividualRenewal.Individual.HairColorId = $scope.HairColorId;
            $scope.IndividualRenewal.Individual.EyeColorId = $scope.EyeColorId;
            $scope.IndividualRenewal.Individual.Weight = $scope.Weight;
            $scope.IndividualRenewal.Individual.Height = $scope.Height;
            $scope.IndividualRenewal.Individual.PlaceOfBirth = $scope.PlaceOfBirth;
            $scope.IndividualRenewal.Individual.CitizenshipId = $scope.CitizenshipId;
            $scope.IndividualRenewal.Individual.ExternalId = $scope.ExternalId;
            $scope.IndividualRenewal.Individual.ExternalId2 = $scope.ExternalId2;
            $scope.IndividualRenewal.Individual.IsArchived = $scope.IsArchived;
            $scope.IndividualRenewal.Individual.IndividualIsActive = $scope.IndividualIsActive;

            //	//Application
            $scope.IndividualRenewal.Application.ApplicationId = $scope.ApplicationId;
            $scope.IndividualRenewal.Application.ApplicationTypeId = $scope.ApplicationTypeId;
            $scope.IndividualRenewal.Application.ApplicationStatusId = $scope.ApplicationStatusId;
            $scope.IndividualRenewal.Application.ApplicationStatusReasonId = $scope.ApplicationStatusReasonId;
            $scope.IndividualRenewal.Application.ApplicationNumber = $scope.ApplicationNumber;
            $scope.IndividualRenewal.Application.ApplicationSubmitMode = $scope.ApplicationSubmitMode;
            $scope.IndividualRenewal.Application.StartedDate = $scope.StartedDate;
            $scope.IndividualRenewal.Application.SubmittedDate = $scope.SubmittedDate;
            $scope.IndividualRenewal.Application.ApplicationStatusDate = $scope.ApplicationStatusDate;
            $scope.IndividualRenewal.Application.PaymentDeadlineDate = $scope.PaymentDeadlineDate;
            $scope.IndividualRenewal.Application.PaymentDate = $scope.PaymentDate;
            $scope.IndividualRenewal.Application.ConfirmationNumber = $scope.ConfirmationNumber;
            $scope.IndividualRenewal.Application.ReferenceNumber = $scope.ReferenceNumber;
            $scope.IndividualRenewal.Application.IsFingerprintingNotRequired = $scope.IsFingerprintingNotRequired;
            $scope.IndividualRenewal.Application.IsPaymentRequired = $scope.IsPaymentRequired;
            $scope.IndividualRenewal.Application.CanProvisionallyHire = $scope.CanProvisionallyHire;
            $scope.IndividualRenewal.Application.GoPaperless = $scope.GoPaperless;
            $scope.IndividualRenewal.Application.LicenseRequirementId = $scope.LicenseRequirementId;
            $scope.IndividualRenewal.Application.WithdrawalReasonId = $scope.WithdrawalReasonId;
            $scope.IndividualRenewal.Application.LicenseTypeId = $scope.LicenseTypeId;
            $scope.IndividualRenewal.Application.ApplicationIsActive = $scope.ApplicationIsActive;

            //	//IndividualAddress
            if ($scope.IndividualRenewal.IndividualAddress.length > 0) {
                $scope.IndividualRenewal.IndividualAddress[0].IndividualAddressId = $scope.IndividualAddressId;
                $scope.IndividualRenewal.IndividualAddress[0].IndividualId = $scope.IndividualId;
                $scope.IndividualRenewal.IndividualAddress[0].AddressId = $scope.AddressId;
                $scope.IndividualRenewal.IndividualAddress[0].AddressTypeId = $scope.AddressTypeId;
                $scope.IndividualRenewal.IndividualAddress[0].BeginDate = $scope.BeginDate;
                $scope.IndividualRenewal.IndividualAddress[0].EndDate = $scope.EndDate;
                $scope.IndividualRenewal.IndividualAddress[0].IsMailingSameasPhysical = $scope.IsMailingSameasPhysical;
                $scope.IndividualRenewal.IndividualAddress[0].IsActive = $scope.IndividualAddressIsActive;
                $scope.IndividualRenewal.IndividualAddress[0].StreetLine1 = $scope.Street;
                $scope.IndividualRenewal.IndividualAddress[0].StreetLine2 = $scope.Street2;
                $scope.IndividualRenewal.IndividualAddress[0].City = $scope.City;
                $scope.IndividualRenewal.IndividualAddress[0].Zip = $scope.ZIP;
                $scope.IndividualRenewal.IndividualAddress[0].StateCode = $scope.State;

            } else {
                $scope.IndividualRenewal.IndividualAddress = null;
            }

            //	//EmploymentInformation
            //	$scope.EmploymentInformation = $scope.IndividualRenewal.EmploymentInformation[0];
            //$scope.IndividualRenewal.EmploymentInformation = $scope.EmploymentInformation;
            $scope.IndividualRenewal.IndividualEmployment = $scope.EmploymentInformation;
            //	//IndividualCertification
            if ($scope.IndividualRenewal.IndividualCertification != null) {
                $scope.IndividualRenewal.IndividualCertification.IndividualCertificationId = $scope.IndividualCertificationId;
                $scope.IndividualRenewal.IndividualCertification.IndividualId = $scope.IndividualId;
                $scope.IndividualRenewal.IndividualCertification.CertificationTypeId = $scope.CertificationTypeId;
                $scope.IndividualRenewal.IndividualCertification.ClinicalComptence = $scope.ClinicalComptence;
                $scope.IndividualRenewal.IndividualCertification.IsClinicalComptence = $scope.IsClinicalComptence;
                $scope.IndividualRenewal.IndividualCertification.DateIssued = $scope.DateIssued;
                $scope.IndividualRenewal.IndividualCertification.ABAMember = $scope.ABAMember;
                $scope.IndividualRenewal.IndividualCertification.PraxisExam = $scope.PraxisExam;
                $scope.IndividualRenewal.IndividualCertification.IsNBCHIS = $scope.IsNBCHIS;
                $scope.IndividualRenewal.IndividualCertification.NBCHISAccount = $scope.NBCHISAccount;
                $scope.IndividualRenewal.IndividualCertification.NBCHISCertificate = $scope.NBCHISCertificate;
                $scope.IndividualRenewal.IndividualCertification.DatePassed = $scope.DatePassed;
                $scope.IndividualRenewal.IndividualCertification.ABA = $scope.ABA;
                $scope.IndividualRenewal.IndividualCertification.ASHA = $scope.ASHA;
                $scope.IndividualRenewal.IndividualCertification.IsNBCOTCertified = $scope.IsNBCOTCertified;
                $scope.IndividualRenewal.IndividualCertification.IsNBCOTAppliedforRenewal = $scope.IsNBCOTAppliedforRenewal;
                $scope.IndividualRenewal.IndividualCertification.IsNBCOTExamScheduled = $scope.IsNBCOTExamScheduled;
                $scope.IndividualRenewal.IndividualCertification.NBCOTDateTaken = $scope.NBCOTDateTaken;
                $scope.IndividualRenewal.IndividualCertification.NBCOTDatePassed = $scope.NBCOTDatePassed;
                $scope.IndividualRenewal.IndividualCertification.NBCOTDateScheduled = $scope.NBCOTDateScheduled;
                $scope.IndividualRenewal.IndividualCertification.IndividualCertificationIsActive = $scope.IndividualCertificationIsActive;
            }
            else {
                $scope.IndividualRenewal.IndividualCertification = null;
            }


            //	//SponsorInformation
            if ($scope.IndividualRenewal.SponsorInformation != null) {
                //$scope.IndividualRenewal.SponsorInformation.SponsorId = 1;
                $scope.IndividualRenewal.SponsorInformation.FirstName = $scope.SponserFirstName;
                $scope.IndividualRenewal.SponsorInformation.MiddleName = $scope.SponserMiddleName;
                $scope.IndividualRenewal.SponsorInformation.LastName = $scope.SponserLastName;
                $scope.IndividualRenewal.SponsorInformation.SupervisorLicenseNumber = $scope.SponsersLicenseNumber;
                $scope.IndividualRenewal.SponsorInformation.SponsorAddress[0].StreetLine1 = $scope.BusinessLocationStreet1;
                $scope.IndividualRenewal.SponsorInformation.SponsorAddress[0].StreetLine2 = $scope.BusinessLocationStreet2;
                $scope.IndividualRenewal.SponsorInformation.SponsorAddress[0].City = $scope.BusinessLocationCity;
                $scope.IndividualRenewal.SponsorInformation.SponsorAddress[0].StateCode = $scope.BusinessLocationState;
                $scope.IndividualRenewal.SponsorInformation.SponsorAddress[0].Zip = $scope.BusinessLocationZIP;

            }
            else {
                $scope.IndividualRenewal.SponsorInformation = {
                    IndividualSupervisoryInfoId: 1,
                    IndividualId: $scope.IndividualId,
                    ApplicationId: $scope.ApplicationId,
                    SupervisorLicenseNumber: $scope.SponsersLicenseNumber,
                    IsActive: true,
                    IndividualNameId: 1,
                    FirstName: $scope.SponserFirstName,
                    MiddleName: $scope.SponserMiddleName,
                    LastName: $scope.SponserLastName,
                    SupervisorWorkAddressId: 1,
                    SponsorAddress: [{
                        AddressId: 1,
                        StreetLine1: $scope.BusinessLocationStreet1,
                        StreetLine2: $scope.BusinessLocationStreet2,
                        City: $scope.BusinessLocationCity,
                        StateCode: $scope.BusinessLocationState,
                        Zip: $scope.BusinessLocationZIP
                    }]
                }
            }





            //	//IndividualVeteran
            if ($scope.IndividualRenewal.IndividualVeteran != null) {

                $scope.IndividualRenewal.IndividualVeteran.IndividualVeteranId = $scope.IndividualVeteranId;
                $scope.IndividualRenewal.IndividualVeteran.IndividualId = $scope.IndividualId;
                if ($scope.Military == "yes") {
                    Military = true;
                }
                else {
                    Military = false;
                }
                $scope.IndividualRenewal.IndividualVeteran.ServedInMilitary = Military;
                $scope.IndividualRenewal.IndividualVeteran.SpouseofActiveMilitaryMember = $scope.SpouseofActiveMilitaryMember;
                $scope.IndividualRenewal.IndividualVeteran.MilitaryOccupationSpeciality = $scope.MilitarySpecialist;
                $scope.IndividualRenewal.IndividualVeteran.ServiceDateFrom = $scope.FromDateOfService;
                $scope.IndividualRenewal.IndividualVeteran.ServiceDateTo = $scope.ToDateOfService;
                $scope.IndividualRenewal.IndividualVeteran.IndividualVeteranIsActive = $scope.IndividualVeteranIsActive;
                //$scope.IndividualRenewal.IndividualVeteran.VeteranBranches = $scope.branches;

            }
            else {
                $scope.IndividualRenewal.IndividualVeteran = null;
            }


            //	//VeteranBranches
            //	$scope.VeteranBranches = $scope.IndividualRenewal.IndividualVeteran.VeteranBranches[0];

            //IndividualLegal
            //$scope.IndividualRenewal.IndividualLegal[0] = $scope.IndividualLegal;
            //	//IndividualCEH
            //	$scope.IndividualCEH = $scope.IndividualRenewal.IndividualCEH[0];

            //	//IndividualAffidavit
            $scope.IndividualRenewal.IndividualAffidavit.IndividualAffidavitId = $scope.IndividualAffidavitId;
            $scope.IndividualRenewal.IndividualAffidavit.IndividualId = $scope.IndividualId;
            $scope.IndividualRenewal.IndividualAffidavit.ContentItemLkId = $scope.IndividualAffidavitContentItemLkId;
            $scope.IndividualRenewal.IndividualAffidavit.ContentItemHash = $scope.IndividualAffidavitContentItemHash;
            $scope.IndividualRenewal.IndividualAffidavit.ContentItemResponse = $scope.IndividualAffidavitContentItemResponse;
            $scope.IndividualRenewal.IndividualAffidavit.Desc = $scope.IndividualAffidavitDesc;
            $scope.IndividualRenewal.IndividualAffidavit.IsActive = $scope.IndividualAffidavitIsActive;

            //FeesDetails
            // $scope.FeesDetails = $scope.IndividualRenewal.FeesDetails[0];

            //$scope.IndividualLicense = $scope.IndividualRenewal.IndividualLicense[0];
            //$scope.Individual = $scope.IndividualRenewal.Individual;
            //$scope.Application = $scope.IndividualRenewal.Application;
            //$scope.IndividualAddress = $scope.IndividualRenewal.IndividualAddress[0];
            //$scope.Contact = $scope.IndividualRenewal.Contact[0];
            //$scope.EmploymentInformation = $scope.IndividualRenewal.EmploymentInformation[0];
            //$scope.EmploymentAddress = $scope.EmploymentInformation[0].EmploymentAddress;




            //alert(JSON.stringify($scope.IndividualRenewal));
            LicenseRenewalHASnAService.IndividualRenewalSave(sessionStorage.Key, $scope.IndividualRenewal)
            .success(function (response) {

                if ($scope.CheckResponse(response)) {

                    alert("Successfully Login");
                    if ($scope.paymentFlag == true) {
                        window.location.href = "#/User/Payment";
                    }
                    $scope.IndividualRenewalGet();
                    //HideLoader();
                    //IndividualInfo = response.IndividualRenewal;


                } else {
                    // Else of CheckResponse Method
                }
            })
                .error(function (data) {

                    showStatusMessage(data.message, "error");
                });
            //}
            //else {

            //}
        }
        catch (ex) {

            showStatusMessage(ex.message, "error");
        }
    }

    $scope.update = function () {
        try {
            if (validateData()) {

            }
            else {

            }
        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }

    $scope.delete = function () {
        try {

        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }

    $scope.checkLegal = function (number) {

        for (var i = 0; i < $scope.IndividualLegal.length; i++) {

            if ($scope.IndividualLegal[i].ContentItemNumber == number) {
                //  alert($scope.IndividualLegal[i].ContentItemResponse);
                $('input[name=LicenseRenewalradio' + number + ']').prop('checked', $scope.IndividualLegal[i].ContentItemResponse);
                // alert($("input[LicenseRenewalradio"+number+"]:checked").val(true));
                //$('#LicenseRenewalradio' + $scope.IndividualLegal[i].ContentItemNumber).checked=true;//$scope.IndividualLegal[i].ContentItemResponse
            }
        }
    }

    // Get State List by CountryID
    $scope.getStateByCountryID = function (CountryID) {
        try {
            CouncilInfoService.GetStateByCountryID(sessionStorage.Key, CountryID)
					.success(function (response) {

					    if ($scope.CheckResponse(response)) {
					        $scope.StatList = response.State;
					    } else {
					        //else of CheckResponse
					    }
					})
					.error(function (data) {
					    showStatusMessage(data.message, "error");
					});
        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }

    // Get State List by CountryID
    $scope.contactTypeGetAll = function () {
        try {
            LicenseRenewalHASnAService.ContactTypeGetAll(sessionStorage.Key)
					.success(function (response) {

					    if ($scope.CheckResponse(response)) {
					        $scope.ContactTypeList = response.ContactTypeGetList;
					    } else {
					        //else of CheckResponse
					    }
					})
					.error(function (data) {
					    showStatusMessage(data.message, "error");
					});
        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }

    $scope.makeSameAsPhysicalAddressOnChange = function () {
        if ($scope.IsMailingSameasPhysical == true) {
            $scope.MailingStreet = $scope.Street;
            $scope.MailingCity = $scope.City;
            $scope.MailingStreet2 = $scope.Street2;
            $scope.MailingState = $scope.State;
            $scope.MailingZIP = $scope.ZIP;
            $scope.IsMailingSameasPhysical = true;
            resetValidation();
        }
    }

    $scope.makeSameAsPhysicalAddress = function ($event) {
        var checkbox = $event.target;
        if (checkbox.checked) {
            $scope.MailingStreet = $scope.Street;
            $scope.MailingCity = $scope.City;
            $scope.MailingStreet2 = $scope.Street2;
            $scope.MailingState = $scope.State;
            $scope.MailingZIP = $scope.ZIP;

            $scope.IsMailingSameasPhysical = true;

        } else {
            $scope.MailingStreet = "";
            $scope.MailingCity = "";
            $scope.MailingStreet2 = "";
            $scope.MailingState = "";
            $scope.MailingZIP = "";

            $scope.IsMailingSameasPhysical = false;
        }
        resetValidation();
    }

    $scope.addCourse = function () {
        $scope.IndividualCECourse.push({ IndividualCECourseId: 0, IndividualId: $scope.IndividualId, ApplicationId: $scope.ApplicationId, CECourseTypeId: null, CECourseActivityTypeId: null, CECourseStartDate: null, CECourseEndDate: null, CECourseDueDate: null, CECourseDate: new Date($scope.EducationInformationDate), CECourseHours: $scope.EducationInformationCEHours, CECourseUnits: 0.00, ProgramSponsor: null, CourseNameTitle: $scope.EducationInformationCourse, CourseSponsor: null, CECourseReportingYear: null, CECourseStatusId: null, InstructorBiography: null, ActivityDesc: null, ReferenceNumber: null, IsActive: true });
        $scope.EducationInformationDate = "";
        $scope.EducationInformationCourse = "";
        $scope.EducationInformationCEHours = "";
    }

    $scope.checkLegalRB = function (ContentItemNumber) {
        try {
            for (i in $scope.IndividualLegal) {
                if ($scope.IndividualLegal[i].ContentItemNumber == ContentItemNumber) {

                    $scope.IndividualLegal[i].ContentItemResponse = true;
                    $scope.IndividualLegal[i].Desc = $scope.IndividualLegal[i].Desc;
                }
            }
        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }

    $scope.checkLegalRB1 = function (ContentItemNumber) {
        try {
            for (i in $scope.IndividualLegal) {
                if ($scope.IndividualLegal[i].ContentItemNumber == ContentItemNumber) {

                    $scope.IndividualLegal[i].ContentItemResponse = false;
                }
            }
        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }
    $scope.processToPayment = function () {
        try {
            $scope.paymentFlag = true;
            $scope.insert();
        } catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }
    $scope.EditEmploymentInformation = function (IndividualEmploymentId, $index) {
        try {

            for (i in $scope.EmploymentInformation) {
                if ($scope.EmploymentInformation[i].IndividualEmploymentId == IndividualEmploymentId || $scope.$index == $index) {

                    angular.element(document.querySelector("#LicenseRenewal_EmploymentInformation")).show();
                    $scope.IndividualEmploymentId = $scope.EmploymentInformation[i].IndividualEmploymentId;
                    $scope.EmployerName = $scope.EmploymentInformation[i].EmployerName;
                    $scope.PhysicalAddressStreet = $scope.EmploymentInformation[i].EmploymentAddress[0].StreetLine1;
                    $scope.PhysicalAddressStreet2 = $scope.EmploymentInformation[i].EmploymentAddress[0].StreetLine2;
                    $scope.EmployerCity = $scope.EmploymentInformation[i].EmploymentAddress[0].City;
                    $scope.PhysicalAddressState = $scope.EmploymentInformation[i].EmploymentAddress[0].StateCode;
                    $scope.PhysicalAddressZIP = $scope.EmploymentInformation[i].EmploymentAddress[0].Zip;
                    if ($scope.EmploymentInformation[i].EmploymentContact[0].ContactTypeId == "3") {
                        $scope.WorkPhone = $scope.EmploymentInformation[i].EmploymentContact[0].ContactInfo;
                    }
                    if ($scope.EmploymentInformation[i].EmploymentContact[0].ContactTypeId == "4") {
                        $scope.AlternatePhone = $scope.EmploymentInformation[i].EmploymentContact[0].ContactInfo;
                    }
                    $scope.chkEmployment = false;
                }
            }
        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }

    $scope.DeleteEmploymentInformation = function ($index) {
        try {
            $scope.EmploymentInformation.splice($scope.EmploymentInformation.indexOf($index), 1);
        } catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }

    $scope.SaveEmploymentInformation = function () {
        try {

            var IndividualEmploymentId = $scope.IndividualEmploymentId;
            if ($scope.chkEmployment = true) {

                if (validateData("UI_IndividualRenewalLicenseRenewalHASnAEmployementvalidation")) {
                    if ($scope.WorkPhone != null) {
                        Code = "W";
                        ContactTypeId = 3;
                        ContactInfo = $scope.WorkPhone;
                    }
                    else {
                        Code = "";
                        ContactTypeId = null;
                    }
                    if ($scope.AlternatePhone != null) {
                        Code = "A";
                        ContactTypeId = 4;
                        ContactInfo = $scope.AlternatePhone;
                    }
                    else {
                        Code = "";
                        ContactTypeId = null;
                    }
                    $scope.EmploymentInformation.push({ IndividualEmploymentId: 0, IndividualId: $scope.IndividualId, ApplicationId: $scope.ApplicationId, EmployerName: $scope.EmployerName, ProviderId: 0, EmploymentHistoryTypeId: null, EmploymentStartDate: $scope.EmploymentStartDate, EmploymentEndDate: null, EmploymentStatusId: null, EmploymentTypeId: null, PositionId: null, IsWorkinginFieldofApplication: false, EverWorkedinFieldofApplication: false, ReferenceNumber: "", Role: null, IsActive: true, EmploymentAddress: [{ IndividualEmploymentAddressId: 0, IndividualId: $scope.IndividualId, AddressId: 0, IndividualEmploymentId: 0, AddressTypeId: 1, BeginDate: $scope.EmploymentStartDate, EndDate: null, IsMailingSameasPhysical: false, IsActive: true, Addressee: "", StreetLine1: $scope.PhysicalAddressStreet, StreetLine2: $scope.PhysicalAddressStreet2, City: $scope.EmployerCity, StateCode: $scope.PhysicalAddressState, Zip: $scope.PhysicalAddressZIP, CountyId: null, CountryId: 235 }], EmploymentContact: [{ IndividualEmploymentContactId: 0, IndividualId: $scope.IndividualId, ContactId: 0, IndividualEmploymentId: 0, ContactTypeId: ContactTypeId, BeginDate: $scope.EmploymentStartDate, EndDate: null, IsPreferredContact: true, IsMobile: true, IsActive: true, ContactFirstName: "", ContactLastName: "", ContactMiddleName: "", Code: Code, ContactInfo: ContactInfo, DateContactValidated: null }] });
                }
            }
            else {
                for (i in $scope.EmploymentInformation) {
                    if ($scope.EmploymentInformation[i].IndividualEmploymentId == IndividualEmploymentId) {

                        $scope.EmploymentInformation[i].IndividualEmploymentId = $scope.IndividualEmploymentId;
                        $scope.EmploymentInformation[i].EmployerName = $scope.EmployerName;
                        $scope.EmploymentInformation[i].EmploymentAddress[0].StreetLine1 = $scope.PhysicalAddressStreet;
                        $scope.EmploymentInformation[i].EmploymentAddress[0].StreetLine2 = $scope.PhysicalAddressStreet2;
                        $scope.EmploymentInformation[i].EmploymentAddress[0].City = $scope.EmployerCity;
                        $scope.EmploymentInformation[i].EmploymentAddress[0].StateCode = $scope.PhysicalAddressState;
                        $scope.EmploymentInformation[i].EmploymentAddress[0].Zip = $scope.PhysicalAddressZIP;
                        if ($scope.WorkPhone != null) {
                            $scope.EmploymentInformation[i].EmploymentContact[0].ContactInfo = $scope.WorkPhone;
                            $scope.EmploymentInformation[i].EmploymentContact[0].ContactTypeId = 3;
                        }
                        if ($scope.AlternatePhone != null) {
                            $scope.EmploymentInformation[i].EmploymentContact[0].ContactInfo = $scope.AlternatePhone;
                            $scope.EmploymentInformation[i].EmploymentContact[0].ContactTypeId = 4;
                        }
                    }
                }
            }
        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }

    $scope.clearDataEmployment = function () {
        try {
            $scope.chkEmployment = true;
            $scope.EmployerName = "";
            $scope.PhysicalAddressStreet = "";
            $scope.PhysicalAddressStreet2 = "";
            $scope.EmployerCity = "";
            $scope.PhysicalAddressState = "";
            $scope.PhysicalAddressZIP = "";
            $scope.WorkPhone = "";
            $scope.AlternatePhone = "";
            $scope.EmploymentStartDate = "";
            $scope.Fax = "";

        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }

    $scope.branches = [];
    $scope.updateSelection = function (action, Id) {

        if (action == 'push' && $scope.branches.indexOf(Id) == -1) {

            $scope.branches.push(Id);
        }
        if (action == 'pop' && $scope.branches.indexOf(Id) != -1) {

            $scope.branches.splice($scope.branches.indexOf(Id), 1);

        }
    };

    $scope.getSelectedCheckboxValue = function (Id) {

        for (var i in $scope.IndividualRenewal.IndividualVeteran.VeteranBranches) {
            if ($scope.IndividualRenewal.IndividualVeteran.VeteranBranches[i].BranchofServicesId == Id) {
                $scope.IndividualRenewal.IndividualVeteran.VeteranBranches[i].BranchofServicesIdResponse = true;
            }
        }
        //var checkbox = $event.target;
        //var action = (checkbox.checked ? 'push' : 'pop');
        //$scope.updateSelection(action, Id);

    };
    $scope.addBusinessInformation = function (ID) {

        for (var i = 0; i < $scope.IndividualRenewal.BusinessLicenseInformation.length; i++) {

            if ($scope.IndividualRenewal.BusinessLicenseInformation[i].IndividualNVBusinessLicenseId == ID) {
                if (ID != 1) {
                    $scope.IndividualRenewal.BusinessLicenseInformation[i].ContentItemResponse = true;
                    $scope.IndividualRenewal.BusinessLicenseInformation[i].NameonBusinessLicense = "";
                    $scope.IndividualRenewal.BusinessLicenseInformation[i].BusinessLicenseNumber = "";
                }
                else {
                    $scope.IndividualRenewal.BusinessLicenseInformation[i].ContentItemResponse = true;
                    $scope.IndividualRenewal.BusinessLicenseInformation[i].NameonBusinessLicense = $('#txtNameOfBusinessLicense').val();
                    $scope.IndividualRenewal.BusinessLicenseInformation[i].BusinessLicenseNumber = $('#txtBusinessLicense').val();
                }

            }
            else {
                $scope.IndividualRenewal.BusinessLicenseInformation[i].ContentItemResponse = false;
            }
        }
    }

    $scope.addIndividualChildSupport = function (ID) {

        for (var i = 0; i < $scope.IndividualRenewal.IndividualChildSupport.length; i++) {

            if ($scope.IndividualRenewal.IndividualChildSupport[i].IndividualChildSupportId == ID) {
                $scope.IndividualRenewal.IndividualChildSupport[i].ContentItemResponse = true;
            }
            else {
                $scope.IndividualRenewal.IndividualChildSupport[i].ContentItemResponse = false;
            }
        }
    }
    $scope.newBranchesCheckbox = [];
    $scope.isSelected = function (Id) {
        var statu;
        // 
        for (var i = 0; i < $scope.newBranchesCheckbox.length; i++) {
            if ($scope.newBranchesCheckbox[i].ID == Id) {
                // 
                statu = true;
                break;
            }
            else {
                statu = false;
            }
        }
        return statu;
    };

    $scope.GetLicenseeRenewalList = function () {
        try {

            BackofficeLicenseRenewalHASnA_BOService.GetLicenseeRenewalList(sessionStorage.Key)
							   .success(function (response) {

							       if ($scope.CheckResponse(response)) {
							           $scope.RenewalList = response.RenewalGetList;
							           HideLoader();
							       } else {
							           alert("session expired");
							           HideLoader();
							       }
							   })
							   .error(function (data) {
							       HideLoader();
							       showStatusMessage(data, "error");
							   });
        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }

    $scope.get = function () {
        try {

        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }


    $scope.preApproved = function (IndividualId) {
        try {
            $scope.IndividualRenewalGet(IndividualId);
            angular.element(document.querySelector("#LicenseReHASBo")).show();
            angular.element(document.querySelector("#LicenseBoAdd")).hide();
            angular.element(document.querySelector("#LicenseAppClose")).show();
            angular.element(document.querySelector("#searchdata")).hide();
        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }


    $scope.truefalse = false;
    $scope.yesno = true;
    $scope.showInnerDiv = function (DivID) {
        $('#' + DivID).show();
        $scope.divURL = '/Modules/UI_Backoffice/UI/ucLicenseApplicationHASnA_BO.html';
    }
    $scope.OpenLicenseRenewalBCBlock = function (id) {
        //var k = items.IndividualId;
        alert(id);
        //alert($(this).closest('table').find("#" + $(this)[0].$$watchers[5].last).html());//.before('<tr class="innerForm"><td><div ng-include="/Modules/UI_BackOffice/UI/ucLicenseApplicationHASnA_BO.html"></div></td></tr>');
    }
});

natApp.controller("BackofficeLicenseRenewalSPLController", function ($scope, $controller) {
    $controller('GlobalController', { $scope: $scope });
});

natApp.controller("BackofficeLoginstaffController", function ($scope, $controller, LoginwemailService) {
    $controller('GlobalController', { $scope: $scope });

    // Variables
    $scope.Email = "";
    $scope.Password = "";

    // page init method
    $scope.init = function () {
        try {
            if ($scope.isSessionActive()) {
                window.location.href = "#/Backoffice/DashboardStaff";
            }
            else {
                sessionStorage.Key = "";
            }
        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
        sessionStorage.LoginURL = window.location.href;
    }

    // Login Method
    $scope.login = function () {

        try {
            if (validateData('UI_BackofficeUILoginstaff')) {
                ShowLoader("Please wait...");
                Email = $scope.Email;
                Password = $scope.Password;
                LoginWithoutEmail = false;
                LoginwemailService.Login(Email, Password, LoginWithoutEmail)
                .success(function (response) {
                    if ($scope.CheckResponse(response)) {
                        $scope.Key = response.Key;
                        if (sessionStorage.URL != undefined && sessionStorage.URL != "") {
                            window.location.href = sessionStorage.URL;
                        }
                        else {
                            if (response.UserInfo.UserTypeName == "Staff") {
                                sessionStorage.Key = $scope.Key;
                                window.location.href = "#/Backoffice/DashboardStaff";
                            } else {
                                showStatusMessage("Invalid UserName Or Password", "error");
                                $scope.Password = "";
                            }
                        }
                    }
                    else {
                        showStatusMessage("Invalid UserName Or Password", "error");
                        $scope.Password = "";
                    }
                    HideLoader();
                }).error(function (data) {
                    showStatusMessage(data.message, "error");
                });
            }
            else {
                showStatusMessage("Invalid UserName Or Password", "error");
            }
        }
        catch (ex) {
            showStatusMessage("Login User - login - Error: " + ex.message, "error");
        }
        HideLoader();
    };
});

natApp.controller("BackofficePrintQueueController", function ($scope, $controller) {
    $controller('GlobalController', { $scope: $scope });
});

// Light Version Controllers
natApp.controller("LoginwemailController", function ($scope, $controller, $cookies, LoginwemailService) {
    $controller('GlobalController', { $scope: $scope });

    // Variables
    $scope.recordlist = [];
    $scope.Email = "";
    $scope.Password = "";

    // page init method
    $scope.init = function () {
        try {
            sessionStorage.key = "";
            if ($scope.isSessionActive()) {
                //window.location.href = "#/User/DashboardApplicant";
            }
            else {
                sessionStorage.Key = "";
                // Else of isSessionActive method
            }
        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
        //
    };

    // keep me login
    $scope.keepMeLoggedin = function () {
        try {
            if ($scope.KeepMeLoggedIn) {
                var userdata = {
                    USERNAME: btoa($scope.Email),
                    PASSWORD: btoa($scope.Password)
                }
                var jsonuserdata = JSON.stringify(userdata);
                var date = new Date();
                date.setTime(date.getTime() + (24 * 60 * 60 * 1000));
                $cookies.put('USERAUTH', jsonuserdata, {
                    expires: date.toUTCString()
                });

            } else {
                $cookies.remove('USERAUTH', '');
            }
        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }

    // Login User
    $scope.login = function () {
        try {
            if (validateData('loginwemailvalidation')) {
                ShowLoader("Please wait...");
                Email = $scope.Email;
                Password = $scope.Password;
                LoginWithoutEmail = false;
                LoginwemailService.Login(Email, Password, LoginWithoutEmail)
                .success(function (response) {

                    if ($scope.CheckResponse(response)) {
                        $scope.Key = response.Key;
                        $scope.keepMeLoggedin();
                        if (response.UserInfo.UserTypeName == "Applicant") {
                            sessionStorage.Key = $scope.Key;
                            window.location.href = "#/User/DashboardApplicant";
                            sessionStorage.UserId = response.IndividualID;
                        }
                        else if (response.UserInfo.UserTypeName == "Licensee") {
                            sessionStorage.Key = $scope.Key;
                            sessionStorage.UserId = response.IndividualID;
                            sessionStorage.Email = $scope.Email;
                            window.location.href = "#/User/LicenseRenewalHASnA";
                        }
                        else if (response.UserInfo.UserTypeName == "Staff") {
                            showStatusMessage("Invalid UserName Or Password", "error");
                            $scope.Password = "";
                        }
                        else {
                            showStatusMessage("Invalid UserName Or Password", "error");
                            $scope.Password = "";
                        }
                    }
                    else {
                        showStatusMessage(response.Message, "error");
                    }
                }).error(function (data) {
                    showStatusMessage(data.message, "error");
                });
            }
        }
        catch (ex) {
            showStatusMessage("Login User - login - Error: " + ex.message, "error");
        }
        HideLoader();
    };

    // Forgot Password
    $scope.forgetPassword = function () {
        try {
            if (validateData('forgotpasswordemailvalidation')) {
                ShowLoader("Please wait...");
                Email = $scope.Email;
                LoginwemailService.ForgetPassword(Email)
                .success(function (response) {

                    if ($scope.CheckResponse(response)) {
                        showStatusMessage(response.Message, "success");
                        $scope.Password = "";
                    }
                    else {
                        showStatusMessage("Invalid UserName Or Password", "error");
                        $scope.Password = "";
                    }
                }).error(function (data) {
                    showStatusMessage(data.message, "error");
                });
            }
        }
        catch (ex) {
            showStatusMessage("Login User - login - Error: " + ex.message, "error");
        }
        HideLoader();
    };

    // Get UserDetail if Keep me Login Active
    var UserDetails = $cookies.get('USERAUTH');
    if (UserDetails) {
        var user = angular.fromJson(UserDetails);
        $scope.Email = atob(user.USERNAME);
        $scope.Password = atob(user.PASSWORD);
        $scope.KeepMeLoggedIn = true;
    }

    // Goto Register New User Page
    $scope.register = function () {
        window.location.href = "#/User/Register";
    }

});

natApp.controller("LoginwoemailController", function ($scope, $controller, $cookies, LoginwoemailService) {
    $controller('GlobalController', { $scope: $scope });

    // Variables
    $scope.recordlist = [];
    $scope.Email = "";
    $scope.Password = "";

    // page init method
    $scope.init = function () {
        try {
            //sessionStorage.key = "";
            //sessionStorage.LoginURL = window.location.href;
            sessionStorage.IsLicenseActive = undefined;
            sessionStorage.PaymentDone = "false";
            if ($scope.isSessionActive()) {
                sessionStorage.removeItem("Key");
                sessionStorage.removeItem("Email");
                sessionStorage.removeItem("UserId");
            }
            else {
                // Else of isSessionActive method
            }
        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    };

    // keep me login
    $scope.keepMeLoggedinWOE = function () {
        try {
            if ($scope.KeepMeLoggedInWOE) {
                var userdatawoe = {
                    LASTNAME: btoa($scope.LastName),
                    ACCESSCODE: btoa($scope.AccessCode),
                    LICENSENUMBER: btoa($scope.LicenseNumber)
                }
                var jsonuserdata = JSON.stringify(userdatawoe);
                var date = new Date();
                date.setTime(date.getTime() + (24 * 60 * 60 * 1000));
                $cookies.put('USERAUTHWOE', jsonuserdata, {
                    expires: date.toUTCString()
                });

            } else {
                $cookies.remove('USERAUTHWOE', '');
            }
        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }

    // Login User
    $scope.login = function () {
        try {
            if (validateData('loginwoemailvalidation', 1)) {
                ShowLoader("Validating...");
                LastName = $scope.LastName;
                AccessCode = $scope.AccessCode;
                LicenseNumber = $scope.LicenseNumber;
                LoginWithoutEmail = true;
                LoginwoemailService.Login(LastName, AccessCode, LicenseNumber, LoginWithoutEmail)
                .success(function (response) {

                    $scope.recordlist = response;
                    if ($scope.CheckResponse(response)) {
                        $scope.Key = response.Key;
                        $scope.keepMeLoggedinWOE();
                        sessionStorage.Key = $scope.Key;
                        // window.location.href = "#/User/DashboardLicensee";
                        if (response.UserInfo.UserTypeName == "Licensee") {
                            sessionStorage.Key = $scope.Key;
                            sessionStorage.Email = $scope.Email;
                            sessionStorage.UserId = response.IndividualID;
                            window.location.href = "#/User/LicenseRenewalHASnA";
                            //window.location.href = "#/User/DashboardLicensee";
                        } else {
                            //HideLoader();
                            showStatusMessage("Invalid Last Name Or Access Code Or License Number ", "error");
                            $scope.AccessCode = "";
                            $scope.LicenseNumber = "";
                        }
                    }
                    else {
                        //HideLoader();
                        showStatusMessage("Invalid Last Name Or Access Code Or License Number ", "error");
                        $scope.AccessCode = "";
                        $scope.LicenseNumber = "";
                    }
                }).error(function (data) {
                    HideLoader();
                    showStatusMessage(data.message, "error");
                });
            }
        }
        catch (ex) {
            HideLoader();
            showStatusMessage("Login User - login - Error: " + ex.message, "error");
        }
        HideLoader();
    };

    // reset access code
    $scope.resetAccessCode = function () {
        try {
            if (validateData('loginwoemailvalidation')) {
                ShowLoader("Please wait...");
                LastName = $scope.LastName;
                SSN = $scope.AccessCode;
                LicenseNumber = $scope.LicenseNumber;
                LoginwoemailService.ResetAccessCode(LastName, SSN, LicenseNumber, sessionStorage.key)
                .success(function (response) {
                    if ($scope.CheckResponse(response)) {
                        showStatusMessage(response.Message, "success");
                    }
                    else {
                        showStatusMessage("Invalid UserName Or Password", "error");
                        $scope.Password = "";
                    }
                }).error(function (data) {

                    showStatusMessage(data.message, "error");
                });
            }
        }
        catch (ex) {
            showStatusMessage("Login User - login - Error: " + ex.message, "error");
        }
        HideLoader();
    };

    // Get UserDetail if Keep me Login Active
    var UserDetails = $cookies.get('USERAUTHWOE');
    if (UserDetails) {
        var user = angular.fromJson(UserDetails);
        $scope.LastName = atob(user.LASTNAME);
        $scope.AccessCode = atob(user.ACCESSCODE);
        $scope.LicenseNumber = atob(user.LICENSENUMBER);
        $scope.KeepMeLoggedInWOE = true;
    }
});

natApp.controller("RegisterController", function ($scope, $controller) {
    $controller('GlobalController', { $scope: $scope });
    $scope.login = function () {
        window.location.href = "#/User/Loginwemail";
    }

});

natApp.controller("LicenseApplicationController", function ($scope, $controller) {
    $controller('GlobalController', { $scope: $scope });
});

natApp.controller("DashboardApplicantController", function ($scope, $controller) {
    $controller('GlobalController', { $scope: $scope });
    // page init method
    $scope.init = function () {
        try {

            if ($scope.isSessionActive()) {


            }
            else {
                window.location.href = "#/User/Loginwemail";
                // Else of isSessionActive method
            }
        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }
    angular.element(document.querySelector("#DashboardliAdd")).hide();
    angular.element(document.querySelector("#DashboardliFill")).show();
    angular.element(document.querySelector("#Edit")).show();
    angular.element(document.querySelector("#Edit")).click(function () {
        angular.element(document.querySelector("#DashboardliAdd")).show();
        angular.element(document.querySelector("#DashboardliFill")).hide();
        angular.element(document.querySelector("#Edit")).hide();
    });
    angular.element(document.querySelector("#Cancel")).click(function () {
        angular.element(document.querySelector("#DashboardliAdd")).hide();
        angular.element(document.querySelector("#DashboardliFill")).show();
        angular.element(document.querySelector("#Edit")).show();
    });
});

natApp.controller("DashboardLicenseeController", function ($scope, $window, $controller) {
    $controller('GlobalController', { $scope: $scope });

    // Variables
    $scope.HomeAddressStreet = "";
    $scope.HomeAddressCity = "";
    $scope.HomeAddressState = "";
    $scope.HomeAddressZip = "";

    $scope.MailingAddressStreet = "";
    $scope.MailingAddressCity = "";
    $scope.MailingAddressState = "";
    $scope.MailingAddressZip = "";

    $scope.RenewApplication = function () {
        try {
            $window.open('#/User/LicenseRenewalHASnA', '_blank');
        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }

    // page init method
    $scope.init = function () {
        try {

            if ($scope.isSessionActive()) {

                //alert(sessionStorage.UserId);
            }
            else {
                window.location.href = "#/User/Loginwoemail";
                // Else of isSessionActive method
            }
        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }

    $scope.updateAddressDetails = function () {
        try {

        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }

    angular.element(document.querySelector("#DashboardliAdd")).hide();
    angular.element(document.querySelector("#DashboardliFill")).show();
    angular.element(document.querySelector("#Edit")).show();
    angular.element(document.querySelector("#Edit")).click(function () {
        angular.element(document.querySelector("#DashboardliAdd")).show();
        angular.element(document.querySelector("#DashboardliFill")).hide();
        angular.element(document.querySelector("#Edit")).hide();
    });
    angular.element(document.querySelector("#Cancel")).click(function () {
        angular.element(document.querySelector("#DashboardliAdd")).hide();
        angular.element(document.querySelector("#DashboardliFill")).show();
        angular.element(document.querySelector("#Edit")).show();
    });
});

natApp.controller("LicenseRenewalAUDController", function ($scope, $controller) {
    $controller('GlobalController', { $scope: $scope });
});

natApp.controller("LicenseRenewalHASnAController", function ($scope, $controller, LicenseRenewalHASnAService, CouncilInfoService, $filter) {
    $controller('GlobalController', { $scope: $scope, $filter: $filter });
    //$controller('GlobalController', { $scope: $scope });

    $scope.LicenseTypeId = "";
    $scope.InactiveLicenseCheck = false;
    $scope.LNAStatus = null;
    $scope.RenewalPeriod = false;
    $scope.FirstName = "";
    $scope.LastName = "";
    $scope.MiddleName = "";
    $scope.DOB = "";

    $scope.Street = "";
    $scope.City = "";
    $scope.State;
    $scope.ZIP = "";

    $scope.MailingStreet = "";
    $scope.MailingCity = "";
    $scope.MailingState;
    $scope.MailingZIP = "";

    $scope.MainWorkPhone = "";
    $scope.HomePhone = "";
    $scope.CellPhone = "";
    $scope.OfficePhone = "";
    $scope.Fax = "";
    $scope.EmailAddress = "";

    $scope.EmployeeName = "";
    $scope.PhysicalAddressStreet = "";
    $scope.City = "";
    $scope.PhysicalAddressZIP = "";
    $scope.WorkPhone = "";
    $scope.AlternatePhone = "";
    $scope.StartBirth = "";
    $scope.EmploymentFax = "";

    sessionStorage.LicenseNumber = null;
    sessionStorage.LicenseType = null;
    sessionStorage.ApplicationType = null;

    $scope.NoChanges = false;
    $scope.IsNBCHIS = false;
    $scope.AccountNumber = "";

    $scope.ApplicationId = null;
    sessionStorage.ApplicationId = null;
    $scope.ApplicationTypeId = null;
    $scope.ApplicationStatusId = null;
    $scope.ApplicationStatusReasonId = null;
    $scope.ApplicationNumber = null;
    sessionStorage.ApplicationNumber = null;
    $scope.ApplicationSubmitMode = null;
    $scope.StartedDate = null;
    $scope.SubmittedDate = null;
    $scope.ApplicationStatusDate = null;
    $scope.PaymentDeadlineDate = null;
    $scope.PaymentDate = null;
    $scope.ConfirmationNumber = null;
    $scope.ReferenceNumber = null;
    $scope.IsFingerprintingNotRequired = null;
    $scope.IsPaymentRequired = null;
    $scope.CanProvisionallyHire = null;
    $scope.GoPaperless = null;
    $scope.LicenseRequirementId = null;
    $scope.WithdrawalReasonId = null;
    $scope.LicenseTypeId = null;
    $scope.ApplicationIsActive = null;

    $scope.NoOfSponser = "";
    $scope.SponsersLicenseNumber = "";
    $scope.BusinessLocationStreet = "";
    $scope.BusinessLocationState = "";
    $scope.BusinessLocationZIP = "";
    $scope.BusinessLocationCity = "";
    $scope.BusinessLocationStreet1 = "";
    $scope.BusinessLocationStreet2 = "";

    $scope.NameOfBusinessLicense = "";
    $scope.BusinessLicense = "";
    $scope.RDBBusinessLicence = "";

    $scope.RDBAppropriateResponse = null;

    $scope.Military = null;
    $scope.BranchesArmy = null;
    $scope.BranchesMarine = null;
    $scope.BranchesNavy = null;
    $scope.BranchesAirForce = null;
    $scope.BranchesCostGuard = null;
    $scope.BranchesNational = null;
    $scope.MilitarySpecialist = null;
    $scope.FromDateOfService = null;
    $scope.ToDateOfService = null;

    $scope.RDBLegalInfoQ1 = null;
    $scope.RDBLegalInfoQ2 = null;
    $scope.RDBLegalInfoQ3 = null;
    $scope.RDBLegalInfoQ4 = null;
    $scope.RDBLegalInfoQ5 = null;

    $scope.EducationInformationDate = null;
    $scope.EducationInformationCourse = null;
    $scope.EducationInformationCEHours = null;

    $scope.AckAppliciant = null;
    $scope.AckAppliciantName = null;
    $scope.AckAppliciantDate = null;

    $scope.EmploymentInformation = [];
    $scope.IndividualCECourse = [];
    $scope.ContactTypeList = [];
    $scope.BusinessLicenseInformation = [];
    $scope.IndividualChildSupport = [];
    $scope.IndividualRenewal = [];
    $scope.chkEmployment = true;
    $scope.paymentFlag = false;
    $scope.FeesDetails = [];

    /*
    *  flag for  showing page while loading LicenseRenewalHasna
    */

    $scope.showHASnAFlag = false;

    if ($scope.LNAStatus = "Active") {
        angular.element(document.querySelector("#InactiveLicense")).hide();
    }
    else if ($scope.LNAStatus = "InActive") {
        angular.element(document.querySelector("#InactiveLicense")).show();
    }
    angular.element(document.querySelector("#optionsRadios1")).click(function () {
        angular.element(document.querySelector("#InactiveLicense")).hide();
    });
    angular.element(document.querySelector("#optionsRadios2")).click(function () {
        angular.element(document.querySelector("#InactiveLicense")).show();
    });

    angular.element(document.querySelector("#LicenseRenewal_EmploymentInformation")).hide();
    angular.element(document.querySelector("#btnEmploymentInformation")).click(function () {
        $scope.clearDataEmployment();
        angular.element(document.querySelector("#LicenseRenewal_EmploymentInformation")).show();
        angular.element(document.querySelector("#btnEmploymentInformation")).hide();
    });
    angular.element(document.querySelector("#btnCancelEmployementInformation")).click(function () {
        resetValidation();
        angular.element(document.querySelector("#LicenseRenewal_EmploymentInformation")).hide();
        angular.element(document.querySelector("#btnEmploymentInformation")).show();
    });

    angular.element(document.querySelector("#LicenseRenewalLegalInfoText1")).hide();
    angular.element(document.querySelector("#LicenseRenewalradioQ1Op1")).click(function () {
        angular.element(document.querySelector("#LicenseRenewalLegalInfoText1")).show();
    });
    angular.element(document.querySelector("#LicenseRenewalradioQ1Op2")).click(function () {
        angular.element(document.querySelector("#LicenseRenewalLegalInfoText1")).hide();
    });
    angular.element(document.querySelector("#LicenseRenewalLegalInfoText2")).hide();
    angular.element(document.querySelector("#LicenseRenewalradioQ2Op1")).click(function () {
        angular.element(document.querySelector("#LicenseRenewalLegalInfoText2")).show();
    });
    angular.element(document.querySelector("#LicenseRenewalradioQ2Op2")).click(function () {
        angular.element(document.querySelector("#LicenseRenewalLegalInfoText2")).hide();
    });
    angular.element(document.querySelector("#LicenseRenewalLegalInfoText3")).hide();
    angular.element(document.querySelector("#LicenseRenewalradioQ3Op1")).click(function () {
        angular.element(document.querySelector("#LicenseRenewalLegalInfoText3")).show();
    });
    angular.element(document.querySelector("#LicenseRenewalradioQ3Op2")).click(function () {
        angular.element(document.querySelector("#LicenseRenewalLegalInfoText3")).hide();
    });
    angular.element(document.querySelector("#LicenseRenewalLegalInfoText4")).hide();
    angular.element(document.querySelector("#LicenseRenewalradioQ4Op1")).click(function () {
        angular.element(document.querySelector("#LicenseRenewalLegalInfoText4")).show();
    });
    angular.element(document.querySelector("#LicenseRenewalradioQ4Op2")).click(function () {
        angular.element(document.querySelector("#LicenseRenewalLegalInfoText4")).hide();
    });
    angular.element(document.querySelector("#LicenseRenewalLegalInfoText5")).hide();
    angular.element(document.querySelector("#LicenseRenewalradioQ5Op1")).click(function () {
        angular.element(document.querySelector("#LicenseRenewalLegalInfoText5")).show();
    });
    angular.element(document.querySelector("#LicenseRenewalradioQ5Op2")).click(function () {
        angular.element(document.querySelector("#LicenseRenewalLegalInfoText5")).hide();
    });

    angular.element(document.querySelector("#ContinuingEductationInfoRow")).hide();
    angular.element(document.querySelector("#btnContinuingEducationInfo")).click(function () {
        angular.element(document.querySelector("#ContinuingEductationInfoRow")).show();
        angular.element(document.querySelector("#btnContinuingEducationInfo")).hide();
    });
    angular.element(document.querySelector("#btnCancelContinuingEducationInfo")).click(function () {
        angular.element(document.querySelector("#ContinuingEductationInfoRow")).hide();
        angular.element(document.querySelector("#btnContinuingEducationInfo")).show();
    });

    $scope.init = function () {
        try {

            if (sessionStorage.PaymentDone == "true") {
                window.location.href = "#/User/Loginwoemail";
            }
            if ($scope.isSessionActive()) {
                $scope.IndividualRenewalGet();
                $scope.getStateByCountryID(235);

                if (!(sessionStorage.InactiveLicenseCheck == undefined || sessionStorage.InactiveLicenseCheck == "undefined")) {
                    try {
                        if (sessionStorage.InactiveLicenseCheck == "true") {
                            $scope.InactiveLicenseCheck = true;
                        }
                        else {
                            $scope.InactiveLicenseCheck = false;
                        }

                    } catch (e) {
                    }
                }
            }
            else {
                window.location.href = "#/User/Loginwoemail";
                // Else of isSessionActive method
            }
        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }

    $scope.getList = function () {
        try {

        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }
    var curDate = null;
    $scope.serverDate = LicenseRenewalHASnAService.GetServerDate().success(function (response) {
        curDate = response;
    });

    $scope.IndividualRenewalGet = function () {
        $scope.showHASnAFlag = false;
        try {

            ShowLoader("Please wait...");
            resetValidation();
            hideValidationSummary();
            $scope.IndividualRenewal = [];

            LicenseRenewalHASnAService.IndividualRenewalGet(sessionStorage.Key, sessionStorage.UserId)//
			.success(function (response) {
			    HideLoader();
                $scope.showHASnAFlag = true;
			    if ($scope.CheckResponse(response)) {
			        $scope.IndividualRenewal = response.IndividualRenewal;
			        if ($scope.IndividualRenewal != null) {
			            //angular.forEach($scope.IndividualRenewal, function (value, index) {
			            //IndividualLicenseDetails

			            if ($scope.IndividualRenewal.IndividualLicense.length > 0) {
			                $scope.ApplicationNumber = response.IndividualRenewal.Application.ApplicationNumber;
			                sessionStorage.ApplicationNumber = $scope.ApplicationNumber;
			                $scope.IndividualLicenseId = $scope.IndividualRenewal.IndividualLicense[0].IndividualLicenseId;
			                sessionStorage.IndividualLicenseId = $scope.IndividualLicenseId;
			                $scope.IndividualId = $scope.IndividualRenewal.IndividualLicense[0].IndividualId;
			                $scope.ApplicationId = $scope.IndividualRenewal.IndividualLicense[0].ApplicationId;
			                sessionStorage.ApplicationId = $scope.ApplicationId;
			                $scope.ApplicationTypeId = $scope.IndividualRenewal.IndividualLicense[0].ApplicationTypeId;
			                sessionStorage.ApplicationType = $scope.ApplicationTypeId;
			                $scope.LicenseTypeId = $scope.IndividualRenewal.IndividualLicense[0].LicenseTypeId;
			                sessionStorage.LicenseTypeId = $scope.LicenseTypeId;

			                $scope.LicenseTypeGetAll();

			                $scope.IsLicenseTemporary = $scope.IndividualRenewal.IndividualLicense[0].IsLicenseTemporary;

			                $scope.IsLicenseActive = $scope.IndividualRenewal.IndividualLicense[0].IsLicenseActive;

			                if (sessionStorage.IsLicenseActive == undefined || sessionStorage.IsLicenseActive == "undefined") {
			                    $scope.IsLicenseActive = true;
			                }
			                else {
			                    $scope.IsLicenseActive = (sessionStorage.IsLicenseActive === "true");
			                }

			                $scope.LicenseNumber = $scope.IndividualRenewal.IndividualLicense[0].LicenseNumber;
			                sessionStorage.LicenseNumber = $scope.LicenseNumber;
			                $scope.OriginalLicenseDate = $scope.IndividualRenewal.IndividualLicense[0].OriginalLicenseDate;
			                $scope.LicenseEffectiveDate = $scope.IndividualRenewal.IndividualLicense[0].LicenseEffectiveDate;
			                $scope.LicenseExpirationDate = $scope.IndividualRenewal.IndividualLicense[0].LicenseExpirationDate;
			                $scope.LicenseStatusTypeId = $scope.IndividualRenewal.IndividualLicense[0].LicenseStatusTypeId;

			                if ($scope.LicenseStatusTypeId == "6") {
			                    showStatusMessage("Either you are not allowed to renew or you have submitted your renewal.", "warning");
			                    $('#DisplayRenewal').hide();
			                    $('#footer').css("position", "fixed").css("width", "100%").css("bottom", "0");
			                    $('.status-message').css("margin-top", "50px");
			                    return;
			                }

			                $scope.IsActive = $scope.IndividualRenewal.IndividualLicense[0].IsActive;
			                sessionStorage.OriginalLicenseDate = $scope.OriginalLicenseDate;
			                sessionStorage.LicenseExpirationDate = $scope.LicenseExpirationDate;
			                $scope.ActiveInActiveChange($scope.IsLicenseActive);
			            }

			            if ($scope.IsLicenseActive == true) {

			                $scope.LNAStatus = "Active";

			            }
			            else if ($scope.IsLicenseActive == false) {
			                $scope.LNAStatus = "InActive";
			                angular.element(document.querySelector("#InactiveLicense")).show();

			            }

			            //Individual
			            if ($scope.IndividualRenewal.Individual != null) {
			                $scope.IndividualId = $scope.IndividualRenewal.Individual.IndividualId;
			                sessionStorage.IndividualId = $scope.IndividualId;
			                $scope.FirstName = $scope.IndividualRenewal.Individual.FirstName;
			                $scope.MiddleName = $scope.IndividualRenewal.Individual.MiddleName;
			                $scope.LastName = $scope.IndividualRenewal.Individual.LastName;

			                sessionStorage.IndividualName = $scope.FirstName + " " + $scope.LastName;

			                $scope.SuffixId = $scope.IndividualRenewal.Individual.SuffixId;
			                $scope.SSN = $scope.IndividualRenewal.Individual.SSN;
			                $scope.IsItin = $scope.IndividualRenewal.Individual.IsItin;
			                var tempBirthdate = ($filter('date')(new Date($scope.IndividualRenewal.Individual.DateOfBirth), 'MM/dd/yyyy'));
			                $("#txtDOB").val(tempBirthdate);
			                //$scope.DateOfBirth = ($filter('date')(new Date($scope.IndividualRenewal.Individual.DateOfBirth), 'MM/dd/yyyy'));
			                $scope.EmailAddress = $scope.IndividualRenewal.Individual.Email;
			                $scope.RaceId = $scope.IndividualRenewal.Individual.RaceId;
			                $scope.Gender = $scope.IndividualRenewal.Individual.Gender;
			                $scope.HairColorId = $scope.IndividualRenewal.Individual.HairColorId;
			                $scope.EyeColorId = $scope.IndividualRenewal.Individual.EyeColorId;
			                $scope.Weight = $scope.IndividualRenewal.Individual.Weight;
			                $scope.Height = $scope.IndividualRenewal.Individual.Height;
			                $scope.PlaceOfBirth = $scope.IndividualRenewal.Individual.PlaceOfBirth;
			                $scope.CitizenshipId = $scope.IndividualRenewal.Individual.CitizenshipId;
			                $scope.ExternalId = $scope.IndividualRenewal.Individual.ExternalId;
			                $scope.ExternalId2 = $scope.IndividualRenewal.Individual.ExternalId2;
			                $scope.IsArchived = $scope.IndividualRenewal.Individual.IsArchived;
			                $scope.IndividualIsActive = $scope.IndividualRenewal.Individual.IsActive;
			            }

			            //Application
			            if ($scope.IndividualRenewal.Application != null || $scope.IndividualRenewal.Application != undefined) {
			                $scope.ApplicationId = $scope.IndividualRenewal.Application.ApplicationId;
			                sessionStorage.ApplicationId = $scope.ApplicationId;
			                $scope.ApplicationTypeId = $scope.IndividualRenewal.Application.ApplicationTypeId;

			                $scope.ApplicationTypeGetAll();

			                $scope.ApplicationStatusId = $scope.IndividualRenewal.Application.ApplicationStatusId;
			                $scope.ApplicationStatusReasonId = $scope.IndividualRenewal.Application.ApplicationStatusReasonId;
			                $scope.ApplicationNumber = $scope.IndividualRenewal.Application.ApplicationNumber;
			                sessionStorage.ApplicationNumber = $scope.IndividualRenewal.Application.ApplicationNumber;
			                $scope.ApplicationSubmitMode = $scope.IndividualRenewal.Application.ApplicationSubmitMode;
			                $scope.StartedDate = $scope.IndividualRenewal.Application.StartedDate;
			                $scope.SubmittedDate = $scope.IndividualRenewal.Application.SubmittedDate;
			                $scope.ApplicationStatusDate = $scope.IndividualRenewal.Application.ApplicationStatusDate;
			                $scope.PaymentDeadlineDate = $scope.IndividualRenewal.Application.PaymentDeadlineDate;
			                $scope.PaymentDate = $scope.IndividualRenewal.Application.PaymentDate;
			                $scope.ConfirmationNumber = $scope.IndividualRenewal.Application.ConfirmationNumber;
			                $scope.ReferenceNumber = $scope.IndividualRenewal.Application.ReferenceNumber;
			                $scope.IsFingerprintingNotRequired = $scope.IndividualRenewal.Application.IsFingerprintingNotRequired;
			                $scope.IsPaymentRequired = $scope.IndividualRenewal.Application.IsPaymentRequired;
			                $scope.CanProvisionallyHire = $scope.IndividualRenewal.Application.CanProvisionallyHire;
			                $scope.GoPaperless = $scope.IndividualRenewal.Application.GoPaperless;
			                $scope.LicenseRequirementId = $scope.IndividualRenewal.Application.LicenseRequirementId;
			                $scope.WithdrawalReasonId = $scope.IndividualRenewal.Application.WithdrawalReasonId;
			                $scope.LicenseTypeId = $scope.IndividualRenewal.Application.LicenseTypeId;
			                $scope.ApplicationIsActive = $scope.IndividualRenewal.Application.IsActive;
			                sessionStorage.ReferenceNumber = $scope.IndividualRenewal.Application.ReferenceNumber;
			            }

			            //IndividualAddress
			            if ($scope.IndividualRenewal.IndividualAddress.length > 0) {
			                $scope.IndividualAddressId = $scope.IndividualRenewal.IndividualAddress[0].IndividualAddressId;
			                //$scope.IndividualId = $scope.IndividualRenewal.IndividualAddress[0].IndividualId;
			                $scope.AddressId = $scope.IndividualRenewal.IndividualAddress[0].AddressId;
			                $scope.AddressTypeId = $scope.IndividualRenewal.IndividualAddress[0].AddressTypeId;
			                $scope.BeginDate = $scope.IndividualRenewal.IndividualAddress[0].BeginDate;
			                $scope.EndDate = $scope.IndividualRenewal.IndividualAddress[0].EndDate;
			                $scope.IsMailingSameasPhysical = $scope.IndividualRenewal.IndividualAddress[0].IndividualCertification;
			                $scope.IndividualAddressIsActive = $scope.IndividualRenewal.IndividualAddress[0].IsActive;
			                $scope.IsMailingSameasPhysical = $scope.IndividualRenewal.IndividualAddress[0].IsMailingSameasPhysical;
			                if ($scope.IsMailingSameasPhysical == true) {
			                    $scope.Street = $scope.IndividualRenewal.IndividualAddress[0].StreetLine1;
			                    $scope.Street2 = $scope.IndividualRenewal.IndividualAddress[0].StreetLine2;
			                    $scope.City = $scope.IndividualRenewal.IndividualAddress[0].City;
			                    $scope.ZIP = $scope.IndividualRenewal.IndividualAddress[0].Zip;
			                    $scope.State = $scope.IndividualRenewal.IndividualAddress[0].StateCode;

			                    $scope.MailingStreet = $scope.IndividualRenewal.IndividualAddress[0].StreetLine1;
			                    $scope.MailingStreet2 = $scope.IndividualRenewal.IndividualAddress[0].StreetLine2;
			                    $scope.MailingCity = $scope.IndividualRenewal.IndividualAddress[0].City;
			                    $scope.MailingZIP = $scope.IndividualRenewal.IndividualAddress[0].Zip;
			                    $scope.MailingState = $scope.IndividualRenewal.IndividualAddress[0].StateCode;
			                }
			                else {
			                    if ($scope.IndividualRenewal.IndividualAddress.length > 1) {
			                        $scope.Street = $scope.IndividualRenewal.IndividualAddress[1].StreetLine1;
			                        $scope.Street2 = $scope.IndividualRenewal.IndividualAddress[1].StreetLine2;
			                        $scope.City = $scope.IndividualRenewal.IndividualAddress[1].City;
			                        $scope.ZIP = $scope.IndividualRenewal.IndividualAddress[1].Zip;
			                        $scope.State = $scope.IndividualRenewal.IndividualAddress[1].StateCode;


			                    }
			                    else {
			                        $scope.IndividualRenewal.IndividualAddress.push({ IndividualAddressId: 0, IndividualId: $scope.IndividualId, AddressId: 0, AddressTypeId: 2, BeginDate: null, EndDate: null, IsMailingSameasPhysical: true, IsActive: true, Addressee: "", StreetLine1: "", StreetLine2: "", City: "", StateCode: "", Zip: "", CountyId: null, CountryId: 235 });
			                    }
			                    $scope.MailingStreet = $scope.IndividualRenewal.IndividualAddress[0].StreetLine1;
			                    $scope.MailingStreet2 = $scope.IndividualRenewal.IndividualAddress[0].StreetLine2;
			                    $scope.MailingCity = $scope.IndividualRenewal.IndividualAddress[0].City;
			                    $scope.MailingZIP = $scope.IndividualRenewal.IndividualAddress[0].Zip;
			                    $scope.MailingState = $scope.IndividualRenewal.IndividualAddress[0].StateCode;
			                }

			            }
			            else {
			                $scope.IndividualRenewal.IndividualAddress.push({ IndividualAddressId: 0, IndividualId: $scope.IndividualId, AddressId: 0, AddressTypeId: 1, BeginDate: null, EndDate: null, IsMailingSameasPhysical: true, IsActive: true, Addressee: "", StreetLine1: "", StreetLine2: "", City: "", StateCode: "", Zip: "", CountyId: null, CountryId: 235 });
			                $scope.IndividualRenewal.IndividualAddress.push({ IndividualAddressId: 0, IndividualId: $scope.IndividualId, AddressId: 0, AddressTypeId: 2, BeginDate: null, EndDate: null, IsMailingSameasPhysical: true, IsActive: true, Addressee: "", StreetLine1: "", StreetLine2: "", City: "", StateCode: "", Zip: "", CountyId: null, CountryId: 235 });
			            }

			            //Contact
			            //$scope.contactTypeGetAll();
			            //if ($scope.IndividualRenewal.Contact.length > 0) {


			            //$scope.ContactId = $scope.IndividualRenewal.Contact[0].ContactId;
			            //$scope.ContactFirstName = $scope.IndividualRenewal.Contact[0].ContactFirstName;
			            //$scope.ContactLastName = $scope.IndividualRenewal.Contact[0].ContactLastName;
			            //$scope.ContactMiddleName = $scope.IndividualRenewal.Contact[0].ContactMiddleName;
			            //$scope.ContactTypeId = $scope.IndividualRenewal.Contact[0].ContactTypeId;
			            //$scope.Code = $scope.IndividualRenewal.Contact[0].Code;
			            //$scope.ContactInfo = $scope.IndividualRenewal.Contact[0].ContactInfo;
			            //$scope.DateContactValidated = $scope.IndividualRenewal.Contact[0].DateContactValidated;
			            //$scope.ContactIsActive = $scope.IndividualRenewal.Contact[0].IsActive;
			            //}
			            //var i = -1;
			            $scope.IndividualRenewal.Contact[0];
			            angular.forEach($scope.IndividualRenewal.Contact, function (val, ind) {
			                if ($scope.IndividualRenewal.Contact[ind].ContactTypeId == "1") {
			                    $scope.CellPhone = $scope.IndividualRenewal.Contact[ind].ContactInfo;
			                }
			                if ($scope.IndividualRenewal.Contact[ind].ContactTypeId == "2") {
			                    $scope.HomePhone = $scope.IndividualRenewal.Contact[ind].ContactInfo;
			                }

			                if ($scope.IndividualRenewal.Contact[ind].ContactTypeId == "8") {
			                    debugger;
			                    $scope.EmailAddress = $scope.IndividualRenewal.Contact[ind].ContactInfo;

			                }

			                if ($scope.IndividualRenewal.Contact[ind].ContactTypeId == "3") {
			                    debugger;
			                    $scope.MainWorkPhone = $scope.IndividualRenewal.Contact[ind].ContactInfo;

			                }

			                if ($scope.IndividualRenewal.Contact[ind].ContactTypeId == "5") {
			                    debugger;
			                    $scope.Fax = $scope.IndividualRenewal.Contact[ind].ContactInfo;

			                }
			            });

			            //EmploymentInformation
			            $scope.EmploymentInformation = [];
			            if ($scope.IndividualRenewal.IndividualEmployment.length > 0) {
			                for (var i in $scope.IndividualRenewal.IndividualEmployment) {
			                    $scope.EmploymentInformation.push($scope.IndividualRenewal.IndividualEmployment[i]);
			                }

			            }

			            //IndividualCertification
			            if ($scope.IndividualRenewal.IndividualCertification != null) {
			                $scope.IndividualCertificationId = $scope.IndividualRenewal.IndividualCertification.IndividualCertificationId;
			                //$scope.IndividualId = $scope.IndividualRenewal.IndividualCertification.IndividualId;
			                $scope.CertificationTypeId = $scope.IndividualRenewal.IndividualCertification.CertificationTypeId;
			                $scope.ClinicalComptence = $scope.IndividualRenewal.IndividualCertification.ClinicalComptence;
			                $scope.IsClinicalComptence = $scope.IndividualRenewal.IndividualCertification.IsClinicalComptence;
			                $scope.DateIssued = $scope.IndividualRenewal.IndividualCertification.DateIssued;
			                $scope.ABAMember = $scope.IndividualRenewal.IndividualCertification.ABAMember;
			                $scope.PraxisExam = $scope.IndividualRenewal.IndividualCertification.PraxisExam;
			                $scope.IsNBCHIS = $scope.IndividualRenewal.IndividualCertification.IsNBCHIS;
			                $scope.NBCHISAccount = $scope.IndividualRenewal.IndividualCertification.NBCHISAccount;
			                $scope.NBCHISCertificate = $scope.IndividualRenewal.IndividualCertification.NBCHISCertificate;
			                $scope.DatePassed = $scope.IndividualRenewal.IndividualCertification.DatePassed;
			                $scope.ABA = $scope.IndividualRenewal.IndividualCertification.ABA;
			                $scope.ASHA = $scope.IndividualRenewal.IndividualCertification.ASHA;
			                $scope.IsNBCOTCertified = $scope.IndividualRenewal.IndividualCertification.IsNBCOTCertified;
			                $scope.IsNBCOTAppliedforRenewal = $scope.IndividualRenewal.IndividualCertification.IsNBCOTAppliedforRenewal;
			                $scope.IsNBCOTExamScheduled = $scope.IndividualRenewal.IndividualCertification.IsNBCOTExamScheduled;
			                $scope.NBCOTDateTaken = $scope.IndividualRenewal.IndividualCertification.NBCOTDateTaken;
			                $scope.NBCOTDatePassed = $scope.IndividualRenewal.IndividualCertification.NBCOTDatePassed;
			                $scope.NBCOTDateScheduled = $scope.IndividualRenewal.IndividualCertification.NBCOTDateScheduled;
			                $scope.IndividualCertificationIsActive = $scope.IndividualRenewal.IndividualCertification.IsActive;
			            }

			            //SponsorInformation
			            if ($scope.IndividualRenewal.SponsorInformation != null) {
			                $scope.SponsorId = $scope.IndividualRenewal.SponsorInformation.SponsorId;
			                $scope.SponserFirstName = $scope.IndividualRenewal.SponsorInformation.FirstName;
			                $scope.SponserMiddleName = $scope.IndividualRenewal.SponsorInformation.MiddleName;
			                $scope.SponserLastName = $scope.IndividualRenewal.SponsorInformation.LastName;
			                $scope.SponsersLicenseNumber = $scope.IndividualRenewal.SponsorInformation.SupervisorLicenseNumber;
			                $scope.BusinessLocationStreet1 = $scope.IndividualRenewal.SponsorInformation.SponsorAddress[0].StreetLine1;
			                $scope.BusinessLocationStreet2 = $scope.IndividualRenewal.SponsorInformation.SponsorAddress[0].StreetLine2;
			                $scope.BusinessLocationCity = $scope.IndividualRenewal.SponsorInformation.SponsorAddress[0].City;
			                $scope.BusinessLocationState = $scope.IndividualRenewal.SponsorInformation.SponsorAddress[0].StateCode;
			                $scope.BusinessLocationZIP = $scope.IndividualRenewal.SponsorInformation.SponsorAddress[0].Zip;
			            }

			            //if ($scope.LicenseTypeId == 1) {
			            //    removeValidation($("#txtFirstNameOfSponser"), "nat-required", "UI_IndividualRenewalLicenseRenewalHASnAvalidation", "requirederrormessage", "");
			            //    removeValidation($("#txtLastNameOfSponser"), "nat-required", "UI_IndividualRenewalLicenseRenewalHASnAvalidation", "requirederrormessage", "");
			            //    removeValidation($("#txtStreet"), "nat-required", "UI_IndividualRenewalLicenseRenewalHASnAvalidation", "requirederrormessage", "");
			            //    removeValidation($("#txtCity"), "nat-required", "UI_IndividualRenewalLicenseRenewalHASnAvalidation", "requirederrormessage", "");
			            //    removeValidation($("#txtFirstNameOfSponser"), "nat-required", "UI_IndividualRenewalLicenseRenewalHASnAvalidation", "requirederrormessage", "");
			            //    removeValidation($("#txtFirstNameOfSponser"), "nat-required", "UI_IndividualRenewalLicenseRenewalHASnAvalidation", "requirederrormessage", "");
			            //} 

			            //BusinessLicenseInformation
			            if ($scope.IndividualRenewal.BusinessLicenseInformation.length != 0) {
			                $scope.BusinessLicenseInformation = $scope.IndividualRenewal.BusinessLicenseInformation;
			                for (var i in $scope.BusinessLicenseInformation) {
			                    if ($scope.BusinessLicenseInformation[i].ContentItemResponse == true) {
			                        $scope.ContentItemResponse = $scope.BusinessLicenseInformation[i].IndividualNVBusinessLicenseId;
			                    }
			                }
			                //$scope.IndividualNVBusinessLicenseId = $scope.IndividualRenewal.BusinessLicenseInformation[0].IndividualNVBusinessLicenseId;
			                //$scope.IndividualId = $scope.IndividualRenewal.BusinessLicenseInformation[0].IndividualId;
			                //$scope.ContentItemLkId = $scope.IndividualRenewal.BusinessLicenseInformation[0].ContentItemLkId;
			                //$scope.ContentItemHash = $scope.IndividualRenewal.BusinessLicenseInformation[0].ContentItemHash;
			                //$scope.ContentItemResponse = $scope.IndividualRenewal.BusinessLicenseInformation[0].ContentItemResponse;
			                //$scope.Status = $scope.IndividualRenewal.BusinessLicenseInformation[0].Status;
			                $scope.txtNameOfBusinessLicense = $scope.IndividualRenewal.BusinessLicenseInformation[0].NameonBusinessLicense;
			                $scope.txtBusinessLicense = $scope.IndividualRenewal.BusinessLicenseInformation[0].BusinessLicenseNumber;
			                //$scope.BusinessLicenseInformationIsActive = $scope.IndividualRenewal.BusinessLicenseInformation[0].IsActive;
			            }

			            //IndividualChildSupport
			            if ($scope.IndividualRenewal.IndividualChildSupport != null) {

			                $scope.IndividualChildSupport = $scope.IndividualRenewal.IndividualChildSupport;
			                for (var i in $scope.IndividualChildSupport) {
			                    if ($scope.IndividualChildSupport[i].ContentItemResponse == true) {
			                        $scope.RDBAppropriateResponse = $scope.IndividualChildSupport[i].IndividualChildSupportId;
			                    }
			                }
			                $scope.IndividualChildSupportId = $scope.IndividualRenewal.IndividualChildSupport[0].IndividualChildSupportId;
			                //$scope.IndividualId = $scope.IndividualRenewal.IndividualChildSupport[0].IndividualId;
			                $scope.IndividualChildSupportContentItemLkId = $scope.IndividualRenewal.IndividualChildSupport[0].ContentItemLkId;
			                $scope.IndividualChildSupportContentItemNumber = $scope.IndividualRenewal.IndividualChildSupport[0].ContentItemNumber;
			                $scope.IndividualChildSupportContentItemResponse = $scope.IndividualRenewal.IndividualChildSupport[0].ContentItemResponse;
			                $scope.IndividualChildSupportIsActive = $scope.IndividualRenewal.IndividualChildSupport[0].IsActive;
			                $scope.IndividualChildSupportContentDescription = $scope.IndividualRenewal.IndividualChildSupport[0].ContentDescription;
			            }

			            //IndividualVeteran
			            if ($scope.IndividualRenewal.IndividualVeteran != null) {
			                $scope.IndividualVeteranId = $scope.IndividualRenewal.IndividualVeteran.IndividualVeteranId;
			                //$scope.IndividualId = $scope.IndividualRenewal.IndividualVeteran.IndividualId;
			                $scope.Military = $scope.IndividualRenewal.IndividualVeteran.ServedInMilitary;
			                if ($scope.Military == true) {
			                    $scope.Military = "yes";
			                }
			                else {
			                    $scope.Military = "no";
			                }
			                $scope.SpouseofActiveMilitaryMember = $scope.IndividualRenewal.IndividualVeteran.SpouseofActiveMilitaryMember;
			                $scope.MilitarySpecialist = $scope.IndividualRenewal.IndividualVeteran.MilitaryOccupationSpeciality;
			                //$scope.FromDateOfService = $scope.IndividualRenewal.IndividualVeteran.ServiceDateFrom;
			                $scope.FromDateOfService = ($filter('date')(new Date($scope.IndividualRenewal.IndividualVeteran.ServiceDateFrom), 'MM/dd/yyyy'));

			                //$scope.ToDateOfService = $scope.IndividualRenewal.IndividualVeteran.ServiceDateTo;
			                $scope.ToDateOfService = ($filter('date')(new Date($scope.IndividualRenewal.IndividualVeteran.ServiceDateTo), 'MM/dd/yyyy'));
			                $scope.IndividualVeteranIsActive = $scope.IndividualRenewal.IndividualVeteran.IsActive;
			                $scope.VeteranBranches = [];
			                for (var i in $scope.IndividualRenewal.IndividualVeteran.VeteranBranches) {
			                    $scope.VeteranBranches.push($scope.IndividualRenewal.IndividualVeteran.VeteranBranches[i]);
			                }
			                //$scope.VeteranBranches = $scope.IndividualRenewal.IndividualVeteran.VeteranBranches[0];
			            }

			            //IndividualLegal
			            if ($scope.IndividualRenewal.IndividualLegal != null) {
			                sessionStorage.LegalStatus = false;
			                $scope.IndividualLegal = $scope.IndividualRenewal.IndividualLegal;
			                for (var i in $scope.IndividualLegal) {
			                    if ($scope.IndividualLegal[i].ContentItemResponse == true) {
			                        //$scope.IndividualLegal[i].ContentItemResponse = true;
			                        //$scope.IndividualLegal[i].Desc = $scope.IndividualLegal[i].Desc;
			                        sessionStorage.LegalStatus = true;
			                        var cn = '#' + $scope.IndividualLegal[i].ContentItemNumber;
			                        bindNatRequiredEvents($(cn));
			                        $(cn).addClass("UI_IndividualRenewalLicenseRenewalHASnAvalidation");
			                    }
			                }
			            }

			            //IndividualCEH
			            //if ($scope.IndividualRenewal.IndividualCEH.length > 0) {

			            //    $scope.IndividualCEH = $scope.IndividualRenewal.IndividualCEH[0];
			            //}

			            //IndividualAffidavit
			            if ($scope.IndividualRenewal.IndividualAffidavit != null) {
			                $scope.IndividualAffidavitId = $scope.IndividualRenewal.IndividualAffidavit.IndividualAffidavitId;
			                //$scope.IndividualId = $scope.IndividualRenewal.IndividualAffidavit.IndividualId;
			                $scope.IndividualAffidavitContentItemLkId = $scope.IndividualRenewal.IndividualAffidavit.ContentItemLkId;
			                $scope.IndividualAffidavitContentItemHash = $scope.IndividualRenewal.IndividualAffidavit.ContentItemHash;
			                $scope.IndividualAffidavitContentItemResponse = $scope.IndividualRenewal.IndividualAffidavit.ContentItemResponse;
			                $scope.IndividualAffidavitDesc = $scope.IndividualRenewal.IndividualAffidavit.Desc;
			                $scope.IndividualAffidavitIsActive = $scope.IndividualRenewal.IndividualAffidavit.IsActive;
			                $scope.IndividualAffidavitContentDescription = $scope.IndividualRenewal.IndividualAffidavit.ContentDescription;
			                $scope.AckAppliciant = $scope.FirstName + ' ' + $scope.LastName;
			            }

			            // Course Detail
			            if ($scope.IndividualRenewal.IndividualCECourse != null) {
			                $scope.IndividualCECourse = $scope.IndividualRenewal.IndividualCECourse;
			            }
			            //IndividualAffidavit
			            //if ($scope.IndividualRenewal.IndividualAffidavit != null) {
			            //}

			            //FeesDetails
			            if ($scope.IndividualRenewal.FeesDetails.length > 0) {
			                $scope.FeesDetails = $scope.IndividualRenewal.FeesDetails;
			                sessionStorage.FeesDetails = JSON.stringify($scope.FeesDetails);
			                //$scope.UnPaidFees = 0;
			                //sessionStorage.RenewalFees = 0;
			                //sessionStorage.LateFees = 0;
			                //for (var i = 0; i < $scope.FeesDetails.length; i++) {
			                //	if ($scope.FeesDetails[i].Status == "Unpaid") {


			                //		$scope.UnPaidFees = $scope.UnPaidFees + $scope.FeesDetails[i].Amount;
			                //		sessionStorage.Fees = $scope.UnPaidFees;
			                //		$scope.InvoiceNumber = $scope.FeesDetails[i].InvoiceNumber;
			                //	}
			                //	if ($scope.FeesDetails[i].FeeType = "Renewal Fee") {
			                //		sessionStorage.RenewalFees = $scope.UnPaidFees;
			                //	}
			                //	else if ($scope.FeesDetails[i].FeeType = "Late Fee") {
			                //		sessionStorage.LateFees = $scope.FeesDetails[i].Amount;
			                //	}
			                //}
			                $scope.InvoiceNumber = $scope.FeesDetails[0].InvoiceNumber;
			                //sessionStorage.InvoiceNumber = $scope.InvoiceNumber;
			            }
			            HideLoader();
			            //IndividualInfo = response.IndividualRenewal;

			            //});
			        }
			    } else {
			        HideLoader();
			        // Else of CheckResponse Method
                    $scope.showHASnAFlag = true;
			        if (response.StatusCode == "05") {
			            showStatusMessage(response.Message, "warning");
			            $('#DisplayRenewal').hide();
			            $('#footer').css("position", "fixed").css("width", "100%").css("bottom", "0");
			            $('.status-message').css("margin-top", "50px");
			        }
			    }
			}).error(function (data) {
			    HideLoader();
			    showStatusMessage(data, "error");
			});
        }
        catch (ex) {
            HideLoader();
            showStatusMessage(ex.message, "error");
        }
    }

    $scope.ActiveInActiveChange = function (flag) {
        debugger;
        if (flag == true) {
            sessionStorage.IsLicenseActive = true;
            //removeValidation($("#InactiveLicenseCheck"), "nat-required", "UI_IndividualRenewalLicenseRenewalHASnAvalidation", "requirederrormessage", "");
            $scope.FeesActive = true;
            $scope.FeesInActive = false;
            $scope.IndividualRenewal.RequestedLicenseStatusTypeId = 1;
            if (new Date(curDate) > new Date($scope.IndividualRenewal.IndividualLicense[0].LicenseExpirationDate)) {
                //$scope.Fees = '$100.00 + $75.00';

                sessionStorage.RenewalFees = 100.00;
                sessionStorage.LateFees = 75.00;
                $scope.ApplicationFee = sessionStorage.RenewalFees;
                $scope.LateFee = sessionStorage.LateFees;

                $scope.Fees = "$" + $scope.ApplicationFee + " +  $" + $scope.LateFee + ".00";
                $scope.FeesTotal = parseInt($scope.ApplicationFee) + parseInt($scope.LateFee);
            }
            else if (new Date(curDate) <= new Date($scope.IndividualRenewal.IndividualLicense[0].LicenseExpirationDate)) {
                //$scope.Fees = '$100.00';

                sessionStorage.RenewalFees = 100.00;
                sessionStorage.LateFees = 00;
                $scope.ApplicationFee = sessionStorage.RenewalFees;
                $scope.LateFee = sessionStorage.LateFees;

                $scope.Fees = "$" + $scope.ApplicationFee + ".00";
                $scope.FeesTotal = parseInt($scope.ApplicationFee) + parseInt($scope.LateFee);
            }
        }
        else {
            sessionStorage.IsLicenseActive = false;
            //addValidation($("#InactiveLicenseCheck"), "nat-required", "UI_IndividualRenewalLicenseRenewalHASnAvalidation", "requirederrormessage", "Inactive License check is required", "");
            $scope.FeesActive = false;
            $scope.FeesInActive = true;
            $scope.IndividualRenewal.RequestedLicenseStatusTypeId = 4;
            if (new Date(curDate) > new Date($scope.IndividualRenewal.IndividualLicense[0].LicenseExpirationDate)) {
                //$scope.Fees = '$75.00 + $75.00';

                sessionStorage.RenewalFees = 75.00;
                sessionStorage.LateFees = 75.00;
                $scope.ApplicationFee = sessionStorage.RenewalFees;
                $scope.LateFee = sessionStorage.LateFees;

                $scope.Fees = "$" + $scope.ApplicationFee + " +  $" + $scope.LateFee + ".00";
                $scope.FeesTotal = parseInt($scope.ApplicationFee) + parseInt($scope.LateFee);
            }
            else if (new Date(curDate) <= new Date($scope.IndividualRenewal.IndividualLicense[0].LicenseExpirationDate)) {
                //$scope.Fees = '$75.00';

                sessionStorage.RenewalFees = 75.00;
                sessionStorage.LateFees = 00;
                $scope.ApplicationFee = sessionStorage.RenewalFees;
                $scope.LateFee = sessionStorage.LateFees;

                $scope.Fees = "$" + $scope.ApplicationFee + ".00";
                $scope.FeesTotal = parseInt($scope.ApplicationFee) + parseInt($scope.LateFee);
            }
        }
        sessionStorage.RequestedLicenseStatusTypeId = $scope.IndividualRenewal.RequestedLicenseStatusTypeId;
    }
    $scope.VetranInfo = true;
    $scope.ChangeVeteranInfomation = function (flag) {

        if (flag == true) {
            $scope.IndividualRenewal.IndividualVeteran.ServedInMilitary = true;
            addValidation($('#txtMilitaryOccupationSpeciality'), "nat-required", "UI_IndividualRenewalLicenseRenewalHASnAvalidation", "requirederrormessage", "Military Occupation Speciality is required", $('#lblMilitaryOccupationSpeciality'));
            addValidation($('#txtFrom'), "nat-required", "UI_IndividualRenewalLicenseRenewalHASnAvalidation", "requirederrormessage", "Date(s) of Service From is required", $('#lblFrom'));
            addValidation($('#txtTo'), "nat-required", "UI_IndividualRenewalLicenseRenewalHASnAvalidation", "requirederrormessage", "Date(s) of Service To is required", $('#lblTo'));

            $('#txtMilitaryOccupationSpeciality').removeAttr("disabled", "true");
            $('#txtFrom').removeAttr("disabled", "true");
            $('#txtTo').removeAttr("disabled", "true");

            for (var i in $scope.IndividualRenewal.IndividualVeteran.VeteranBranches) {
                var VI = '#' + $scope.IndividualRenewal.IndividualVeteran.VeteranBranches[i].BranchofServicesId;
                $(VI).removeAttr("disabled", "true");
            }
        }
        else {
            $scope.IndividualRenewal.IndividualVeteran.ServedInMilitary = false;
            removeValidation($('#txtMilitaryOccupationSpeciality'), "nat-required", "UI_IndividualRenewalLicenseRenewalHASnAvalidation", "requirederrormessage", $('#lblMilitaryOccupationSpeciality'));
            removeValidation($('#txtFrom'), "nat-required", "UI_IndividualRenewalLicenseRenewalHASnAvalidation", "requirederrormessage", $('#lblFrom'));
            removeValidation($('#txtTo'), "nat-required", "UI_IndividualRenewalLicenseRenewalHASnAvalidation", "requirederrormessage", $('#lblTo'));

            $('#txtFrom').attr("disabled", "true");
            $('#txtMilitaryOccupationSpeciality').attr("disabled", "true");
            $('#txtTo').attr("disabled", "true");

            for (var i in $scope.IndividualRenewal.IndividualVeteran.VeteranBranches) {
                var VI = '#' + $scope.IndividualRenewal.IndividualVeteran.VeteranBranches[i].BranchofServicesId;
                $(VI).attr("disabled", "true");
                $(VI).removeAttr("checked", "checked");
            }

            $scope.MilitarySpecialist = "";
            $('#txtFrom').val("");
            $scope.FromDateOfService = "";
            $('#txtTo').val("");
            $scope.ToDateOfService = "";
        }

    }
    $scope.SaveEmploymentInfo = function () {
        try {
            if (validateData("UI_IndividualRenewalLicenseRenewalHASnAEmployementvalidation")) {
                //$scope.temp[0].EmployeeName = $scope.EmployeeName;
                //$scope.EmploymentInformation.push(EmploymentInfo);
                //$scope.check();
            }
            else {

            }
        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }

    $scope.insert = function () {
        try {
            hideStatusMessage();
            ShowLoader("Please wait...");
            if (validateData("UI_IndividualRenewalLicenseRenewalHASnAvalidation")) {
                if ($scope.validateActiveInactive()) {
                    if ($scope.validateNBLI()) {
                        if ($scope.validateCSI()) {
                            if ($scope.validateEI()) {
                                if ($scope.validateLI()) {
                                    if ($scope.validateLicenseInformationPhone()) {
                                        if ($scope.validateCEI()) {
                                            resetValidation();
                                            hideStatusMessage();
                                            hideValidationSummary();
                                            //$scope.IndividualRenewal = [];
                                            //$scope.IndividualRenewal.push(response.IndividualRenewal);

                                            $scope.IndividualRenewal.Individual.MiddleName = $scope.MiddleName;
                                            //	//IndividualLicenseDetails
                                            $scope.IndividualRenewal.IndividualLicense[0].IndividualLicenseId = $scope.IndividualLicenseId;
                                            $scope.IndividualRenewal.IndividualLicense[0].IndividualId = $scope.IndividualId;
                                            $scope.IndividualRenewal.IndividualLicense[0].ApplicationId = $scope.ApplicationId;
                                            $scope.IndividualRenewal.IndividualLicense[0].ApplicationTypeId = $scope.ApplicationTypeId;
                                            $scope.IndividualRenewal.IndividualLicense[0].LicenseTypeId = $scope.LicenseTypeId;
                                            $scope.IndividualRenewal.IndividualLicense[0].IsLicenseTemporary = $scope.IsLicenseTemporary;
                                            $scope.IndividualRenewal.IndividualLicense[0].IsLicenseActive = $scope.IsLicenseActive;
                                            $scope.IndividualRenewal.IndividualLicense[0].LicenseNumber = $scope.LicenseNumber;
                                            $scope.IndividualRenewal.IndividualLicense[0].OriginalLicenseDate = $scope.OriginalLicenseDate;
                                            $scope.IndividualRenewal.IndividualLicense[0].LicenseEffectiveDate = $scope.LicenseEffectiveDate;
                                            $scope.IndividualRenewal.IndividualLicense[0].LicenseExpirationDate = $scope.LicenseExpirationDate;
                                            $scope.IndividualRenewal.IndividualLicense[0].LicenseStatusTypeId = $scope.LicenseStatusTypeId;
                                            $scope.IndividualRenewal.IndividualLicense[0].IsActive = $scope.IsActive;

                                            //	//Individual
                                            // $scope.IndividualRenewal.Individual.IndividualId = $scope.IndividualId;
                                            $scope.IndividualRenewal.Individual.FirstName = $scope.FirstName;
                                            $scope.IndividualRenewal.Individual.MiddleName = $scope.MiddleName;
                                            $scope.IndividualRenewal.Individual.LastName = $scope.LastName;
                                            //$scope.IndividualRenewal.Individual.SuffixId = $scope.SuffixId;
                                            //$scope.IndividualRenewal.Individual.SSN = $scope.SSN;
                                            //$scope.IndividualRenewal.Individual.IsItin = $scope.IsItin;
                                            $scope.IndividualRenewal.Individual.DateOfBirth = $('#txtDOB').val();
                                            $scope.IndividualRenewal.Individual.Email = $scope.EmailAddress;
                                            sessionStorage.FirstName = $scope.FirstName;
                                            sessionStorage.LastName = $scope.LastName;
                                            sessionStorage.Email = $scope.EmailAddress;
                                            debugger;
                                            $scope.NewContact = [];
                                            var cp = {
                                                BeginDate: "2013-08-20T00:00:00",
                                                Code: "C",
                                                ContactFirstName: "",
                                                ContactId: 0,
                                                ContactInfo: $scope.CellPhone,
                                                ContactLastName: "",
                                                ContactMiddleName: "",
                                                ContactTypeId: "1",
                                                DateContactValidated: null,
                                                EndDate: null,
                                                IndividualContactId: 0,
                                                IndividualId: $scope.IndividualId,
                                                IsActive: true,
                                                IsMobile: false,
                                                IsPreferredContact: false
                                            }
                                            $scope.NewContact.push(cp);
                                            //IndividualRenewal.Contact[ind].ContactTypeId == "1"
                                            var hp = {
                                                BeginDate: "2013-08-20T00:00:00",
                                                Code: "H",
                                                ContactFirstName: "",
                                                ContactId: 0,
                                                ContactInfo: $scope.HomePhone,
                                                ContactLastName: "",
                                                ContactMiddleName: "",
                                                ContactTypeId: "2",
                                                DateContactValidated: null,
                                                EndDate: null,
                                                IndividualContactId: 0,
                                                IndividualId: $scope.IndividualId,
                                                IsActive: true,
                                                IsMobile: false,
                                                IsPreferredContact: false
                                            }
                                            $scope.NewContact.push(hp);
                                            var hp = {
                                                BeginDate: "2013-08-20T00:00:00",
                                                Code: "E",
                                                ContactFirstName: "",
                                                ContactId: 0,
                                                ContactInfo: $scope.EmailAddress,
                                                ContactLastName: "",
                                                ContactMiddleName: "",
                                                ContactTypeId: "8",
                                                DateContactValidated: null,
                                                EndDate: null,
                                                IndividualContactId: 0,
                                                IndividualId: $scope.IndividualId,
                                                IsActive: true,
                                                IsMobile: false,
                                                IsPreferredContact: false
                                            }
                                            $scope.NewContact.push(hp);
                                            var hp = {
                                                BeginDate: "2013-08-20T00:00:00",
                                                Code: "W",
                                                ContactFirstName: "",
                                                ContactId: 0,
                                                ContactInfo: $scope.MainWorkPhone,
                                                ContactLastName: "",
                                                ContactMiddleName: "",
                                                ContactTypeId: "3",
                                                DateContactValidated: null,
                                                EndDate: null,
                                                IndividualContactId: 0,
                                                IndividualId: $scope.IndividualId,
                                                IsActive: true,
                                                IsMobile: false,
                                                IsPreferredContact: false
                                            }
                                            $scope.NewContact.push(hp);
                                            var hp = {
                                                BeginDate: "2013-08-20T00:00:00",
                                                Code: "F",
                                                ContactFirstName: "",
                                                ContactId: 0,
                                                ContactInfo: $scope.Fax,
                                                ContactLastName: "",
                                                ContactMiddleName: "",
                                                ContactTypeId: "3",
                                                DateContactValidated: null,
                                                EndDate: null,
                                                IndividualContactId: 0,
                                                IndividualId: $scope.IndividualId,
                                                IsActive: true,
                                                IsMobile: false,
                                                IsPreferredContact: false
                                            }
                                            $scope.NewContact.push(hp);
                                            try {
                                                angular.forEach($scope.NewContact, function (value, index) {
                                                    debugger;
                                                    var result = $filter('filter')($scope.IndividualRenewal.Contact, function (d) { return d.Code === value.Code; });
                                                    if (result.length > 0) {
                                                        debugger;
                                                        $scope.NewContact[index].ContactId = result[0].ContactId;
                                                        $scope.NewContact[index].IndividualContactId = result[0].IndividualContactId;
                                                    }
                                                });
                                            } catch (e) { }
                                            debugger;
                                            $scope.IndividualRenewal.Contact = $scope.NewContact;
                                            //	//IndividualAddress
                                            if ($scope.IndividualRenewal.IndividualAddress.length > 0) {

                                                for (var i = 0; i < $scope.IndividualRenewal.IndividualAddress.length; i++) {



                                                    if ($scope.IsMailingSameasPhysical == true) {

                                                        $scope.IndividualRenewal.IndividualAddress[i].IsMailingSameasPhysical = $scope.IsMailingSameasPhysical;
                                                        //$scope.IndividualRenewal.IndividualAddress[i].IsActive = $scope.IndividualAddressIsActive;
                                                        $scope.IndividualRenewal.IndividualAddress[i].StreetLine1 = $scope.Street;
                                                        $scope.IndividualRenewal.IndividualAddress[i].StreetLine2 = $scope.Street2;
                                                        $scope.IndividualRenewal.IndividualAddress[i].City = $scope.City;
                                                        $scope.IndividualRenewal.IndividualAddress[i].Zip = $scope.ZIP;
                                                        $scope.IndividualRenewal.IndividualAddress[i].StateCode = $scope.State;
                                                        sessionStorage.Street = $scope.Street;
                                                        sessionStorage.City = $scope.City;
                                                        //sessionStorage.Country = $scope.MailingCity;
                                                        sessionStorage.State = $scope.State;
                                                        sessionStorage.Zip = $scope.ZIP;


                                                    }
                                                    else {
                                                        if ($scope.IndividualRenewal.IndividualAddress[i].AddressTypeId == 1) {



                                                            $scope.IndividualRenewal.IndividualAddress[i].IsMailingSameasPhysical = $scope.IsMailingSameasPhysical;
                                                            // $scope.IndividualRenewal.IndividualAddress[i].IsActive = $scope.IndividualAddressIsActive;
                                                            $scope.IndividualRenewal.IndividualAddress[i].StreetLine1 = $scope.MailingStreet;
                                                            $scope.IndividualRenewal.IndividualAddress[i].StreetLine2 = $scope.MailingStreet2;
                                                            $scope.IndividualRenewal.IndividualAddress[i].City = $scope.MailingCity;
                                                            $scope.IndividualRenewal.IndividualAddress[i].Zip = $scope.MailingZIP;
                                                            $scope.IndividualRenewal.IndividualAddress[i].StateCode = $scope.MailingState;
                                                            sessionStorage.Street = $scope.MailingStreet;
                                                            sessionStorage.City = $scope.MailingCity;
                                                            //sessionStorage.Country = $scope.MailingCity;
                                                            sessionStorage.State = $scope.MailingState;
                                                            sessionStorage.Zip = $scope.MailingZIP;
                                                        }
                                                        else {
                                                            $scope.IndividualRenewal.IndividualAddress[i].IsMailingSameasPhysical = $scope.IsMailingSameasPhysical;
                                                            //$scope.IndividualRenewal.IndividualAddress[i].IsActive = $scope.IndividualAddressIsActive;
                                                            $scope.IndividualRenewal.IndividualAddress[i].StreetLine1 = $scope.Street;
                                                            $scope.IndividualRenewal.IndividualAddress[i].StreetLine2 = $scope.Street2;
                                                            $scope.IndividualRenewal.IndividualAddress[i].City = $scope.City;
                                                            $scope.IndividualRenewal.IndividualAddress[i].Zip = $scope.ZIP;
                                                            $scope.IndividualRenewal.IndividualAddress[i].StateCode = $scope.State;
                                                            sessionStorage.Street = $scope.Street;
                                                            sessionStorage.City = $scope.City;
                                                            //sessionStorage.Country = $scope.MailingCity;
                                                            sessionStorage.State = $scope.State;
                                                            sessionStorage.Zip = $scope.ZIP;
                                                        }
                                                    }

                                                }
                                            } else {
                                                $scope.IndividualRenewal.IndividualAddress = null;
                                            }

                                            //	//EmploymentInformation
                                            //	$scope.EmploymentInformation = $scope.IndividualRenewal.EmploymentInformation[0];
                                            //$scope.IndividualRenewal.EmploymentInformation = $scope.EmploymentInformation;

                                            $scope.IndividualRenewal.IndividualEmployment = $scope.EmploymentInformation;
                                            //	//IndividualCertification
                                            if ($scope.IndividualRenewal.IndividualCertification != null) {
                                                $scope.IndividualRenewal.IndividualCertification.IndividualCertificationId = $scope.IndividualCertificationId;
                                                $scope.IndividualRenewal.IndividualCertification.IndividualId = $scope.IndividualId;
                                                $scope.IndividualRenewal.IndividualCertification.CertificationTypeId = $scope.CertificationTypeId;
                                                $scope.IndividualRenewal.IndividualCertification.ClinicalComptence = $scope.ClinicalComptence;
                                                $scope.IndividualRenewal.IndividualCertification.IsClinicalComptence = $scope.IsClinicalComptence;
                                                $scope.IndividualRenewal.IndividualCertification.DateIssued = $scope.DateIssued;
                                                $scope.IndividualRenewal.IndividualCertification.ABAMember = $scope.ABAMember;
                                                $scope.IndividualRenewal.IndividualCertification.PraxisExam = $scope.PraxisExam;
                                                $scope.IndividualRenewal.IndividualCertification.IsNBCHIS = $scope.IsNBCHIS;
                                                $scope.IndividualRenewal.IndividualCertification.NBCHISAccount = $scope.NBCHISAccount;
                                                $scope.IndividualRenewal.IndividualCertification.NBCHISCertificate = $scope.NBCHISCertificate;
                                                $scope.IndividualRenewal.IndividualCertification.DatePassed = $scope.DatePassed;
                                                $scope.IndividualRenewal.IndividualCertification.ABA = $scope.ABA;
                                                $scope.IndividualRenewal.IndividualCertification.ASHA = $scope.ASHA;
                                                $scope.IndividualRenewal.IndividualCertification.IsNBCOTCertified = $scope.IsNBCOTCertified;
                                                $scope.IndividualRenewal.IndividualCertification.IsNBCOTAppliedforRenewal = $scope.IsNBCOTAppliedforRenewal;
                                                $scope.IndividualRenewal.IndividualCertification.IsNBCOTExamScheduled = $scope.IsNBCOTExamScheduled;
                                                $scope.IndividualRenewal.IndividualCertification.NBCOTDateTaken = $scope.NBCOTDateTaken;
                                                $scope.IndividualRenewal.IndividualCertification.NBCOTDatePassed = $scope.NBCOTDatePassed;
                                                $scope.IndividualRenewal.IndividualCertification.NBCOTDateScheduled = $scope.NBCOTDateScheduled;
                                                $scope.IndividualRenewal.IndividualCertification.IndividualCertificationIsActive = $scope.IndividualCertificationIsActive;
                                            }
                                            else {
                                                $scope.IndividualRenewal.IndividualCertification = null;
                                            }


                                            //	//SponsorInformation
                                            if ($scope.IndividualRenewal.SponsorInformation != null) {
                                                //$scope.IndividualRenewal.SponsorInformation.SponsorId = 1;
                                                $scope.IndividualRenewal.SponsorInformation.FirstName = $scope.SponserFirstName;
                                                $scope.IndividualRenewal.SponsorInformation.MiddleName = $scope.SponserMiddleName;
                                                $scope.IndividualRenewal.SponsorInformation.LastName = $scope.SponserLastName;
                                                $scope.IndividualRenewal.SponsorInformation.SupervisorLicenseNumber = $scope.SponsersLicenseNumber;
                                                $scope.IndividualRenewal.SponsorInformation.SponsorAddress[0].StreetLine1 = $scope.BusinessLocationStreet1;
                                                $scope.IndividualRenewal.SponsorInformation.SponsorAddress[0].StreetLine2 = $scope.BusinessLocationStreet2;
                                                $scope.IndividualRenewal.SponsorInformation.SponsorAddress[0].City = $scope.BusinessLocationCity;
                                                $scope.IndividualRenewal.SponsorInformation.SponsorAddress[0].StateCode = $scope.BusinessLocationState;
                                                $scope.IndividualRenewal.SponsorInformation.SponsorAddress[0].Zip = $scope.BusinessLocationZIP;

                                            }
                                            else {
                                                $scope.IndividualRenewal.SponsorInformation = {
                                                    IndividualSupervisoryInfoId: 1,
                                                    IndividualId: $scope.IndividualId,
                                                    ApplicationId: $scope.ApplicationId,
                                                    SupervisorLicenseNumber: $scope.SponsersLicenseNumber,
                                                    IsActive: true,
                                                    IndividualNameId: 1,
                                                    FirstName: $scope.SponserFirstName,
                                                    MiddleName: $scope.SponserMiddleName,
                                                    LastName: $scope.SponserLastName,
                                                    SupervisorWorkAddressId: 1,
                                                    SponsorAddress: [{
                                                        AddressId: 1,
                                                        StreetLine1: $scope.BusinessLocationStreet1,
                                                        StreetLine2: $scope.BusinessLocationStreet2,
                                                        City: $scope.BusinessLocationCity,
                                                        StateCode: $scope.BusinessLocationState,
                                                        Zip: $scope.BusinessLocationZIP
                                                    }]
                                                }
                                            }

                                            $scope.IndividualRenewal.BusinessLicenseInformation[0].NameonBusinessLicense = $('#txtNameOfBusinessLicense').val();
                                            $scope.IndividualRenewal.BusinessLicenseInformation[0].BusinessLicenseNumber = $('#txtBusinessLicense').val();

                                            //	//IndividualVeteran
                                            if ($scope.IndividualRenewal.IndividualVeteran != null) {

                                                $scope.IndividualRenewal.IndividualVeteran.IndividualVeteranId = $scope.IndividualVeteranId;
                                                $scope.IndividualRenewal.IndividualVeteran.IndividualId = $scope.IndividualId;
                                                if ($scope.Military == "yes") {
                                                    Military = true;
                                                }
                                                else {
                                                    Military = false;
                                                }
                                                $scope.IndividualRenewal.IndividualVeteran.ServedInMilitary = Military;
                                                $scope.IndividualRenewal.IndividualVeteran.SpouseofActiveMilitaryMember = $scope.SpouseofActiveMilitaryMember;
                                                $scope.IndividualRenewal.IndividualVeteran.MilitaryOccupationSpeciality = $scope.MilitarySpecialist;
                                                $scope.IndividualRenewal.IndividualVeteran.ServiceDateFrom = $('#txtFrom').val();
                                                $scope.IndividualRenewal.IndividualVeteran.ServiceDateTo = $('#txtTo').val();
                                                $scope.IndividualRenewal.IndividualVeteran.IndividualVeteranIsActive = $scope.IndividualVeteranIsActive;
                                                //$scope.IndividualRenewal.IndividualVeteran.VeteranBranches = $scope.branches;

                                            }
                                            else {
                                                $scope.IndividualRenewal.IndividualVeteran = null;
                                            }


                                            //	//VeteranBranches
                                            //	$scope.VeteranBranches = $scope.IndividualRenewal.IndividualVeteran.VeteranBranches[0];

                                            //IndividualLegal
                                            //$scope.IndividualRenewal.IndividualLegal[0] = $scope.IndividualLegal;
                                            //	//IndividualCEH
                                            //	$scope.IndividualCEH = $scope.IndividualRenewal.IndividualCEH[0];

                                            //	//IndividualAffidavit
                                            $scope.IndividualRenewal.IndividualAffidavit.IndividualAffidavitId = $scope.IndividualAffidavitId;
                                            $scope.IndividualRenewal.IndividualAffidavit.IndividualId = $scope.IndividualId;
                                            $scope.IndividualRenewal.IndividualAffidavit.ContentItemLkId = $scope.IndividualAffidavitContentItemLkId;
                                            //$scope.IndividualRenewal.IndividualAffidavit.ContentItemHash = $scope.IndividualAffidavitContentItemHash;
                                            $scope.IndividualRenewal.IndividualAffidavit.ContentItemResponse = $scope.IndividualAffidavitContentItemResponse;
                                            $scope.IndividualRenewal.IndividualAffidavit.Desc = $('#txtDateOfApplication').val();
                                            $scope.IndividualRenewal.IndividualAffidavit.IsActive = $scope.IndividualAffidavitIsActive;
                                            $scope.IndividualRenewal.IndividualAffidavit.ContentDescription = $scope.IndividualAffidavitContentDescription;
                                            //FeesDetails
                                            // $scope.FeesDetails = $scope.IndividualRenewal.FeesDetails[0];

                                            //$scope.IndividualLicense = $scope.IndividualRenewal.IndividualLicense[0];
                                            //$scope.Individual = $scope.IndividualRenewal.Individual;
                                            //$scope.Application = $scope.IndividualRenewal.Application;
                                            //$scope.IndividualAddress = $scope.IndividualRenewal.IndividualAddress[0];
                                            //$scope.Contact = $scope.IndividualRenewal.Contact[0];
                                            //$scope.EmploymentInformation = $scope.IndividualRenewal.EmploymentInformation[0];
                                            //$scope.EmploymentAddress = $scope.EmploymentInformation[0].EmploymentAddress;

                                            debugger;
                                            if ($scope.IndividualCECourse.length > 0) {
                                                $scope.IndividualRenewal.IndividualCECourse = $scope.IndividualCECourse;
                                            }

                                            //alert(JSON.stringify($scope.IndividualRenewal));
                                            exportRenewalApplicationToPDF();
                                            LicenseRenewalHASnAService.IndividualRenewalSave(sessionStorage.Key, $scope.IndividualRenewal)
                                                               .success(function (response) {

                                                                   if ($scope.CheckResponse(response)) {

                                                                       showStatusMessage("Saved successfully", "success");
                                                                       if ($scope.paymentFlag == true) {
                                                                           window.location.href = "#/User/Payment";
                                                                       }
                                                                       $scope.IndividualRenewalGet();
                                                                       //HideLoader();
                                                                       //IndividualInfo = response.IndividualRenewal;


                                                                   } else {
                                                                       // Else of CheckResponse Method
                                                                   }
                                                                   HideLoader();
                                                               })
                                                               .error(function (data) {
                                                                   showStatusMessage(data.message, "error");
                                                                   HideLoader();
                                                               });
                                        }
                                        else {
                                            HideLoader();
                                        }
                                    }
                                    else {
                                        $scope.validateCEI()
                                        HideLoader();
                                    }
                                }
                                else {
                                    $scope.validateCEI()
                                    $scope.validateLicenseInformationPhone();
                                    HideLoader();
                                }
                            }
                            else {
                                $scope.validateCEI()
                                $scope.validateLI();
                                $scope.validateLicenseInformationPhone();
                                HideLoader();
                            }
                        }
                        else {
                            $scope.validateCEI()
                            $scope.validateEI();
                            $scope.validateLI();
                            $scope.validateLicenseInformationPhone();
                            HideLoader();
                        }
                    }
                    else {
                        $scope.validateCEI()
                        $scope.validateCSI();
                        $scope.validateEI();
                        $scope.validateLI();
                        $scope.validateLicenseInformationPhone();
                        HideLoader();
                    }
                }
                else {
                    $scope.validateCEI()
                    $scope.validateCSI();
                    $scope.validateEI();
                    $scope.validateLI();
                    $scope.validateLicenseInformationPhone();
                    $scope.validateNBLI();
                    HideLoader();
                }

            }
            else {
                $scope.validateCEI()
                $scope.validateNBLI();
                $scope.validateCSI();
                $scope.validateEI();
                $scope.validateLI();
                $scope.validateLicenseInformationPhone();
                $scope.validateActiveInactive();
                HideLoader();
            }
        }
        catch (ex) {

            HideLoader();
            showStatusMessage(ex.message, "error");
        }
    }

    $scope.update = function () {
        try {
            if (validateData()) {

            }
            else {

            }
        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }

    $scope.delete = function () {
        try {

        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }

    $scope.checkLegal = function (number) {

        for (var i = 0; i < $scope.IndividualLegal.length; i++) {

            if ($scope.IndividualLegal[i].ContentItemNumber == number) {
                //  alert($scope.IndividualLegal[i].ContentItemResponse);
                $('input[name=LicenseRenewalradio' + number + ']').prop('checked', $scope.IndividualLegal[i].ContentItemResponse);
                // alert($("input[LicenseRenewalradio"+number+"]:checked").val(true));
                //$('#LicenseRenewalradio' + $scope.IndividualLegal[i].ContentItemNumber).checked=true;//$scope.IndividualLegal[i].ContentItemResponse
            }
        }
    }

    // Get State List by CountryID
    $scope.getStateByCountryID = function (CountryID) {
        try {
            CouncilInfoService.GetStateByCountryID(sessionStorage.Key, CountryID)
					.success(function (response) {

					    if ($scope.CheckResponse(response)) {
					        $scope.StatList = response.State;
					    } else {
					        //else of CheckResponse
					    }
					})
					.error(function (data) {
					    showStatusMessage(data.message, "error");
					});
        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }

    // Get State List by CountryID
    $scope.contactTypeGetAll = function () {
        try {
            LicenseRenewalHASnAService.ContactTypeGetAll(sessionStorage.Key)
					.success(function (response) {

					    if ($scope.CheckResponse(response)) {
					        $scope.ContactTypeList = response.ContactTypeGetList;
					    } else {
					        //else of CheckResponse
					    }
					})
					.error(function (data) {
					    showStatusMessage(data.message, "error");
					});
        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }

    $scope.makeSameAsPhysicalAddressOnChange = function () {
        if ($scope.IsMailingSameasPhysical == true) {
            $scope.MailingStreet = $scope.Street;
            $scope.MailingCity = $scope.City;
            $scope.MailingStreet2 = $scope.Street2;
            $scope.MailingState = $scope.State;
            $scope.MailingZIP = $scope.ZIP;
            $scope.IsMailingSameasPhysical = true;
            resetValidation();
        }
    }

    $scope.makeSameAsPhysicalAddress = function ($event) {
        var checkbox = $event.target;
        if (checkbox.checked) {
            $scope.MailingStreet = $scope.Street;
            $scope.MailingCity = $scope.City;
            $scope.MailingStreet2 = $scope.Street2;
            $scope.MailingState = $scope.State;
            $scope.MailingZIP = $scope.ZIP;

            $scope.IsMailingSameasPhysical = true;

        } else {
            $scope.MailingStreet = "";
            $scope.MailingCity = "";
            $scope.MailingStreet2 = "";
            $scope.MailingState = "";
            $scope.MailingZIP = "";

            $scope.IsMailingSameasPhysical = false;
        }
        resetValidation();
    }

    $scope.addCourse = function () {
        if (validateData("UI_IndividualRenewalLicenseRenewalHASnAEducationInformationvalidationCE")) {
            $scope.IndividualCECourse.push({ IndividualCECourseId: 0, IndividualId: $scope.IndividualId, ApplicationId: $scope.ApplicationId, CECourseTypeId: null, CECourseActivityTypeId: null, CECourseStartDate: null, CECourseEndDate: null, CECourseDueDate: null, CECourseDate: new Date($('#txtDate').val()), CECourseHours: $scope.EducationInformationCEHours, CECourseUnits: 0.00, ProgramSponsor: null, CourseNameTitle: $scope.EducationInformationCourse, CourseSponsor: null, CECourseReportingYear: null, CECourseStatusId: null, InstructorBiography: null, ActivityDesc: null, ReferenceNumber: null, IsActive: true });
            $scope.EducationInformationDate = "";
            $scope.EducationInformationCourse = "";
            $scope.EducationInformationCEHours = "";
            angular.element(document.querySelector("#ContinuingEductationInfoRow")).hide();
            angular.element(document.querySelector("#btnContinuingEducationInfo")).show();
        }
    }

    $scope.checkLegalRB = function (ContentItemNumber) {
        try {
            for (i in $scope.IndividualLegal) {
                if ($scope.IndividualLegal[i].ContentItemNumber == ContentItemNumber) {

                    $scope.IndividualLegal[i].ContentItemResponse = true;
                    $scope.IndividualLegal[i].Desc = $scope.IndividualLegal[i].Desc;
                    var cn = '#' + ContentItemNumber;
                    addValidation($(cn), "nat-required", "UI_IndividualRenewalLicenseRenewalHASnAvalidation", "requirederrormessage", "Legal Information " + (parseInt(i) + 1) + " Individual Description  is required", "");
                }
            }
            sessionStorage.LegalStatus = true;
        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }

    $scope.checkLegalRB1 = function (ContentItemNumber) {
        try {
            for (i in $scope.IndividualLegal) {
                if ($scope.IndividualLegal[i].ContentItemNumber == ContentItemNumber) {
                    $scope.IndividualLegal[i].ContentItemResponse = false;
                    var cn = '#' + ContentItemNumber;
                    removeValidation($(cn), "nat-required", "UI_IndividualRenewalLicenseRenewalHASnAvalidation", "requirederrormessage", "");
                }
            }
        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }
    $scope.processToPayment = function () {
        try {
            $scope.paymentFlag = true;
            $scope.insert();
        } catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }
    $scope.employmentEditIndex = 0;
    $scope.EditEmploymentInformation = function (IndividualEmploymentId, $index) {
        try {

            $scope.employmentEditIndex = $index;
            for (i in $scope.EmploymentInformation) {
                if ($scope.EmploymentInformation[i].IndividualEmploymentId == IndividualEmploymentId || $scope.$index == $index) {
                    angular.element(document.querySelector("#btnEmploymentInformation")).hide();
                    angular.element(document.querySelector("#LicenseRenewal_EmploymentInformation")).show();
                    $scope.IndividualEmploymentId = $scope.EmploymentInformation[i].IndividualEmploymentId;
                    $scope.EmployerName = $scope.EmploymentInformation[i].EmployerName;
                    $scope.PhysicalAddressStreet = $scope.EmploymentInformation[i].EmploymentAddress[0].StreetLine1;
                    $scope.PhysicalAddressStreet2 = $scope.EmploymentInformation[i].EmploymentAddress[0].StreetLine2;
                    $scope.EmployerCity = $scope.EmploymentInformation[i].EmploymentAddress[0].City;
                    $scope.PhysicalAddressState = $scope.EmploymentInformation[i].EmploymentAddress[0].StateCode;
                    $scope.PhysicalAddressZIP = $scope.EmploymentInformation[i].EmploymentAddress[0].Zip;
                    debugger;
                    if ($scope.EmploymentInformation[i].EmploymentContact.length > 0) {
                        if ($scope.EmploymentInformation[i].EmploymentContact[0].ContactTypeId == "3") {
                            $scope.WorkPhone = $scope.EmploymentInformation[i].EmploymentContact[0].ContactInfo;
                        }
                        if ($scope.EmploymentInformation[i].EmploymentContact[0].ContactTypeId == "4") {
                            $scope.AlternatePhone = $scope.EmploymentInformation[i].EmploymentContact[0].ContactInfo;
                        }
                    }

                    $scope.chkEmployment = false;
                }
            }
            $scope.IndividualRenewal.IndividualEmployment = $scope.EmploymentInformation;
        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }

    $scope.ApplicationTypeGetAll = function () {
        try {
            LicenseRenewalHASnAService.ApplicationTypeGetAll(sessionStorage.Key)
					.success(function (response) {

					    if ($scope.CheckResponse(response)) {
					        $scope.ApplicationTypeGetAll = response.ApplicationTypeGetList;
					        for (var i in $scope.ApplicationTypeGetAll) {
					            if ($scope.ApplicationTypeGetAll[i].ApplicationTypeId == $scope.ApplicationTypeId) {
					                debugger;
					                sessionStorage.ApplicationTypeName = $scope.ApplicationTypeGetAll[i].Name;
					            }
					        }
					    } else {
					        //else of CheckResponse
					    }
					})
					.error(function (data) {
					    showStatusMessage(data.message, "error");
					});
        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }

    $scope.LicenseTypeGetAll = function () {
        try {
            LicenseRenewalHASnAService.LicenseTypeGetAll(sessionStorage.Key)
					.success(function (response) {
					    debugger;
					    if ($scope.CheckResponse(response)) {
					        $scope.LicenseTypeGetAll = response.LicenseTypeGetList;
					        for (var i in $scope.LicenseTypeGetAll) {
					            if ($scope.LicenseTypeGetAll[i].LicenseTypeId == $scope.LicenseTypeId) {
					                sessionStorage.LicenseTypeName = $scope.LicenseTypeGetAll[i].LicenseTypeName;
					            }
					        }
					    } else {
					        //else of CheckResponse
					    }
					})
					.error(function (data) {
					    showStatusMessage(data.message, "error");
					});
        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }
    //$scope.DeleteEmploymentInformation = function ($index) {
    //    try {
    //        
    //        $scope.EmploymentInformation.splice($scope.EmploymentInformation.indexOf($index), 1);
    //        $scope.IndividualRenewal.IndividualEmployment = $scope.EmploymentInformation;
    //    } catch (ex) {
    //        showStatusMessage(ex.message, "error");
    //    }
    //}

    $scope.DeleteEmploymentInformation = function (IndividualEmploymentId, $index) {
        try {
            if (confirm("Are you sure want to delete this record?")) {

                for (i in $scope.EmploymentInformation) {
                    if ($scope.EmploymentInformation[i].IndividualEmploymentId == IndividualEmploymentId) {
                        $scope.IndividualEmploymentId = $scope.EmploymentInformation[i].IndividualEmploymentId;
                        $scope.EmploymentInformation[i].IsDeleted = true;
                        //$scope.IndividualRenewal.IndividualEmployment = $scope.EmploymentInformation;
                        //$scope.EmploymentInformation.splice($scope.EmploymentInformation.indexOf($index - 2), 1);
                        $scope.IndividualRenewal.IndividualEmployment = $scope.EmploymentInformation;
                        //$scope.chkEmployment = false;
                    }
                }
            }

            //angular.element(document.querySelector("#LicenseRenewal_EmploymentInformation")).show();
        } catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }

    $scope.SaveEmploymentInformation = function () {
        try {
            debugger;
            var IndividualEmploymentId = $scope.IndividualEmploymentId;
            if ($scope.employmentEditIndex == 0) {
                if ($scope.validateEmploymentInformationPhone()) {
                    //if ($scope.chkEmployment = true) {

                    if (validateData("UI_IndividualRenewalLicenseRenewalHASnAEmployementvalidation")) {
                        if ($scope.WorkPhone != null && $scope.WorkPhone != "") {
                            WorkCode = "W";
                            WorkContactTypeId = 3;
                            WorkContactInfo = $scope.WorkPhone;
                        }
                        else {
                            WorkCode = "";
                            WorkContactTypeId = null;
                        }
                        if ($scope.AlternatePhone != null && $scope.AlternatePhone != "") {
                            AlternateCode = "A";
                            AlternateContactTypeId = 4;
                            AlternateContactInfo = $scope.AlternatePhone;
                        }
                        else {
                            AlternateCode = "";
                            AlternateContactTypeId = null;
                        }
                        $scope.EmploymentInformation.push({ IndividualEmploymentId: 0, IndividualId: $scope.IndividualId, ApplicationId: $scope.ApplicationId, EmployerName: $scope.EmployerName, ProviderId: 0, EmploymentHistoryTypeId: null, EmploymentStartDate: $scope.EmploymentStartDate, EmploymentEndDate: null, EmploymentStatusId: null, EmploymentTypeId: null, PositionId: null, IsWorkinginFieldofApplication: false, EverWorkedinFieldofApplication: false, ReferenceNumber: "", Role: null, IsActive: true, IsDeleted: false, EmploymentAddress: [{ IndividualEmploymentAddressId: 0, IndividualId: $scope.IndividualId, AddressId: 0, IndividualEmploymentId: 0, AddressTypeId: 1, BeginDate: $scope.EmploymentStartDate, EndDate: null, IsMailingSameasPhysical: false, IsActive: true, Addressee: "", StreetLine1: $scope.PhysicalAddressStreet, StreetLine2: $scope.PhysicalAddressStreet2, City: $scope.EmployerCity, StateCode: $scope.PhysicalAddressState, Zip: $scope.PhysicalAddressZIP, CountyId: null, CountryId: 235 }], EmploymentContact: [{ IndividualEmploymentContactId: 0, IndividualId: $scope.IndividualId, ContactId: 0, IndividualEmploymentId: 0, ContactTypeId: WorkContactTypeId, BeginDate: $scope.EmploymentStartDate, EndDate: null, IsPreferredContact: true, IsMobile: true, IsActive: true, ContactFirstName: "", ContactLastName: "", ContactMiddleName: "", Code: WorkCode, ContactInfo: WorkContactInfo, DateContactValidated: null }] }); //{ IndividualEmploymentContactId: 0, IndividualId: $scope.IndividualId, ContactId: 0, IndividualEmploymentId: 0, ContactTypeId: AlternateContactTypeId, BeginDate: $scope.EmploymentStartDate, EndDate: null, IsPreferredContact: true, IsMobile: true, IsActive: true, ContactFirstName: "", ContactLastName: "", ContactMiddleName: "", Code: AlternateCode, ContactInfo: AlternateContactInfo, DateContactValidated: null }
                    }
                    else {
                        $scope.validateEmploymentInformationPhone();
                        HideLoader();
                    }
                    angular.element(document.querySelector("#LicenseRenewal_EmploymentInformation")).hide();
                    angular.element(document.querySelector("#btnEmploymentInformation")).show();
                }

                $scope.IndividualRenewal.IndividualEmployment = $scope.EmploymentInformation;
                //}
            }
            else {
                for (i in $scope.EmploymentInformation) {
                    if (($scope.employmentEditIndex - 1) == i) {

                        $scope.EmploymentInformation[i].IndividualEmploymentId = $scope.IndividualEmploymentId;
                        $scope.EmploymentInformation[i].EmployerName = $scope.EmployerName;
                        $scope.EmploymentInformation[i].EmploymentAddress[0].StreetLine1 = $scope.PhysicalAddressStreet;
                        $scope.EmploymentInformation[i].EmploymentAddress[0].StreetLine2 = $scope.PhysicalAddressStreet2;
                        $scope.EmploymentInformation[i].EmploymentAddress[0].City = $scope.EmployerCity;
                        $scope.EmploymentInformation[i].EmploymentAddress[0].StateCode = $scope.PhysicalAddressState;
                        $scope.EmploymentInformation[i].EmploymentAddress[0].Zip = $scope.PhysicalAddressZIP;
                        if ($scope.WorkPhone != null && $scope.WorkPhone != "") {
                            $scope.EmploymentInformation[i].EmploymentContact[0].ContactInfo = $scope.WorkPhone;
                            $scope.EmploymentInformation[i].EmploymentContact[0].ContactTypeId = 3;
                        }
                        //if ($scope.AlternatePhone != null && $scope.AlternatePhone != "") {
                        //    $scope.EmploymentInformation[i].EmploymentContact[1].ContactInfo = $scope.AlternatePhone;
                        //    $scope.EmploymentInformation[i].EmploymentContact[1].ContactTypeId = 4;
                        //}
                        $scope.IndividualEmploymentId = null;
                        angular.element(document.querySelector("#LicenseRenewal_EmploymentInformation")).hide();
                        angular.element(document.querySelector("#btnEmploymentInformation")).show();
                    }
                }
            }
        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }

    $scope.clearDataEmployment = function () {
        try {
            $scope.chkEmployment = true;
            $scope.EmployerName = "";
            $scope.PhysicalAddressStreet = "";
            $scope.PhysicalAddressStreet2 = "";
            $scope.EmployerCity = "";
            $scope.PhysicalAddressState = "";
            $scope.PhysicalAddressZIP = "";
            $scope.WorkPhone = "";
            $scope.AlternatePhone = "";
            $scope.EmploymentStartDate = "";
            $scope.EmploymentFax = "";
            $scope.employmentEditIndex = 0;

        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }

    $scope.branches = [];
    $scope.updateSelection = function (action, Id) {

        if (action == 'push' && $scope.branches.indexOf(Id) == -1) {

            $scope.branches.push(Id);
        }
        if (action == 'pop' && $scope.branches.indexOf(Id) != -1) {

            $scope.branches.splice($scope.branches.indexOf(Id), 1);

        }
    };

    $scope.getSelectedCheckboxValue = function (Id) {

        for (var i in $scope.IndividualRenewal.IndividualVeteran.VeteranBranches) {
            if ($scope.IndividualRenewal.IndividualVeteran.VeteranBranches[i].BranchofServicesId == Id) {
                $scope.IndividualRenewal.IndividualVeteran.VeteranBranches[i].BranchofServicesIdResponse = true;
            }
        }
        //var checkbox = $event.target;
        //var action = (checkbox.checked ? 'push' : 'pop');
        //$scope.updateSelection(action, Id);

    };
    $scope.addBusinessInformation = function (ID) {
        for (var i = 0; i < $scope.IndividualRenewal.BusinessLicenseInformation.length; i++) {
            if ($scope.IndividualRenewal.BusinessLicenseInformation[i].IndividualNVBusinessLicenseId == ID) {
                if (i == 0) {
                    $('#txtNameOfBusinessLicense').removeAttr("disabled", "true");
                    $('#txtBusinessLicense').removeAttr("disabled", "true");
                    $scope.IndividualRenewal.BusinessLicenseInformation[i].ContentItemResponse = true;
                    $scope.IndividualRenewal.BusinessLicenseInformation[i].NameonBusinessLicense = "";
                    $scope.IndividualRenewal.BusinessLicenseInformation[i].BusinessLicenseNumber = "";

                    addValidation($('#txtNameOfBusinessLicense'), "nat-required", "UI_IndividualRenewalLicenseRenewalHASnAvalidation", "requirederrormessage", "Name of Business Licensee is required", $('#lblNameOfBusinessLicense'));
                    addValidation($('#txtBusinessLicense'), "nat-required", "UI_IndividualRenewalLicenseRenewalHASnAvalidation", "requirederrormessage", "Business Licensee Number is required", $('#lblBusinessLicense'));
                }
                else {
                    $scope.IndividualRenewal.BusinessLicenseInformation[i].ContentItemResponse = true;
                    $scope.IndividualRenewal.BusinessLicenseInformation[i].NameonBusinessLicense = $('#txtNameOfBusinessLicense').val();
                    $scope.IndividualRenewal.BusinessLicenseInformation[i].BusinessLicenseNumber = $('#txtBusinessLicense').val();

                    removeValidation($('#txtNameOfBusinessLicense'), "nat-required", "UI_IndividualRenewalLicenseRenewalHASnAvalidation", "requirederrormessage", $('#lblNameOfBusinessLicense'));
                    removeValidation($('#txtBusinessLicense'), "nat-required", "UI_IndividualRenewalLicenseRenewalHASnAvalidation", "requirederrormessage", $('#lblBusinessLicense'));
                    $('#txtNameOfBusinessLicense').val("");
                    $('#txtBusinessLicense').val("");
                    $('#txtNameOfBusinessLicense').attr("disabled", "true");
                    $('#txtBusinessLicense').attr("disabled", "true");
                }

            }
            else {
                $scope.IndividualRenewal.BusinessLicenseInformation[i].ContentItemResponse = false;
            }
        }
    }
    $scope.addIndividualChildSupport = function (ID) {

        for (var i = 0; i < $scope.IndividualRenewal.IndividualChildSupport.length; i++) {

            if ($scope.IndividualRenewal.IndividualChildSupport[i].IndividualChildSupportId == ID) {
                $scope.IndividualRenewal.IndividualChildSupport[i].ContentItemResponse = true;
            }
            else {
                $scope.IndividualRenewal.IndividualChildSupport[i].ContentItemResponse = false;
            }
        }
    }
    $scope.newBranchesCheckbox = [];
    $scope.isSelected = function (Id) {
        var statu;
        for (var i = 0; i < $scope.newBranchesCheckbox.length; i++) {
            if ($scope.newBranchesCheckbox[i].ID == Id) {
                statu = true;
                break;
            }
            else {
                statu = false;
            }
        }
        return statu;
    };

    $scope.validateNBLI = function () {
        var flag = false;
        for (var i = 0; i < $scope.IndividualRenewal.BusinessLicenseInformation.length; i++) {
            if ($scope.IndividualRenewal.BusinessLicenseInformation[i].ContentItemResponse) {
                flag = true;
                break;
            }
        }

        if (flag) {
            return true;
        }
        else {
            if ($(".validation-summary ul").length == 1) {
                if ($(".validation-summary").find("ul").html().indexOf("Please enter Nevada Business License Information") < 0) {
                    $(".validation-summary").find("ul").append("<li>" + "Please enter Nevada Business License Information" + "</li>");
                }
            }
            else {
                showValidationSummary("<ul><li>" + "Please enter Nevada Business License Information" + "</li></ul>");
            }
            return false;
        }
    };

    $scope.validateCSI = function () {
        var flag = false;

        for (var i = 0; i < $scope.IndividualRenewal.IndividualChildSupport.length; i++) {
            if ($scope.IndividualRenewal.IndividualChildSupport[i].ContentItemResponse) {
                flag = true;
                break;
            }
        }

        if (flag) {
            return true;
        }
        else {
            if ($(".validation-summary ul").length == 1) {
                if ($(".validation-summary").find("ul").html().indexOf("Please enter Children Support Information") < 0) {
                    $(".validation-summary").find("ul").append("<li>" + "Please enter Children Support Information" + "</li>");
                }
            }
            else {
                showValidationSummary("<ul><li>" + "Please enter Children Support Information" + "</li></ul>");
            }
            return false;
        }
    };

    $scope.validateEI = function () {
        var flag = false;
        if ($scope.IndividualRenewal.IndividualEmployment.length != 0) {
            flag = true;
            //break;
        }
        if (flag) {
            return true;
        }
        else {
            if ($(".validation-summary ul").length == 1) {
                if ($(".validation-summary").find("ul").html().indexOf("Atleast one employment information is required") < 0) {
                    $(".validation-summary").find("ul").append("<li>" + "Atleast one employment information is required" + "</li>");
                }
            }
            else {
                showValidationSummary("<ul><li>" + "Atleast one employment information is required" + "</li></ul>");
            }
            return false;
        }
    };

    $scope.validateCEI = function () {
        debugger;
        var flag = false;
        if ($scope.IndividualCECourse != null) {
            flag = true;
            //break;
        }
        if (flag) {
            var countHours = 0;
            angular.forEach($scope.IndividualCECourse, function (value, index) {
                countHours = countHours + parseFloat($scope.IndividualCECourse[index].CECourseHours);
            });

            if (countHours < 12) {
                if ($(".validation-summary ul").length == 1) {
                    if ($(".validation-summary").find("ul").html().indexOf("Continuing Education Information CE Hours minimum is 12") < 0) {
                        $(".validation-summary").find("ul").append("<li>" + "Continuing Education Information CE Hours minimum is 12" + "</li>");
                    }
                }
                else {
                    showValidationSummary("<ul><li>" + "Continuing Education Information CE Hours minimum is 12" + "</li></ul>");
                }
                return false;
            }
            else {
                return true;
            }
        }
        else {
            if ($(".validation-summary ul").length == 1) {
                if ($(".validation-summary").find("ul").html().indexOf("Continuing Education Information information is required") < 0) {
                    $(".validation-summary").find("ul").append("<li>" + "Continuing Education Information is required" + "</li>");
                }
            }
            else {
                showValidationSummary("<ul><li>" + "Continuing Education Information is required" + "</li></ul>");
            }
            return false;
        }
    };

    $scope.validateVI = function () {
        var flag = false;
        if ($scope.IndividualRenewal.IndividualVeteran.ServedInMilitary == false) {

            flag = true;
            //break;
        }
        if (flag) {

            bindNatRequiredEvents($("#txtFrom"));
            //angular.element(document.querySelector("#txtFrom")).addClass("UI_IndividualRenewalLicenseRenewalHASnAvalidation");
            bindNatRequiredEvents(angular.element(document.querySelector("#txtMilitaryOccupationSpeciality")));
            //angular.element(document.querySelector("#txtMilitaryOccupationSpeciality")).addClass("UI_IndividualRenewalLicenseRenewalHASnAvalidation");
            bindNatRequiredEvents(angular.element(document.querySelector("#txtTo")));
            //angular.element(document.querySelector("#txtTo")).addClass("UI_IndividualRenewalLicenseRenewalHASnAvalidation");
            return true;
        }
        else {

            angular.element(document.querySelector("#txtFrom")).removeClass("nat-required UI_IndividualRenewalLicenseRenewalHASnAvalidation");
            angular.element(document.querySelector("#txtMilitaryOccupationSpeciality/Specialitie")).removeClass("nat-required UI_IndividualRenewalLicenseRenewalHASnAvalidation");
            angular.element(document.querySelector("#txtTo")).removeClass("nat-required UI_IndividualRenewalLicenseRenewalHASnAvalidation");

            return false;
        }
    };

    $scope.validateLI = function () {

        var flag = false;
        var count = 0;
        for (var i = 0; i < $scope.IndividualLegal.length; i++) {

            if ($scope.IndividualLegal[i].ContentItemResponse != null) {
                //  alert($scope.IndividualLegal[i].ContentItemResponse);
                //$('input[name=LicenseRenewalradio' + number + ']').prop('checked', $scope.IndividualLegal[i].ContentItemResponse);
                // alert($("input[LicenseRenewalradio"+number+"]:checked").val(true));
                //$('#LicenseRenewalradio' + $scope.IndividualLegal[i].ContentItemNumber).checked=true;//$scope.IndividualLegal[i].ContentItemResponse
                flag = true;
                count++;
            }
            else {
                flag = false;
            }
        }
        if (flag && count != 0) {
            return true;
        }
        else {
            if ($(".validation-summary ul").length == 1) {
                if ($(".validation-summary").find("ul").html().indexOf("Legal information is required") < 0) {
                    $(".validation-summary").find("ul").append("<li>" + "Legal information is required" + "</li>");
                }
            }
            else {
                showValidationSummary("<ul><li>" + "Legal information is required" + "</li></ul>");
            }
            return false;
        }
    };

    $scope.validateActiveInactive = function () {

        try {
            var flag = false;
            if ($scope.LNAStatus == "Active") {
                $scope.InactiveLicenseCheck == false;
            }
            if ($scope.LNAStatus == "Active" && $scope.InactiveLicenseCheck != true || $scope.LNAStatus == "InActive" && $scope.InactiveLicenseCheck == true) {

                flag = true;
            }
            else {
                flag = false;

            }
            if (flag) {
                return true;
            }
            else {

                if ($(".validation-summary ul").length == 1) {
                    if ($(".validation-summary").find("ul").html().indexOf("Please select that I will not practice as a Hearing Aid Specialist, or represent that I am authorized to practice as a Hearing Aid Specialist in Nevada during the period my license is inactive.") < 0) {
                        $(".validation-summary").find("ul").append("<li>" + "Please select that I will not practice as a Hearing Aid Specialist, or represent that I am authorized to practice as a Hearing Aid Specialist in Nevada during the period my license is inactive." + "</li>");
                    }
                }
                else {
                    showValidationSummary("<ul><li>" + "Please select that I will not practice as a Hearing Aid Specialist, or represent that I am authorized to practice as a Hearing Aid Specialist in Nevada during the period my license is inactive." + "</li></ul>");
                }
                return false;
            }
        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    };

    $scope.saveInactiveLicenseCheck = function ($event) {
        var checkbox = $event.target;
        sessionStorage.InactiveLicenseCheck = checkbox.checked
    };

    $scope.validateLicenseInformationPhone = function () {
        debugger;
        var flag = false;
        if ($scope.HomePhone.length > 0 || $scope.CellPhone.length > 0) {
            flag = true;
        }
        if (flag) {
            $("#txtWorkPhone").css("background-color", "");
            $("#txtAlternatePhone").css("background-color", "");
            return true;
        }
        else {
            $("#txtHomePhone").css("background-color", "#FFEBEB !important");
            $("#txtCellPhone").css("background-color", "#FFEBEB !important");
            if ($(".validation-summary ul").length == 1) {
                if ($(".validation-summary").find("ul").html().indexOf("Either Licensee Home Phone or Cell Phone is required") < 0) {
                    $(".validation-summary").find("ul").append("<li>" + "Either Licensee Home Phone or Cell Phone is required" + "</li>");
                }
            }
            else {
                showValidationSummary("<ul><li>" + "Either Licensee Home Phone or Cell Phone is required" + "</li></ul>");
            }
            return false;
        }
    };

    $scope.validateEmploymentInformationPhone = function () {
        var flag = false;
        if ($scope.WorkPhone.length > 0 || $scope.AlternatePhone.length > 0) {
            flag = true;
        }
        if (flag) {
            $("#txtWorkPhone").css("background-color", "");
            $("#txtAlternatePhone").css("background-color", "");
            return true;
        }
        else {
            $("#txtWorkPhone").css("background-color", "#FFEBEB !important");
            $("#txtAlternatePhone").css("background-color", "#FFEBEB !important");

            if ($(".validation-summary ul").length == 1) {
                if ($(".validation-summary").find("ul").html().indexOf("Either Employment Work Phone or Alternate Phone is required") < 0) {
                    $(".validation-summary").find("ul").append("<li>" + "Either Employment Work Phone or Alternate Phone is required" + "</li>");
                }
            }
            else {
                showValidationSummary("<ul><li>" + "Either Employment Work Phone or Alternate Phone is required" + "</li></ul>");
            }
            return false;
        }
    };
    $scope.validateAccountNumber = function (IsNBCHIS) {
        try {
            if (IsNBCHIS == true) {
                addValidation($('#txtAccountNumber'), "nat-required", "UI_IndividualRenewalLicenseRenewalHASnAvalidation", "requirederrormessage", "Certification Status Account Number is required", $('#lblAccountNumber'));
                $('#txtAccountNumber').removeAttr("disabled");
            }
            else {
                removeValidation($("#txtAccountNumber"), "nat-required", "UI_IndividualRenewalLicenseRenewalHASnAvalidation", "requirederrormessage", $('#lblAccountNumber'));
                $('#txtAccountNumber').attr("disabled", "true");
                $scope.NBCHISAccount = "";
            }
        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }

    $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
        try {
            $scope.ChangeVeteranInfomation($scope.Military == "yes" ? true : false);
        }
        catch (ex) {

        }
    });

    $scope.VeteranInformationOptionsLoad = function () {

        $scope.ChangeVeteranInfomation($scope.Military == "yes" ? true : false);
    };

    function exportRenewalApplicationToPDF() {
        var data;
        $scope.PaymentFlag = true;
        html2canvas(document.getElementById('DisplayRenewal'), {
            onrendered: function (canvas) {
                var decument = canvas.toDataURL();
                var docDefinition = {
                    content: [{
                        image: decument
                    }]
                };
                pdfMake.createPdf(docDefinition).getBase64(function (docDefinition) {
                    data = docDefinition;
                    sessionStorage.RenewalApplication64 = data;
                });
                $scope.PaymentFlag = false;
            }
        });
    };

    //function validateCEHours() {
    //	
    //	var EIC = $('txtCEHours').val();
    //	alert(EIC);
    //	var flag = false;
    //	if (EIC > 12) {
    //		
    //		flag = true;
    //	}
    //	if (flag) {
    //		return true;
    //	}
    //	else {
    //		//$('txtCEHours').attr("customErrorMessage", "Minimum 12 hours required.");
    //		//showErrorMessage($('txtCEHours'),"Minimum 12 hours is required");
    //		return false;
    //	}
    //}
});

natApp.controller("ucLicenseAppicationHASnAController", function ($scope, $controller, LicenseRenewalHASnAService, CouncilInfoService) {
    $controller('GlobalController', { $scope: $scope });
    //$controller('GlobalController', { $scope: $scope });
    $scope.LNAStatus;
    $scope.RenewalPeriod = false;
    $scope.FirstName = "";
    $scope.LastName = "";
    $scope.MiddleName = "";
    $scope.DOB = "";

    $scope.Street = "";
    $scope.City = "";
    $scope.State;
    $scope.ZIP = "";

    $scope.MailingStreet = "";
    $scope.MailingCity = "";
    $scope.MailingState;
    $scope.MailingZIP = "";

    $scope.HomePhone = "";
    $scope.CellPhone = "";
    $scope.OfficePhone = "";
    $scope.Fax = "";
    $scope.EmailAddress = "";

    $scope.EmployeeName = "";
    $scope.PhysicalAddressStreet = "";
    $scope.City = "";
    $scope.PhysicalAddressZIP = "";
    $scope.WorkPhone = "";
    $scope.AlternatePhone = "";
    $scope.StartBirth = "";
    $scope.Fax = "";

    $scope.NoChanges = false;
    $scope.NBCHIS = false;
    $scope.AccountNumber = ""

    $scope.NoOfSponser = "";
    $scope.SponsersLicenseNumber = "";
    $scope.BusinessLocationStreet = "";
    $scope.BusinessLocationState = "";
    $scope.BusinessLocationZIP = "";
    $scope.BusinessLocationCity = "";

    $scope.NameOfBusinessLicense = "";
    $scope.BusinessLicense = "";
    $scope.RDBBusinessLicence = ""

    $scope.RDBAppropriateResponse = null;

    $scope.Military = null;
    $scope.BranchesArmy = null;
    $scope.BranchesMarine = null;
    $scope.BranchesNavy = null;
    $scope.BranchesAirForce = null;
    $scope.BranchesCostGuard = null;
    $scope.BranchesNational = null;
    $scope.MilitarySpecialist = null;
    $scope.FromDateOfService = null;
    $scope.ToDateOfService = null;

    $scope.RDBLegalInfoQ1 = null;
    $scope.RDBLegalInfoQ2 = null;
    $scope.RDBLegalInfoQ3 = null;
    $scope.RDBLegalInfoQ4 = null;
    $scope.RDBLegalInfoQ5 = null;

    $scope.EducationInformationDate = null;
    $scope.EducationInformationCourse = null;
    $scope.EducationInformationCEHours = null;

    $scope.AckAppliciant = null;
    $scope.AckAppliciantName = null;
    $scope.AckAppliciantDate = null;

    $scope.EmploymentInformation = [];
    $scope.IndividualCECourse = [];
    $scope.ContactTypeList = [];
    $scope.BusinessLicenseInformation = [];
    $scope.IndividualChildSupport = [];
    $scope.IndividualRenewal = [];
    $scope.chkEmployment = true;
    $scope.paymentFlag = false;

    if ($scope.LNAStatus = "Active") {
        angular.element(document.querySelector("#InactiveLicense")).hide();
    }
    else if ($scope.LNAStatus = "InActive") {
        angular.element(document.querySelector("#InactiveLicense")).show();
    }
    angular.element(document.querySelector("#optionsRadios1")).click(function () {
        angular.element(document.querySelector("#InactiveLicense")).hide();
    });
    angular.element(document.querySelector("#optionsRadios2")).click(function () {
        angular.element(document.querySelector("#InactiveLicense")).show();
    });

    angular.element(document.querySelector("#LicenseRenewal_EmploymentInformation")).hide();
    angular.element(document.querySelector("#btnEmploymentInformation")).click(function () {
        $scope.clearDataEmployment();
        angular.element(document.querySelector("#LicenseRenewal_EmploymentInformation")).show();
        angular.element(document.querySelector("#btnEmploymentInformation")).hide();
    });
    angular.element(document.querySelector("#btnCancelEmployementInformation")).click(function () {
        resetValidation();
        angular.element(document.querySelector("#LicenseRenewal_EmploymentInformation")).hide();
        angular.element(document.querySelector("#btnEmploymentInformation")).show();
    });

    angular.element(document.querySelector("#LicenseRenewalLegalInfoText1")).hide();
    angular.element(document.querySelector("#LicenseRenewalradioQ1Op1")).click(function () {
        angular.element(document.querySelector("#LicenseRenewalLegalInfoText1")).show();
    });
    angular.element(document.querySelector("#LicenseRenewalradioQ1Op2")).click(function () {
        angular.element(document.querySelector("#LicenseRenewalLegalInfoText1")).hide();
    });
    angular.element(document.querySelector("#LicenseRenewalLegalInfoText2")).hide();
    angular.element(document.querySelector("#LicenseRenewalradioQ2Op1")).click(function () {
        angular.element(document.querySelector("#LicenseRenewalLegalInfoText2")).show();
    });
    angular.element(document.querySelector("#LicenseRenewalradioQ2Op2")).click(function () {
        angular.element(document.querySelector("#LicenseRenewalLegalInfoText2")).hide();
    });
    angular.element(document.querySelector("#LicenseRenewalLegalInfoText3")).hide();
    angular.element(document.querySelector("#LicenseRenewalradioQ3Op1")).click(function () {
        angular.element(document.querySelector("#LicenseRenewalLegalInfoText3")).show();
    });
    angular.element(document.querySelector("#LicenseRenewalradioQ3Op2")).click(function () {
        angular.element(document.querySelector("#LicenseRenewalLegalInfoText3")).hide();
    });
    angular.element(document.querySelector("#LicenseRenewalLegalInfoText4")).hide();
    angular.element(document.querySelector("#LicenseRenewalradioQ4Op1")).click(function () {
        angular.element(document.querySelector("#LicenseRenewalLegalInfoText4")).show();
    });
    angular.element(document.querySelector("#LicenseRenewalradioQ4Op2")).click(function () {
        angular.element(document.querySelector("#LicenseRenewalLegalInfoText4")).hide();
    });
    angular.element(document.querySelector("#LicenseRenewalLegalInfoText5")).hide();
    angular.element(document.querySelector("#LicenseRenewalradioQ5Op1")).click(function () {
        angular.element(document.querySelector("#LicenseRenewalLegalInfoText5")).show();
    });
    angular.element(document.querySelector("#LicenseRenewalradioQ5Op2")).click(function () {
        angular.element(document.querySelector("#LicenseRenewalLegalInfoText5")).hide();
    });

    angular.element(document.querySelector("#ContinuingEductationInfoRow")).hide();
    angular.element(document.querySelector("#btnContinuingEducationInfo")).click(function () {
        angular.element(document.querySelector("#ContinuingEductationInfoRow")).show();
        angular.element(document.querySelector("#btnContinuingEducationInfo")).hide();
    });
    angular.element(document.querySelector("#btnCancelContinuingEducationInfo")).click(function () {
        angular.element(document.querySelector("#ContinuingEductationInfoRow")).hide();
        angular.element(document.querySelector("#btnContinuingEducationInfo")).show();
    });

    $scope.init = function () {
        try {

            if ($scope.isSessionActive()) {


                //$scope.IndividualRenewalGet();
                $scope.getStateByCountryID(235);
                //$scope.check();
            }
            else {
                window.location.href = "#/User/Loginwoemail";
                // Else of isSessionActive method
            }
        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }

    $scope.getList = function () {
        try {

        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }

    $scope.IndividualRenewalGet = function (IndividualId) {
        try {

            ShowLoader("Please wait...");
            resetValidation();
            hideStatusMessage();
            hideValidationSummary();


            $scope.IndividualRenewal = [];

            LicenseRenewalHASnAService.IndividualRenewalGet(sessionStorage.Key, IndividualId)//sessionStorage.UserId
            .success(function (response) {

                if ($scope.CheckResponse(response)) {


                    $scope.IndividualRenewal = response.IndividualRenewal;
                    angular.forEach($scope.IndividualRenewal, function (value, index) {
                        //IndividualLicenseDetails

                        if ($scope.IndividualRenewal.IndividualLicense.length > 0) {
                            $scope.IndividualLicenseId = $scope.IndividualRenewal.IndividualLicense[0].IndividualLicenseId;
                            $scope.IndividualId = $scope.IndividualRenewal.IndividualLicense[0].IndividualId;
                            $scope.ApplicationId = $scope.IndividualRenewal.IndividualLicense[0].ApplicationId;
                            $scope.ApplicationTypeId = $scope.IndividualRenewal.IndividualLicense[0].ApplicationTypeId;
                            $scope.LicenseTypeId = $scope.IndividualRenewal.IndividualLicense[0].LicenseTypeId;
                            $scope.IsLicenseTemporary = $scope.IndividualRenewal.IndividualLicense[0].IsLicenseTemporary;
                            $scope.IsLicenseActive = $scope.IndividualRenewal.IndividualLicense[0].IsLicenseActive;
                            $scope.LicenseNumber = $scope.IndividualRenewal.IndividualLicense[0].LicenseNumber;
                            $scope.OriginalLicenseDate = $scope.IndividualRenewal.IndividualLicense[0].OriginalLicenseDate;
                            $scope.LicenseEffectiveDate = $scope.IndividualRenewal.IndividualLicense[0].LicenseEffectiveDate;
                            $scope.LicenseExpirationDate = $scope.IndividualRenewal.IndividualLicense[0].LicenseExpirationDate;
                            $scope.LicenseStatusTypeId = $scope.IndividualRenewal.IndividualLicense[0].LicenseStatusTypeId;
                            $scope.IsActive = $scope.IndividualRenewal.IndividualLicense[0].IsActive;

                        }


                        if ($scope.IsLicenseActive == true) {
                            $scope.LNAStatus = "Active";
                        }
                        else if ($scope.IsLicenseActive == false) {
                            $scope.LNAStatus = "InActive";
                            angular.element(document.querySelector("#InactiveLicense")).show();
                        }

                        //Individual
                        $scope.IndividualId = $scope.IndividualRenewal.Individual.IndividualId;
                        sessionStorage.IndividualId = $scope.IndividualRenewal.Individual.IndividualId;
                        $scope.FirstName = $scope.IndividualRenewal.Individual.FirstName;
                        $scope.MiddleName = $scope.IndividualRenewal.Individual.MiddleName;
                        $scope.LastName = $scope.IndividualRenewal.Individual.LastName;
                        $scope.SuffixId = $scope.IndividualRenewal.Individual.SuffixId;
                        $scope.SSN = $scope.IndividualRenewal.Individual.SSN;
                        $scope.IsItin = $scope.IndividualRenewal.Individual.IsItin;
                        $scope.DateOfBirth = $scope.IndividualRenewal.Individual.DateOfBirth;
                        $scope.EmailAddress = sessionStorage.Email;
                        $scope.RaceId = $scope.IndividualRenewal.Individual.RaceId;
                        $scope.Gender = $scope.IndividualRenewal.Individual.Gender;
                        $scope.HairColorId = $scope.IndividualRenewal.Individual.HairColorId;
                        $scope.EyeColorId = $scope.IndividualRenewal.Individual.EyeColorId;
                        $scope.Weight = $scope.IndividualRenewal.Individual.Weight;
                        $scope.Height = $scope.IndividualRenewal.Individual.Height;
                        $scope.PlaceOfBirth = $scope.IndividualRenewal.Individual.PlaceOfBirth;
                        $scope.CitizenshipId = $scope.IndividualRenewal.Individual.CitizenshipId;
                        $scope.ExternalId = $scope.IndividualRenewal.Individual.ExternalId;
                        $scope.ExternalId2 = $scope.IndividualRenewal.Individual.ExternalId2;
                        $scope.IsArchived = $scope.IndividualRenewal.Individual.IsArchived;
                        $scope.IndividualIsActive = $scope.IndividualRenewal.Individual.IsActive;

                        //Application
                        $scope.ApplicationId = $scope.IndividualRenewal.Application.ApplicationId;
                        sessionStorage.ApplicationId = $scope.IndividualRenewal.Individual.IndividualId;
                        $scope.ApplicationTypeId = $scope.IndividualRenewal.Application.ApplicationTypeId;
                        $scope.ApplicationStatusId = $scope.IndividualRenewal.Application.ApplicationStatusId;
                        $scope.ApplicationStatusReasonId = $scope.IndividualRenewal.Application.ApplicationStatusReasonId;
                        $scope.ApplicationNumber = $scope.IndividualRenewal.Application.ApplicationNumber;
                        sessionStorage.ApplicationNumber = $scope.IndividualRenewal.Application.ApplicationNumber;
                        $scope.ApplicationSubmitMode = $scope.IndividualRenewal.Application.ApplicationSubmitMode;
                        $scope.StartedDate = $scope.IndividualRenewal.Application.StartedDate;
                        $scope.SubmittedDate = $scope.IndividualRenewal.Application.SubmittedDate;
                        $scope.ApplicationStatusDate = $scope.IndividualRenewal.Application.ApplicationStatusDate;
                        $scope.PaymentDeadlineDate = $scope.IndividualRenewal.Application.PaymentDeadlineDate;
                        $scope.PaymentDate = $scope.IndividualRenewal.Application.PaymentDate;
                        $scope.ConfirmationNumber = $scope.IndividualRenewal.Application.ConfirmationNumber;
                        $scope.ReferenceNumber = $scope.IndividualRenewal.Application.ReferenceNumber;
                        $scope.IsFingerprintingNotRequired = $scope.IndividualRenewal.Application.IsFingerprintingNotRequired;
                        $scope.IsPaymentRequired = $scope.IndividualRenewal.Application.IsPaymentRequired;
                        $scope.CanProvisionallyHire = $scope.IndividualRenewal.Application.CanProvisionallyHire;
                        $scope.GoPaperless = $scope.IndividualRenewal.Application.GoPaperless;
                        $scope.LicenseRequirementId = $scope.IndividualRenewal.Application.LicenseRequirementId;
                        $scope.WithdrawalReasonId = $scope.IndividualRenewal.Application.WithdrawalReasonId;
                        $scope.LicenseTypeId = $scope.IndividualRenewal.Application.LicenseTypeId;
                        $scope.ApplicationIsActive = $scope.IndividualRenewal.Application.IsActive;

                        //IndividualAddress
                        if ($scope.IndividualRenewal.IndividualAddress.length > 0) {
                            $scope.IndividualAddressId = $scope.IndividualRenewal.IndividualAddress[0].IndividualAddressId;
                            $scope.IndividualId = $scope.IndividualRenewal.IndividualAddress[0].IndividualId;
                            $scope.AddressId = $scope.IndividualRenewal.IndividualAddress[0].AddressId;
                            $scope.AddressTypeId = $scope.IndividualRenewal.IndividualAddress[0].AddressTypeId;
                            $scope.BeginDate = $scope.IndividualRenewal.IndividualAddress[0].BeginDate;
                            $scope.EndDate = $scope.IndividualRenewal.IndividualAddress[0].EndDate;
                            $scope.IsMailingSameasPhysical = $scope.IndividualRenewal.IndividualAddress[0].IsMailingSameasPhysical;
                            $scope.IndividualAddressIsActive = $scope.IndividualRenewal.IndividualAddress[0].IsActive;
                            $scope.Street = $scope.IndividualRenewal.IndividualAddress[0].StreetLine1;
                            $scope.Street2 = $scope.IndividualRenewal.IndividualAddress[0].StreetLine2;
                            $scope.City = $scope.IndividualRenewal.IndividualAddress[0].City;
                            $scope.ZIP = $scope.IndividualRenewal.IndividualAddress[0].Zip;
                            $scope.State = $scope.IndividualRenewal.IndividualAddress[0].StateCode;
                            $scope.IsMailingSameasPhysical = $scope.IndividualRenewal.IndividualAddress[0].IsMailingSameasPhysical;

                            $scope.MailingStreet = $scope.IndividualRenewal.IndividualAddress[0].StreetLine1;
                            $scope.MailingStreet2 = $scope.IndividualRenewal.IndividualAddress[0].StreetLine2;
                            $scope.MailingCity = $scope.IndividualRenewal.IndividualAddress[0].City;
                            $scope.MailingZIP = $scope.IndividualRenewal.IndividualAddress[0].Zip;
                            $scope.MailingState = $scope.IndividualRenewal.IndividualAddress[0].StateCode;


                        }

                        //Contact
                        //$scope.contactTypeGetAll();
                        //if ($scope.IndividualRenewal.Contact.length > 0) {


                        //$scope.ContactId = $scope.IndividualRenewal.Contact[0].ContactId;
                        //$scope.ContactFirstName = $scope.IndividualRenewal.Contact[0].ContactFirstName;
                        //$scope.ContactLastName = $scope.IndividualRenewal.Contact[0].ContactLastName;
                        //$scope.ContactMiddleName = $scope.IndividualRenewal.Contact[0].ContactMiddleName;
                        //$scope.ContactTypeId = $scope.IndividualRenewal.Contact[0].ContactTypeId;
                        //$scope.Code = $scope.IndividualRenewal.Contact[0].Code;
                        //$scope.ContactInfo = $scope.IndividualRenewal.Contact[0].ContactInfo;
                        //$scope.DateContactValidated = $scope.IndividualRenewal.Contact[0].DateContactValidated;
                        //$scope.ContactIsActive = $scope.IndividualRenewal.Contact[0].IsActive;
                        //}
                        //var i = -1;
                        $scope.IndividualRenewal.Contact[0];
                        angular.forEach($scope.IndividualRenewal.Contact, function (val, ind) {
                            if ($scope.IndividualRenewal.Contact[ind].ContactTypeId == "1") {
                                $scope.CellPhone = $scope.IndividualRenewal.Contact[ind].ContactInfo;
                            }
                            if ($scope.IndividualRenewal.Contact[ind].ContactTypeId == "2") {
                                $scope.HomePhone = $scope.IndividualRenewal.Contact[ind].ContactInfo;
                            }
                        });
                        //if ($scope.ContactDetails.ContactTypeId == "1")
                        //{
                        //	$scope.CellPhone = $scope.ContactDetails.ContactInfo;
                        //}
                        //if ($scope.ContactDetails.ContactTypeId == "2") {
                        //	$scope.HomePhone = $scope.ContactDetails.ContactInfo;
                        //}

                        //EmploymentInformation
                        $scope.EmploymentInformation = [];
                        if ($scope.IndividualRenewal.IndividualEmployment.length > 0) {
                            for (var i in $scope.IndividualRenewal.IndividualEmployment) {
                                $scope.EmploymentInformation.push($scope.IndividualRenewal.IndividualEmployment[i]);
                            }

                        }

                        //IndividualCertification
                        if ($scope.IndividualRenewal.IndividualCertification != null) {


                            $scope.IndividualCertificationId = $scope.IndividualRenewal.IndividualCertification.IndividualCertificationId;
                            $scope.IndividualId = $scope.IndividualRenewal.IndividualCertification.IndividualId;
                            $scope.CertificationTypeId = $scope.IndividualRenewal.IndividualCertification.CertificationTypeId;
                            $scope.ClinicalComptence = $scope.IndividualRenewal.IndividualCertification.ClinicalComptence;
                            $scope.IsClinicalComptence = $scope.IndividualRenewal.IndividualCertification.IsClinicalComptence;
                            $scope.DateIssued = $scope.IndividualRenewal.IndividualCertification.DateIssued;
                            $scope.ABAMember = $scope.IndividualRenewal.IndividualCertification.ABAMember;
                            $scope.PraxisExam = $scope.IndividualRenewal.IndividualCertification.PraxisExam;
                            $scope.IsNBCHIS = $scope.IndividualRenewal.IndividualCertification.IsNBCHIS;
                            $scope.NBCHISAccount = $scope.IndividualRenewal.IndividualCertification.NBCHISAccount;
                            $scope.NBCHISCertificate = $scope.IndividualRenewal.IndividualCertification.NBCHISCertificate;
                            $scope.DatePassed = $scope.IndividualRenewal.IndividualCertification.DatePassed;
                            $scope.ABA = $scope.IndividualRenewal.IndividualCertification.ABA;
                            $scope.ASHA = $scope.IndividualRenewal.IndividualCertification.ASHA;
                            $scope.IsNBCOTCertified = $scope.IndividualRenewal.IndividualCertification.IsNBCOTCertified;
                            $scope.IsNBCOTAppliedforRenewal = $scope.IndividualRenewal.IndividualCertification.IsNBCOTAppliedforRenewal;
                            $scope.IsNBCOTExamScheduled = $scope.IndividualRenewal.IndividualCertification.IsNBCOTExamScheduled;
                            $scope.NBCOTDateTaken = $scope.IndividualRenewal.IndividualCertification.NBCOTDateTaken;
                            $scope.NBCOTDatePassed = $scope.IndividualRenewal.IndividualCertification.NBCOTDatePassed;
                            $scope.NBCOTDateScheduled = $scope.IndividualRenewal.IndividualCertification.NBCOTDateScheduled;
                            $scope.IndividualCertificationIsActive = $scope.IndividualRenewal.IndividualCertification.IsActive;
                        }

                        //SponsorInformation
                        if ($scope.IndividualRenewal.SponsorInformation != null) {


                            $scope.SponsorId = $scope.IndividualRenewal.SponsorInformation.SponsorId;
                            $scope.SponserFirstName = $scope.IndividualRenewal.SponsorInformation.FirstName;
                            $scope.SponserMiddleName = $scope.IndividualRenewal.SponsorInformation.MiddleName;
                            $scope.SponserLastName = $scope.IndividualRenewal.SponsorInformation.LastName;
                            $scope.SponsersLicenseNumber = $scope.IndividualRenewal.SponsorInformation.SupervisorLicenseNumber;
                            $scope.BusinessLocationStreet1 = $scope.IndividualRenewal.SponsorInformation.SponsorAddress[0].StreetLine1;
                            $scope.BusinessLocationStreet2 = $scope.IndividualRenewal.SponsorInformation.SponsorAddress[0].StreetLine2;
                            $scope.BusinessLocationCity = $scope.IndividualRenewal.SponsorInformation.SponsorAddress[0].City;
                            $scope.BusinessLocationState = $scope.IndividualRenewal.SponsorInformation.SponsorAddress[0].StateCode;
                            $scope.BusinessLocationZIP = $scope.IndividualRenewal.SponsorInformation.SponsorAddress[0].Zip;
                        }

                        //BusinessLicenseInformation
                        if ($scope.IndividualRenewal.BusinessLicenseInformation.length != 0) {

                            $scope.BusinessLicenseInformation = $scope.IndividualRenewal.BusinessLicenseInformation;

                            for (var i in $scope.BusinessLicenseInformation) {
                                if ($scope.BusinessLicenseInformation[i].ContentItemResponse == true) {
                                    $scope.ContentItemResponse = $scope.BusinessLicenseInformation[i].IndividualNVBusinessLicenseId;
                                }
                            }
                            //$scope.IndividualNVBusinessLicenseId = $scope.IndividualRenewal.BusinessLicenseInformation[0].IndividualNVBusinessLicenseId;
                            //$scope.IndividualId = $scope.IndividualRenewal.BusinessLicenseInformation[0].IndividualId;
                            //$scope.ContentItemLkId = $scope.IndividualRenewal.BusinessLicenseInformation[0].ContentItemLkId;
                            //$scope.ContentItemHash = $scope.IndividualRenewal.BusinessLicenseInformation[0].ContentItemHash;
                            //$scope.ContentItemResponse = $scope.IndividualRenewal.BusinessLicenseInformation[0].ContentItemResponse;
                            //$scope.Status = $scope.IndividualRenewal.BusinessLicenseInformation[0].Status;
                            $scope.txtNameOfBusinessLicense = $scope.IndividualRenewal.BusinessLicenseInformation[0].NameonBusinessLicense;
                            $scope.txtBusinessLicense = $scope.IndividualRenewal.BusinessLicenseInformation[0].BusinessLicenseNumber;
                            //$scope.BusinessLicenseInformationIsActive = $scope.IndividualRenewal.BusinessLicenseInformation[0].IsActive;
                        }

                        //IndividualChildSupport
                        if ($scope.IndividualRenewal.IndividualChildSupport != null) {

                            $scope.IndividualChildSupport = $scope.IndividualRenewal.IndividualChildSupport;
                            for (var i in $scope.IndividualChildSupport) {
                                if ($scope.IndividualChildSupport[i].ContentItemResponse == true) {
                                    $scope.RDBAppropriateResponse = $scope.IndividualChildSupport[i].IndividualChildSupportId;
                                }
                            }
                            $scope.IndividualChildSupportId = $scope.IndividualRenewal.IndividualChildSupport[0].IndividualChildSupportId;
                            $scope.IndividualId = $scope.IndividualRenewal.IndividualChildSupport[0].IndividualId;
                            $scope.IndividualChildSupportContentItemLkId = $scope.IndividualRenewal.IndividualChildSupport[0].ContentItemLkId;
                            $scope.IndividualChildSupportContentItemNumber = $scope.IndividualRenewal.IndividualChildSupport[0].ContentItemNumber;
                            $scope.IndividualChildSupportContentItemResponse = $scope.IndividualRenewal.IndividualChildSupport[0].ContentItemResponse;
                            $scope.IndividualChildSupportIsActive = $scope.IndividualRenewal.IndividualChildSupport[0].IsActive;
                            $scope.IndividualChildSupportContentDescription = $scope.IndividualRenewal.IndividualChildSupport[0].ContentDescription;
                        }

                        //IndividualVeteran
                        if ($scope.IndividualRenewal.IndividualVeteran != null) {


                            $scope.IndividualVeteranId = $scope.IndividualRenewal.IndividualVeteran.IndividualVeteranId;
                            $scope.IndividualId = $scope.IndividualRenewal.IndividualVeteran.IndividualId;
                            $scope.Military = $scope.IndividualRenewal.IndividualVeteran.ServedInMilitary;
                            if ($scope.Military == true) {
                                $scope.Military = "yes";
                            }
                            else {
                                $scope.Military = "no";
                            }
                            $scope.SpouseofActiveMilitaryMember = $scope.IndividualRenewal.IndividualVeteran.SpouseofActiveMilitaryMember;
                            $scope.MilitarySpecialist = $scope.IndividualRenewal.IndividualVeteran.MilitaryOccupationSpeciality;
                            $scope.FromDateOfService = $scope.IndividualRenewal.IndividualVeteran.ServiceDateFrom;
                            $scope.ToDateOfService = $scope.IndividualRenewal.IndividualVeteran.ServiceDateTo;
                            $scope.IndividualVeteranIsActive = $scope.IndividualRenewal.IndividualVeteran.IsActive;
                            $scope.VeteranBranches = [];
                            for (var i in $scope.IndividualRenewal.IndividualVeteran.VeteranBranches) {
                                $scope.VeteranBranches.push($scope.IndividualRenewal.IndividualVeteran.VeteranBranches[i]);
                            }
                            //$scope.VeteranBranches = $scope.IndividualRenewal.IndividualVeteran.VeteranBranches[0];
                        }
                        //IndividualLegal
                        if ($scope.IndividualRenewal.IndividualLegal != null) {


                            $scope.IndividualLegal = $scope.IndividualRenewal.IndividualLegal;

                        }

                        //IndividualCEH
                        //if ($scope.IndividualRenewal.IndividualCEH.length > 0) {

                        //    $scope.IndividualCEH = $scope.IndividualRenewal.IndividualCEH[0];
                        //}

                        //IndividualAffidavit
                        if ($scope.IndividualRenewal.IndividualAffidavit != null) {


                            $scope.IndividualAffidavitId = $scope.IndividualRenewal.IndividualAffidavit.IndividualAffidavitId;
                            $scope.IndividualId = $scope.IndividualRenewal.IndividualAffidavit.IndividualId;
                            $scope.IndividualAffidavitContentItemLkId = $scope.IndividualRenewal.IndividualAffidavit.ContentItemLkId;
                            $scope.IndividualAffidavitContentItemHash = $scope.IndividualRenewal.IndividualAffidavit.ContentItemHash;
                            $scope.IndividualAffidavitContentItemResponse = $scope.IndividualRenewal.IndividualAffidavit.ContentItemResponse;
                            $scope.IndividualAffidavitDesc = $scope.IndividualRenewal.IndividualAffidavit.Desc;
                            $scope.IndividualAffidavitIsActive = $scope.IndividualRenewal.IndividualAffidavit.IsActive;
                        }

                        // Course Detail
                        if ($scope.IndividualRenewal.IndividualCECourse.length > 0) {
                            $scope.IndividualCECourse = $scope.IndividualRenewal.IndividualCECourse;
                        }


                        //FeesDetails
                        if ($scope.IndividualRenewal.FeesDetails.length > 0) {


                            $scope.FeesDetails = $scope.IndividualRenewal.FeesDetails;
                            $scope.UnPaidFees = 0;
                            sessionStorage.RenewalFees = 0;
                            sessionStorage.LateFees = 0;
                            for (var i = 0; i < $scope.FeesDetails.length; i++) {
                                if ($scope.FeesDetails[i].Status == "Unpaid") {


                                    $scope.UnPaidFees = $scope.UnPaidFees + $scope.FeesDetails[i].Amount;
                                    sessionStorage.Fees = $scope.UnPaidFees;
                                    $scope.InvoiceNumber = $scope.FeesDetails[i].InvoiceNumber;
                                }
                                if ($scope.FeesDetails[i].FeeType = "Renewal Fee") {
                                    sessionStorage.RenewalFees = $scope.UnPaidFees;
                                }
                                else if ($scope.FeesDetails[i].FeeType = "Late Fee") {
                                    sessionStorage.LateFees = $scope.FeesDetails[i].Amount;
                                }
                            }
                            sessionStorage.InvoiceNumber = $scope.InvoiceNumber;
                        }
                        HideLoader();
                        //IndividualInfo = response.IndividualRenewal;

                    });


                } else {
                    HideLoader();
                    // Else of CheckResponse Method
                }
            })
                .error(function (data) {

                    HideLoader();
                    //showStatusMessage(data, "error");
                });
        }
        catch (ex) {
            HideLoader();
            //showStatusMessage(ex.message, "error");

        }
    }

    $scope.SaveEmploymentInfo = function () {
        try {
            if (validateData("UI_IndividualRenewalLicenseRenewalHASnAEmployementvalidation")) {
                //$scope.temp[0].EmployeeName = $scope.EmployeeName;
                //$scope.EmploymentInformation.push(EmploymentInfo);
                //$scope.check();
            }
            else {

            }
        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }

    $scope.insert = function () {
        try {

            //if (validateData()) {
            ShowLoader("Saving...");

            resetValidation();
            hideStatusMessage();
            hideValidationSummary();
            //$scope.IndividualRenewal = [];
            //$scope.IndividualRenewal.push(response.IndividualRenewal);

            $scope.IndividualRenewal.Individual.MiddleName = $scope.MiddleName;
            //	//IndividualLicenseDetails
            $scope.IndividualRenewal.IndividualLicense[0].IndividualLicenseId = $scope.IndividualLicenseId;
            $scope.IndividualRenewal.IndividualLicense[0].IndividualId = $scope.IndividualId;
            $scope.IndividualRenewal.IndividualLicense[0].ApplicationId = $scope.ApplicationId;
            $scope.IndividualRenewal.IndividualLicense[0].ApplicationTypeId = $scope.ApplicationTypeId;
            $scope.IndividualRenewal.IndividualLicense[0].LicenseTypeId = $scope.LicenseTypeId;
            $scope.IndividualRenewal.IndividualLicense[0].IsLicenseTemporary = $scope.IsLicenseTemporary;
            $scope.IndividualRenewal.IndividualLicense[0].IsLicenseActive = $scope.IsLicenseActive;
            $scope.IndividualRenewal.IndividualLicense[0].LicenseNumber = $scope.LicenseNumber;
            $scope.IndividualRenewal.IndividualLicense[0].OriginalLicenseDate = $scope.OriginalLicenseDate;
            $scope.IndividualRenewal.IndividualLicense[0].LicenseEffectiveDate = $scope.LicenseEffectiveDate;
            $scope.IndividualRenewal.IndividualLicense[0].LicenseExpirationDate = $scope.LicenseExpirationDate;
            $scope.IndividualRenewal.IndividualLicense[0].LicenseStatusTypeId = $scope.LicenseStatusTypeId;
            $scope.IndividualRenewal.IndividualLicense[0].IsActive = $scope.IsActive;

            //	//Individual
            $scope.IndividualRenewal.Individual.IndividualId = $scope.IndividualId;
            $scope.IndividualRenewal.Individual.FirstName = $scope.FirstName;
            $scope.IndividualRenewal.Individual.MiddleName = $scope.MiddleName;
            $scope.IndividualRenewal.Individual.LastName = $scope.LastName;
            $scope.IndividualRenewal.Individual.SuffixId = $scope.SuffixId;
            $scope.IndividualRenewal.Individual.SSN = $scope.SSN;
            $scope.IndividualRenewal.Individual.IsItin = $scope.IsItin;
            $scope.IndividualRenewal.Individual.DateOfBirth = $('#txtDOB').val();
            $scope.IndividualRenewal.Individual.RaceId = $scope.RaceId;
            $scope.IndividualRenewal.Individual.Gender = $scope.Gender;
            $scope.IndividualRenewal.Individual.HairColorId = $scope.HairColorId;
            $scope.IndividualRenewal.Individual.EyeColorId = $scope.EyeColorId;
            $scope.IndividualRenewal.Individual.Weight = $scope.Weight;
            $scope.IndividualRenewal.Individual.Height = $scope.Height;
            $scope.IndividualRenewal.Individual.PlaceOfBirth = $scope.PlaceOfBirth;
            $scope.IndividualRenewal.Individual.CitizenshipId = $scope.CitizenshipId;
            $scope.IndividualRenewal.Individual.ExternalId = $scope.ExternalId;
            $scope.IndividualRenewal.Individual.ExternalId2 = $scope.ExternalId2;
            $scope.IndividualRenewal.Individual.IsArchived = $scope.IsArchived;
            $scope.IndividualRenewal.Individual.IndividualIsActive = $scope.IndividualIsActive;

            //	//Application
            $scope.IndividualRenewal.Application.ApplicationId = $scope.ApplicationId;
            $scope.IndividualRenewal.Application.ApplicationTypeId = $scope.ApplicationTypeId;
            $scope.IndividualRenewal.Application.ApplicationStatusId = $scope.ApplicationStatusId;
            $scope.IndividualRenewal.Application.ApplicationStatusReasonId = $scope.ApplicationStatusReasonId;
            $scope.IndividualRenewal.Application.ApplicationNumber = $scope.ApplicationNumber;
            $scope.IndividualRenewal.Application.ApplicationSubmitMode = $scope.ApplicationSubmitMode;
            $scope.IndividualRenewal.Application.StartedDate = $scope.StartedDate;
            $scope.IndividualRenewal.Application.SubmittedDate = $scope.SubmittedDate;
            $scope.IndividualRenewal.Application.ApplicationStatusDate = $scope.ApplicationStatusDate;
            $scope.IndividualRenewal.Application.PaymentDeadlineDate = $scope.PaymentDeadlineDate;
            $scope.IndividualRenewal.Application.PaymentDate = $scope.PaymentDate;
            $scope.IndividualRenewal.Application.ConfirmationNumber = $scope.ConfirmationNumber;
            $scope.IndividualRenewal.Application.ReferenceNumber = $scope.ReferenceNumber;
            $scope.IndividualRenewal.Application.IsFingerprintingNotRequired = $scope.IsFingerprintingNotRequired;
            $scope.IndividualRenewal.Application.IsPaymentRequired = $scope.IsPaymentRequired;
            $scope.IndividualRenewal.Application.CanProvisionallyHire = $scope.CanProvisionallyHire;
            $scope.IndividualRenewal.Application.GoPaperless = $scope.GoPaperless;
            $scope.IndividualRenewal.Application.LicenseRequirementId = $scope.LicenseRequirementId;
            $scope.IndividualRenewal.Application.WithdrawalReasonId = $scope.WithdrawalReasonId;
            $scope.IndividualRenewal.Application.LicenseTypeId = $scope.LicenseTypeId;
            $scope.IndividualRenewal.Application.ApplicationIsActive = $scope.ApplicationIsActive;

            //	//IndividualAddress
            if ($scope.IndividualRenewal.IndividualAddress.length > 0) {
                $scope.IndividualRenewal.IndividualAddress[0].IndividualAddressId = $scope.IndividualAddressId;
                $scope.IndividualRenewal.IndividualAddress[0].IndividualId = $scope.IndividualId;
                $scope.IndividualRenewal.IndividualAddress[0].AddressId = $scope.AddressId;
                $scope.IndividualRenewal.IndividualAddress[0].AddressTypeId = $scope.AddressTypeId;
                $scope.IndividualRenewal.IndividualAddress[0].BeginDate = $scope.BeginDate;
                $scope.IndividualRenewal.IndividualAddress[0].EndDate = $scope.EndDate;
                $scope.IndividualRenewal.IndividualAddress[0].IsMailingSameasPhysical = $scope.IsMailingSameasPhysical;
                $scope.IndividualRenewal.IndividualAddress[0].IsActive = $scope.IndividualAddressIsActive;
                $scope.IndividualRenewal.IndividualAddress[0].StreetLine1 = $scope.Street;
                $scope.IndividualRenewal.IndividualAddress[0].StreetLine2 = $scope.Street2;
                $scope.IndividualRenewal.IndividualAddress[0].City = $scope.City;
                $scope.IndividualRenewal.IndividualAddress[0].Zip = $scope.ZIP;
                $scope.IndividualRenewal.IndividualAddress[0].StateCode = $scope.State;

            } else {
                $scope.IndividualRenewal.IndividualAddress = null;
            }

            //	//EmploymentInformation
            //	$scope.EmploymentInformation = $scope.IndividualRenewal.EmploymentInformation[0];
            $scope.IndividualRenewal.IndividualEmployment = $scope.EmploymentInformation;
            //	//IndividualCertification
            if ($scope.IndividualRenewal.IndividualCertification != null) {
                $scope.IndividualRenewal.IndividualCertification.IndividualCertificationId = $scope.IndividualCertificationId;
                $scope.IndividualRenewal.IndividualCertification.IndividualId = $scope.IndividualId;
                $scope.IndividualRenewal.IndividualCertification.CertificationTypeId = $scope.CertificationTypeId;
                $scope.IndividualRenewal.IndividualCertification.ClinicalComptence = $scope.ClinicalComptence;
                $scope.IndividualRenewal.IndividualCertification.IsClinicalComptence = $scope.IsClinicalComptence;
                $scope.IndividualRenewal.IndividualCertification.DateIssued = $scope.DateIssued;
                $scope.IndividualRenewal.IndividualCertification.ABAMember = $scope.ABAMember;
                $scope.IndividualRenewal.IndividualCertification.PraxisExam = $scope.PraxisExam;
                $scope.IndividualRenewal.IndividualCertification.IsNBCHIS = $scope.IsNBCHIS;
                $scope.IndividualRenewal.IndividualCertification.NBCHISAccount = $scope.NBCHISAccount;
                $scope.IndividualRenewal.IndividualCertification.NBCHISCertificate = $scope.NBCHISCertificate;
                $scope.IndividualRenewal.IndividualCertification.DatePassed = $scope.DatePassed;
                $scope.IndividualRenewal.IndividualCertification.ABA = $scope.ABA;
                $scope.IndividualRenewal.IndividualCertification.ASHA = $scope.ASHA;
                $scope.IndividualRenewal.IndividualCertification.IsNBCOTCertified = $scope.IsNBCOTCertified;
                $scope.IndividualRenewal.IndividualCertification.IsNBCOTAppliedforRenewal = $scope.IsNBCOTAppliedforRenewal;
                $scope.IndividualRenewal.IndividualCertification.IsNBCOTExamScheduled = $scope.IsNBCOTExamScheduled;
                $scope.IndividualRenewal.IndividualCertification.NBCOTDateTaken = $scope.NBCOTDateTaken;
                $scope.IndividualRenewal.IndividualCertification.NBCOTDatePassed = $scope.NBCOTDatePassed;
                $scope.IndividualRenewal.IndividualCertification.NBCOTDateScheduled = $scope.NBCOTDateScheduled;
                $scope.IndividualRenewal.IndividualCertification.IndividualCertificationIsActive = $scope.IndividualCertificationIsActive;
            }
            else {
                $scope.IndividualRenewal.IndividualCertification = null;
            }


            //	//SponsorInformation
            if ($scope.IndividualRenewal.SponsorInformation != null) {
                //$scope.IndividualRenewal.SponsorInformation.SponsorId = 1;
                $scope.IndividualRenewal.SponsorInformation.FirstName = $scope.SponserFirstName;
                $scope.IndividualRenewal.SponsorInformation.MiddleName = $scope.SponserMiddleName;
                $scope.IndividualRenewal.SponsorInformation.LastName = $scope.SponserLastName;
                $scope.IndividualRenewal.SponsorInformation.SupervisorLicenseNumber = $scope.SponsersLicenseNumber;
                $scope.IndividualRenewal.SponsorInformation.SponsorAddress[0].StreetLine1 = $scope.BusinessLocationStreet1;
                $scope.IndividualRenewal.SponsorInformation.SponsorAddress[0].StreetLine2 = $scope.BusinessLocationStreet2;
                $scope.IndividualRenewal.SponsorInformation.SponsorAddress[0].City = $scope.BusinessLocationCity;
                $scope.IndividualRenewal.SponsorInformation.SponsorAddress[0].StateCode = $scope.BusinessLocationState;
                $scope.IndividualRenewal.SponsorInformation.SponsorAddress[0].Zip = $scope.BusinessLocationZIP;

            }
            else {
                $scope.IndividualRenewal.SponsorInformation = {
                    IndividualSupervisoryInfoId: 1,
                    IndividualId: $scope.IndividualId,
                    ApplicationId: $scope.ApplicationId,
                    SupervisorLicenseNumber: $scope.SponsersLicenseNumber,
                    IsActive: true,
                    IndividualNameId: 1,
                    FirstName: $scope.SponserFirstName,
                    MiddleName: $scope.SponserMiddleName,
                    LastName: $scope.SponserLastName,
                    SupervisorWorkAddressId: 1,
                    SponsorAddress: [{
                        AddressId: 1,
                        StreetLine1: $scope.BusinessLocationStreet1,
                        StreetLine2: $scope.BusinessLocationStreet2,
                        City: $scope.BusinessLocationCity,
                        StateCode: $scope.BusinessLocationState,
                        Zip: $scope.BusinessLocationZIP
                    }]
                }
            }





            //	//IndividualVeteran
            if ($scope.IndividualRenewal.IndividualVeteran != null) {

                $scope.IndividualRenewal.IndividualVeteran.IndividualVeteranId = $scope.IndividualVeteranId;
                $scope.IndividualRenewal.IndividualVeteran.IndividualId = $scope.IndividualId;
                if ($scope.Military == "yes") {
                    Military = true;
                }
                else {
                    Military = false;
                }
                $scope.IndividualRenewal.IndividualVeteran.ServedInMilitary = Military;
                $scope.IndividualRenewal.IndividualVeteran.SpouseofActiveMilitaryMember = $scope.SpouseofActiveMilitaryMember;
                $scope.IndividualRenewal.IndividualVeteran.MilitaryOccupationSpeciality = $scope.MilitarySpecialist;
                $scope.IndividualRenewal.IndividualVeteran.ServiceDateFrom = $scope.FromDateOfService;
                $scope.IndividualRenewal.IndividualVeteran.ServiceDateTo = $scope.ToDateOfService;
                $scope.IndividualRenewal.IndividualVeteran.IndividualVeteranIsActive = $scope.IndividualVeteranIsActive;
                //$scope.IndividualRenewal.IndividualVeteran.VeteranBranches = $scope.branches;

            }
            else {
                $scope.IndividualRenewal.IndividualVeteran = null;
            }


            //	//VeteranBranches
            //	$scope.VeteranBranches = $scope.IndividualRenewal.IndividualVeteran.VeteranBranches[0];

            //IndividualLegal
            //$scope.IndividualRenewal.IndividualLegal[0] = $scope.IndividualLegal;
            //	//IndividualCEH
            //	$scope.IndividualCEH = $scope.IndividualRenewal.IndividualCEH[0];

            //	//IndividualAffidavit
            $scope.IndividualRenewal.IndividualAffidavit.IndividualAffidavitId = $scope.IndividualAffidavitId;
            $scope.IndividualRenewal.IndividualAffidavit.IndividualId = $scope.IndividualId;
            $scope.IndividualRenewal.IndividualAffidavit.ContentItemLkId = $scope.IndividualAffidavitContentItemLkId;
            $scope.IndividualRenewal.IndividualAffidavit.ContentItemHash = $scope.IndividualAffidavitContentItemHash;
            $scope.IndividualRenewal.IndividualAffidavit.ContentItemResponse = $scope.IndividualAffidavitContentItemResponse;
            $scope.IndividualRenewal.IndividualAffidavit.Desc = $scope.IndividualAffidavitDesc;
            $scope.IndividualRenewal.IndividualAffidavit.IsActive = $scope.IndividualAffidavitIsActive;

            //FeesDetails
            // $scope.FeesDetails = $scope.IndividualRenewal.FeesDetails[0];

            //$scope.IndividualLicense = $scope.IndividualRenewal.IndividualLicense[0];
            //$scope.Individual = $scope.IndividualRenewal.Individual;
            //$scope.Application = $scope.IndividualRenewal.Application;
            //$scope.IndividualAddress = $scope.IndividualRenewal.IndividualAddress[0];
            //$scope.Contact = $scope.IndividualRenewal.Contact[0];
            //$scope.EmploymentInformation = $scope.IndividualRenewal.EmploymentInformation[0];
            //$scope.EmploymentAddress = $scope.EmploymentInformation[0].EmploymentAddress;




            //alert(JSON.stringify($scope.IndividualRenewal));
            LicenseRenewalHASnAService.IndividualRenewalSave(sessionStorage.Key, $scope.IndividualRenewal)
            .success(function (response) {

                if ($scope.CheckResponse(response)) {

                    alert("Successfully Login");
                    if ($scope.paymentFlag == true) {
                        window.location.href = "#/User/Payment";
                    }
                    $scope.IndividualRenewalGet();
                    //HideLoader();
                    //IndividualInfo = response.IndividualRenewal;


                } else {
                    // Else of CheckResponse Method
                }
                HideLoader();
            })
                .error(function (data) {
                    HideLoader();
                    showStatusMessage(data.message, "error");
                });
            //}
            //else {

            //}
        }
        catch (ex) {
            HideLoader();
            showStatusMessage(ex.message, "error");
        }
    }

    $scope.update = function () {
        try {
            if (validateData()) {

            }
            else {

            }
        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }

    $scope.delete = function () {
        try {

        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }

    $scope.checkLegal = function (number) {

        for (var i = 0; i < $scope.IndividualLegal.length; i++) {

            if ($scope.IndividualLegal[i].ContentItemNumber == number) {
                //  alert($scope.IndividualLegal[i].ContentItemResponse);
                $('input[name=LicenseRenewalradio' + number + ']').prop('checked', $scope.IndividualLegal[i].ContentItemResponse);
                // alert($("input[LicenseRenewalradio"+number+"]:checked").val(true));
                //$('#LicenseRenewalradio' + $scope.IndividualLegal[i].ContentItemNumber).checked=true;//$scope.IndividualLegal[i].ContentItemResponse
            }
        }
    }

    // Get State List by CountryID
    $scope.getStateByCountryID = function (CountryID) {
        try {
            CouncilInfoService.GetStateByCountryID(sessionStorage.Key, CountryID)
                    .success(function (response) {

                        if ($scope.CheckResponse(response)) {
                            $scope.StatList = response.State;
                        } else {
                            //else of CheckResponse
                        }
                    })
                    .error(function (data) {
                        showStatusMessage(data.message, "error");
                    });
        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }

    // Get State List by CountryID
    $scope.contactTypeGetAll = function () {
        try {
            LicenseRenewalHASnAService.ContactTypeGetAll(sessionStorage.Key)
                    .success(function (response) {

                        if ($scope.CheckResponse(response)) {
                            $scope.ContactTypeList = response.ContactTypeGetList;
                        } else {
                            //else of CheckResponse
                        }
                    })
                    .error(function (data) {
                        showStatusMessage(data.message, "error");
                    });
        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }

    $scope.makeSameAsPhysicalAddressOnChange = function () {
        if ($scope.IsMailingSameasPhysical == true) {
            $scope.MailingStreet = $scope.Street;
            $scope.MailingCity = $scope.City;
            $scope.MailingStreet2 = $scope.Street2;
            $scope.MailingState = $scope.State;
            $scope.MailingZIP = $scope.ZIP;
            $scope.IsMailingSameasPhysical = true;
            resetValidation();
        }
    }

    $scope.makeSameAsPhysicalAddress = function ($event) {
        var checkbox = $event.target;
        if (checkbox.checked) {
            $scope.MailingStreet = $scope.Street;
            $scope.MailingCity = $scope.City;
            $scope.MailingStreet2 = $scope.Street2;
            $scope.MailingState = $scope.State;
            $scope.MailingZIP = $scope.ZIP;

            $scope.IsMailingSameasPhysical = true;

        } else {
            $scope.MailingStreet = "";
            $scope.MailingCity = "";
            $scope.MailingStreet2 = "";
            $scope.MailingState = "";
            $scope.MailingZIP = "";

            $scope.IsMailingSameasPhysical = false;
        }
        resetValidation();
    }

    $scope.addCourse = function () {
        if (validateData("UI_IndividualRenewalLicenseRenewalHASnAEducationInformationvalidationCE")) {
            $scope.IndividualCECourse.push({ IndividualCECourseId: 0, IndividualId: $scope.IndividualId, ApplicationId: $scope.ApplicationId, CECourseTypeId: null, CECourseActivityTypeId: null, CECourseStartDate: null, CECourseEndDate: null, CECourseDueDate: null, CECourseDate: new Date($('#txtDate').val()), CECourseHours: $scope.EducationInformationCEHours, CECourseUnits: 0.00, ProgramSponsor: null, CourseNameTitle: $scope.EducationInformationCourse, CourseSponsor: null, CECourseReportingYear: null, CECourseStatusId: null, InstructorBiography: null, ActivityDesc: null, ReferenceNumber: null, IsActive: true });
            $scope.EducationInformationDate = "";
            $scope.EducationInformationCourse = "";
            $scope.EducationInformationCEHours = "";
        }

    }

    $scope.checkLegalRB = function (ContentItemNumber) {
        try {
            for (i in $scope.IndividualLegal) {
                if ($scope.IndividualLegal[i].ContentItemNumber == ContentItemNumber) {

                    $scope.IndividualLegal[i].ContentItemResponse = true;
                    $scope.IndividualLegal[i].Desc = $scope.IndividualLegal[i].Desc;
                }
            }
        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }

    $scope.checkLegalRB1 = function (ContentItemNumber) {
        try {
            for (i in $scope.IndividualLegal) {
                if ($scope.IndividualLegal[i].ContentItemNumber == ContentItemNumber) {

                    $scope.IndividualLegal[i].ContentItemResponse = false;
                }
            }
        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }
    $scope.processToPayment = function () {
        try {
            $scope.paymentFlag = true;
            $scope.insert();
        } catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }
    $scope.EditEmploymentInformation = function (IndividualEmploymentId, $index) {
        try {
            for (i in $scope.EmploymentInformation) {
                if ($scope.EmploymentInformation[i].IndividualEmploymentId == IndividualEmploymentId || $scope.$index == $index) {

                    angular.element(document.querySelector("#LicenseRenewal_EmploymentInformation")).show();
                    $scope.IndividualEmploymentId = $scope.EmploymentInformation[i].IndividualEmploymentId;
                    $scope.EmployerName = $scope.EmploymentInformation[i].EmployerName;
                    $scope.PhysicalAddressStreet = $scope.EmploymentInformation[i].EmploymentAddress[0].StreetLine1;
                    $scope.PhysicalAddressStreet2 = $scope.EmploymentInformation[i].EmploymentAddress[0].StreetLine2;
                    $scope.EmployerCity = $scope.EmploymentInformation[i].EmploymentAddress[0].City;
                    $scope.PhysicalAddressState = $scope.EmploymentInformation[i].EmploymentAddress[0].StateCode;
                    $scope.PhysicalAddressZIP = $scope.EmploymentInformation[i].EmploymentAddress[0].Zip;
                    if ($scope.EmploymentInformation[i].EmploymentContact[0].ContactTypeId == "3") {
                        $scope.WorkPhone = $scope.EmploymentInformation[i].EmploymentContact[0].ContactInfo;
                    }
                    if ($scope.EmploymentInformation[i].EmploymentContact[0].ContactTypeId == "4") {
                        $scope.AlternatePhone = $scope.EmploymentInformation[i].EmploymentContact[0].ContactInfo;
                    }
                    $scope.chkEmployment = false;
                }
            }
        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }

    $scope.DeleteEmploymentInformation = function ($index) {
        try {
            $scope.EmploymentInformation.splice($scope.EmploymentInformation.indexOf($index), 1);
        } catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }

    $scope.SaveEmploymentInformation = function () {
        try {

            var IndividualEmploymentId = $scope.IndividualEmploymentId;
            if ($scope.chkEmployment = true) {

                if (validateData("UI_IndividualRenewalLicenseRenewalHASnAEmployementvalidation")) {
                    if ($scope.WorkPhone != null) {
                        Code = "W";
                        ContactTypeId = 3;
                        ContactInfo = $scope.WorkPhone;
                    }
                    else {
                        Code = "";
                        ContactTypeId = null;
                    }
                    if ($scope.AlternatePhone != null) {
                        Code = "A";
                        ContactTypeId = 4;
                        ContactInfo = $scope.AlternatePhone;
                    }
                    else {
                        Code = "";
                        ContactTypeId = null;
                    }
                    $scope.EmploymentInformation.push({ IndividualEmploymentId: 0, IndividualId: $scope.IndividualId, ApplicationId: $scope.ApplicationId, EmployerName: $scope.EmployerName, ProviderId: 0, EmploymentHistoryTypeId: null, EmploymentStartDate: $('#txtDateofBirth').val(), EmploymentEndDate: null, EmploymentStatusId: null, EmploymentTypeId: null, PositionId: null, IsWorkinginFieldofApplication: false, EverWorkedinFieldofApplication: false, ReferenceNumber: "", Role: null, IsActive: true, EmploymentAddress: [{ IndividualEmploymentAddressId: 0, IndividualId: $scope.IndividualId, AddressId: 0, IndividualEmploymentId: 0, AddressTypeId: 1, BeginDate: $scope.EmploymentStartDate, EndDate: null, IsMailingSameasPhysical: false, IsActive: true, Addressee: "", StreetLine1: $scope.PhysicalAddressStreet, StreetLine2: $scope.PhysicalAddressStreet2, City: $scope.EmployerCity, StateCode: $scope.PhysicalAddressState, Zip: $scope.PhysicalAddressZIP, CountyId: null, CountryId: 235 }], EmploymentContact: [{ IndividualEmploymentContactId: 0, IndividualId: $scope.IndividualId, ContactId: 0, IndividualEmploymentId: 0, ContactTypeId: ContactTypeId, BeginDate: $scope.EmploymentStartDate, EndDate: null, IsPreferredContact: true, IsMobile: true, IsActive: true, ContactFirstName: "", ContactLastName: "", ContactMiddleName: "", Code: Code, ContactInfo: ContactInfo, DateContactValidated: null }] });
                }
            }
            else {
                for (i in $scope.EmploymentInformation) {
                    if ($scope.EmploymentInformation[i].IndividualEmploymentId == IndividualEmploymentId) {

                        $scope.EmploymentInformation[i].IndividualEmploymentId = $scope.IndividualEmploymentId;
                        $scope.EmploymentInformation[i].EmployerName = $scope.EmployerName;
                        $scope.EmploymentInformation[i].EmploymentAddress[0].StreetLine1 = $scope.PhysicalAddressStreet;
                        $scope.EmploymentInformation[i].EmploymentAddress[0].StreetLine2 = $scope.PhysicalAddressStreet2;
                        $scope.EmploymentInformation[i].EmploymentAddress[0].City = $scope.EmployerCity;
                        $scope.EmploymentInformation[i].EmploymentAddress[0].StateCode = $scope.PhysicalAddressState;
                        $scope.EmploymentInformation[i].EmploymentAddress[0].Zip = $scope.PhysicalAddressZIP;
                        if ($scope.WorkPhone != null) {
                            $scope.EmploymentInformation[i].EmploymentContact[0].ContactInfo = $scope.WorkPhone;
                            $scope.EmploymentInformation[i].EmploymentContact[0].ContactTypeId = 3;
                        }
                        if ($scope.AlternatePhone != null) {
                            $scope.EmploymentInformation[i].EmploymentContact[0].ContactInfo = $scope.AlternatePhone;
                            $scope.EmploymentInformation[i].EmploymentContact[0].ContactTypeId = 4;
                        }
                    }
                }
            }
        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }

    $scope.clearDataEmployment = function () {
        try {
            $scope.chkEmployment = true;
            $scope.EmployerName = "";
            $scope.PhysicalAddressStreet = "";
            $scope.PhysicalAddressStreet2 = "";
            $scope.EmployerCity = "";
            $scope.PhysicalAddressState = "";
            $scope.PhysicalAddressZIP = "";
            $scope.WorkPhone = "";
            $scope.AlternatePhone = "";
            $scope.EmploymentStartDate = "";
            $scope.Fax = "";

        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }

    $scope.branches = [];
    $scope.updateSelection = function (action, Id) {

        if (action == 'push' && $scope.branches.indexOf(Id) == -1) {

            $scope.branches.push(Id);
        }
        if (action == 'pop' && $scope.branches.indexOf(Id) != -1) {

            $scope.branches.splice($scope.branches.indexOf(Id), 1);

        }
    };

    $scope.getSelectedCheckboxValue = function (Id) {

        for (var i in $scope.IndividualRenewal.IndividualVeteran.VeteranBranches) {
            if ($scope.IndividualRenewal.IndividualVeteran.VeteranBranches[i].BranchofServicesId == Id) {
                $scope.IndividualRenewal.IndividualVeteran.VeteranBranches[i].BranchofServicesIdResponse = true;
            }
        }
        //var checkbox = $event.target;
        //var action = (checkbox.checked ? 'push' : 'pop');
        //$scope.updateSelection(action, Id);

    };
    $scope.addBusinessInformation = function (ID) {

        for (var i = 0; i < $scope.IndividualRenewal.BusinessLicenseInformation.length; i++) {

            if ($scope.IndividualRenewal.BusinessLicenseInformation[i].IndividualNVBusinessLicenseId == ID) {
                if (ID != 1) {
                    $scope.IndividualRenewal.BusinessLicenseInformation[i].ContentItemResponse = true;
                    $scope.IndividualRenewal.BusinessLicenseInformation[i].NameonBusinessLicense = "";
                    $scope.IndividualRenewal.BusinessLicenseInformation[i].BusinessLicenseNumber = "";
                }
                else {
                    $scope.IndividualRenewal.BusinessLicenseInformation[i].ContentItemResponse = true;
                    $scope.IndividualRenewal.BusinessLicenseInformation[i].NameonBusinessLicense = $('#txtNameOfBusinessLicense').val();
                    $scope.IndividualRenewal.BusinessLicenseInformation[i].BusinessLicenseNumber = $('#txtBusinessLicense').val();
                }

            }
            else {
                $scope.IndividualRenewal.BusinessLicenseInformation[i].ContentItemResponse = false;
            }
        }
    }

    $scope.addIndividualChildSupport = function (ID) {

        for (var i = 0; i < $scope.IndividualRenewal.IndividualChildSupport.length; i++) {

            if ($scope.IndividualRenewal.IndividualChildSupport[i].IndividualChildSupportId == ID) {
                $scope.IndividualRenewal.IndividualChildSupport[i].ContentItemResponse = true;
            }
            else {
                $scope.IndividualRenewal.IndividualChildSupport[i].ContentItemResponse = false;
            }
        }
    }
    $scope.newBranchesCheckbox = [];
    $scope.isSelected = function (Id) {
        var statu;
        for (var i = 0; i < $scope.newBranchesCheckbox.length; i++) {
            if ($scope.newBranchesCheckbox[i].ID == Id) {
                statu = true;
                break;
            }
            else {
                statu = false;
            }
        }
        return statu;
    };



});


natApp.controller("LicenseRenewalSPLController", function ($scope, $controller) {
    $controller('GlobalController', { $scope: $scope });
});

natApp.controller("PaymentController", function ($scope, $controller, ProcessPaymentService, IndividualDocumentSaveService) {
    $controller('GlobalController', { $scope: $scope });
    // Variables
    $scope.ApplicationNumber = "";
    $scope.InvoiceNumber = "";
    $scope.PaymentMethod = "";
    $scope.ApplicationFee = "";
    $scope.ConvenienceFee = "";
    $scope.LateFee = "";
    $scope.CardNumber = "";
    $scope.CVV = "";
    $scope.ExpirationMonth = "";
    $scope.ExpirationYear = "";
    $scope.FirstName = "";
    $scope.LastName = "";
    $scope.Street = "";
    $scope.City = "";
    $scope.State = "";
    $scope.Zip = "";
    $scope.Country = "";
    $scope.MonthList = [];
    $scope.YearList = [];
    $scope.CountryList = [];
    $scope.PaymentFlag = false;
    $scope.PrintLicenseFlag = false;
    $scope.DocumentUploadList = [];

    // Init
    $scope.init = function () {
        if (sessionStorage.PaymentDone == "true") {
            window.location.href = "#/User/Loginwoemail";
        }
        HideLoader();
        if ($scope.isSessionActive()) {

            $scope.ApplicationNumber = sessionStorage.ApplicationNumber;
            // $scope.InvoiceNumber = sessionStorage.InvoiceNumber;
            $scope.ApplicationFee = sessionStorage.RenewalFees;
            $scope.ConvenienceFee = 0;
            $scope.LateFee = sessionStorage.LateFees;

            $scope.TotalFees = parseInt($scope.ApplicationFee) + $scope.ConvenienceFee + parseInt($scope.LateFee);
            $scope.monthListGet();
            $scope.yearListGet();
            $scope.countryGetAll();
            $scope.Country = parseInt("235");
            $scope.countrySelectChange($scope.Country);
            $scope.initiatePayment();
        }
        else {
            window.location.href = "#/User/Loginwoemail";
        }
    }
    // Save
    $scope.Save = function () {
        try {
            ShowLoader("Please wait...");
            if (validateData("UI_Paymentvalidation")) {
                ApplicationNumber = sessionStorage.ApplicationNumber;
                ApplicationId = sessionStorage.ApplicationId;
                IndividualId = sessionStorage.IndividualId;
                CardNumber = $scope.CardNumber;
                CVV = $scope.CVV;
                ExpirationMonths = $scope.ExpirationMonth;
                ExpirationYears = $scope.ExpirationYear;
                Amount = $scope.TotalFees;
                Description = "Test";
                InvoiceNumber = sessionStorage.InvoiceNumber;
                FirstName = $scope.FirstName;
                LastName = $scope.LastName;
                Address = $scope.Street;
                City = $scope.City;
                StateCode = $scope.State;
                Zip = $scope.Zip;
                Country = $scope.Country;
                //EmailAddress = sessionStorage.Email;
                EmailAddress = $scope.Email;
                TransactionObject = $scope.TransactionObject;
                RequestedLicenseStatusTypeId = sessionStorage.RequestedLicenseStatusTypeId;
                exportPaymentReceiptToPDF();
                exportLicenseOutputToPDF();
                ProcessPaymentService.ProcessPayment(sessionStorage.Key, ApplicationNumber, ApplicationId, IndividualId, CardNumber, CVV, ExpirationMonths, ExpirationYears, Amount, Description, InvoiceNumber, FirstName, LastName, Address, City, StateCode, Zip, Country, EmailAddress, TransactionObject, RequestedLicenseStatusTypeId)
                .success(function (response) {

                    if ($scope.CheckResponse(response)) {
                        sessionStorage.LicenseFee = $scope.TotalFees;
                        sessionStorage.referenceNumber = response.PaymentAuthResponse.AuthorizationCode;
                        debugger;
                        // Start Call Document Service API
                        $scope.DocumentUploadList.push({
                            IndividualDocumentId: 0,
                            DocumentLkToPageTabSectionId: 1,
                            DocumentLkToPageTabSectionCode: "R",
                            DocumentTypeName: "Payment Receipt",
                            DocNameWithExtention: "",
                            DocStrBase65: sessionStorage.PaymentReceipt64,
                            EffectiveDate: "base64 of file",
                            EndDate: null,
                            IsDocumentUploadedbyIndividual: true,
                            IsDocumentUploadedbyStaff: false,
                            ReferenceNumber: ""
                        });

                        $scope.DocumentUploadList.push({
                            IndividualDocumentId: 0,
                            DocumentLkToPageTabSectionId: 1,
                            DocumentLkToPageTabSectionCode: "R",
                            DocumentTypeName: "Payment Receipt",
                            DocNameWithExtention: "",
                            DocStrBase65: sessionStorage.LicenseOutPut64,
                            EffectiveDate: "base64 of file",
                            EndDate: null,
                            IsDocumentUploadedbyIndividual: true,
                            IsDocumentUploadedbyStaff: false,
                            ReferenceNumber: ""
                        });

                        $scope.DocumentUploadList.push({
                            IndividualDocumentId: 0,
                            DocumentLkToPageTabSectionId: 1,
                            DocumentLkToPageTabSectionCode: "R",
                            DocumentTypeName: "Payment Receipt",
                            DocNameWithExtention: "",
                            DocStrBase65: sessionStorage.RenewalApplication64,
                            EffectiveDate: "base64 of file",
                            EndDate: null,
                            IsDocumentUploadedbyIndividual: true,
                            IsDocumentUploadedbyStaff: false,
                            ReferenceNumber: ""
                        });
                        IndividualDocumentSaveService.IndividualDocumentSave(sessionStorage.Key, IndividualId, ApplicationId, Email = $scope.Email, SendEmail = "true", DocumentUploadList = $scope.DocumentUploadList)
                        .success(function (response) {
                            debugger;
                            if ($scope.CheckResponse(response)) {

                            }
                            else {
                            }
                            HideLoader();
                        }).error(function (data) {
                            showStatusMessage(data.message, "error");
                        });

                        // End Call Document Service API

                        showStatusMessage(response.Message, "success");
                        window.location.href = "#/User/PaymentConformation";
                    }
                    else {


                    }
                    HideLoader();
                }).error(function (data) {
                    HideLoader();
                    showStatusMessage(data.message, "error");
                });
            }
            else {
                $scope.CVV = "";
                HideLoader();
            }
        }
        catch (ex) {
            $scope.CVV = "";
            HideLoader();
            showStatusMessage(ex.message, "error");
        }
    }

    function exportPaymentReceiptToPDF() {
        $scope.PaymentFlag = true;
        $("#PaymentReceeiptID").show();
        html2canvas(document.getElementById('PaymentReceeiptID'), {
            onrendered: function (canvas) {
                var decument = canvas.toDataURL();
                var docDefinition = {
                    content: [{
                        image: decument,
                        width: 500,
                    }]
                };
                var data;
                pdfMake.createPdf(docDefinition).getBase64(function (docDefinition) {
                    data = docDefinition;
                    sessionStorage.PaymentReceipt64 = data;
                    // alert("PaymentReceipt = " + sessionStorage.PaymentReceipt64);
                });
                $scope.PaymentFlag = false;
                $("#PaymentReceeiptID").hide();
            }
        });
    };


    function exportLicenseOutputToPDF() {

        $scope.PrintLicenseFlag = true;
        $("#PrintLicenseID").show();
        html2canvas(document.getElementById('PrintLicenseID'), {
            onrendered: function (canvas) {
                var datadata = canvas.toDataURL();
                var docDefinition = {
                    content: [{
                        image: datadata,
                        width: 500,
                    }]
                };
                var data;
                pdfMake.createPdf(docDefinition).getBase64(function (docDefinition) {
                    data = docDefinition;
                    sessionStorage.LicenseOutPut64 = data;
                    // alert("License = " + sessionStorage.LicenseOutPut64);
                });
                $scope.PrintLicenseFlag = false;
                $("#PrintLicenseID").hide();
            }
        });
    }

    $scope.monthListGet = function () {
        try {

            ProcessPaymentService.MonthListGet(sessionStorage.Key)
                    .success(function (response) {

                        if ($scope.CheckResponse(response)) {
                            $scope.MonthList = response.ListItems;
                        } else {
                            //else of CheckResponse
                        }
                    })
                    .error(function (data) {

                        showStatusMessage(data.message, "error");
                    });
        }
        catch (ex) {

            showStatusMessage(ex.message, "error");
        }
    }

    $scope.yearListGet = function () {
        try {

            ProcessPaymentService.YearListGet(sessionStorage.Key)
                    .success(function (response) {

                        if ($scope.CheckResponse(response)) {
                            $scope.YearList = response.ListItems;
                        } else {
                            //else of CheckResponse
                        }
                    })
                    .error(function (data) {

                        showStatusMessage(data.message, "error");
                    });
        }
        catch (ex) {

            showStatusMessage(ex.message, "error");
        }
    }

    // Get State List by CountryID
    $scope.getStateByCountryID = function (CountryID) {
        try {
            ProcessPaymentService.GetStateByCountryID(sessionStorage.Key, CountryID)
                    .success(function (response) {

                        if ($scope.CheckResponse(response)) {
                            $scope.StatList = response.State;
                        } else {
                            //else of CheckResponse
                        }
                    })
                    .error(function (data) {

                        showStatusMessage(data.message, "error");
                    });
        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }

    // Get Country List 
    $scope.countryGetAll = function () {
        try {
            ProcessPaymentService.CountryGetAll(sessionStorage.Key)
                    .success(function (response) {

                        if ($scope.CheckResponse(response)) {
                            $scope.CountryList = response.Country;
                        } else {
                            //else of CheckResponse
                        }
                    })
                    .error(function (data) {

                        showStatusMessage(data.message, "error");
                    });
        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }

    // Get Country List 
    $scope.countrySelectChange = function (CountryID) {
        try {

            $scope.getStateByCountryID(CountryID);
            for (var i = 0; i < $scope.CountryList.length; i++) {
                if ($scope.CountryList[i].CountryId == CountryID) {
                    $scope.ZipRegx = $scope.CountryList[i].ZipRegex;

                }
            }

        }
        catch (ex) {
            showStatusMessage(ex.message, "error");
        }
    }

    $scope.clearPaymentData = function () {

        $scope.CardNumber = "";
        $scope.CVV = "";
        $scope.ExpirationMonth = "";
        $scope.ExpirationYear = "";
        $scope.TotalFees = "";
        $scope.FirstName = "";
        $scope.LastName = "";
        $scope.Street = "";
        $scope.City = "";
        $scope.State = "";
        $scope.Zip = "";
        $scope.Country = "";
        $scope.Email = "";
        resetValidation();
    }

    // Get Initiate Payment 
    $scope.initiatePayment = function () {
        try {


            ApplicationId = sessionStorage.ApplicationId;
            IndividualId = sessionStorage.IndividualId;
            IndividualLicenseId = sessionStorage.IndividualLicenseId;
            LicenseTypeId = sessionStorage.LicenseTypeId;
            LicenseNumber = sessionStorage.LicenseNumber;
            TransactionDeviceTy = "BC";
            FeeDetailsList = JSON.parse(sessionStorage.FeesDetails);
            TransactionObject = null;

            ProcessPaymentService.InitiatePayment(sessionStorage.Key, ApplicationId, IndividualId, IndividualLicenseId, LicenseTypeId, LicenseNumber, TransactionDeviceTy, FeeDetailsList, TransactionObject)
                    .success(function (response) {

                        if ($scope.CheckResponse(response)) {
                            $scope.TransactionObject = response.Transaction;
                            $scope.InvoiceNumber = $scope.TransactionObject.InvoiceNumber;
                            sessionStorage.InvoiceNumber = $scope.InvoiceNumber;
                            sessionStorage.TransactionStartDatetime = $scope.TransactionObject.TransactionStartDatetime;
                        } else {
                            //else of CheckResponse
                        }
                    })
                    .error(function (data) {

                        showStatusMessage(data.message, "error");
                    });
        }
        catch (ex) {

            showStatusMessage(ex.message, "error");
        }
    }

    $scope.fillDetail = function (copyValue) {


        if (copyValue == true) {
            resetValidation();

            $scope.FirstName = sessionStorage.FirstName;
            $scope.LastName = sessionStorage.LastName;
            $scope.Email = sessionStorage.Email;
            $scope.Street = sessionStorage.Street;
            $scope.City = sessionStorage.City;
            //$scope.Country = sessionStorage.FirstName;
            $scope.State = sessionStorage.State;
            $scope.Zip = sessionStorage.Zip;
        }
        else {
            $scope.FirstName = "";
            $scope.LastName = "";
            $scope.Email = "";
            $scope.Street = "";
            $scope.City = "";
            //$scope.Country = sessionStorage.FirstName;
            $scope.State = "";
            $scope.Zip = "";

        }
    }

});

natApp.controller("PaymentConformationController", function ($scope, $controller, ProcessPaymentService) {
    $controller('GlobalController', { $scope: $scope });
    // Variables
    $scope.ApplicationNumber = "";
    $scope.ApplicationName = "";
    $scope.InvoiceNumber = "";
    $scope.PaymentMethod = "";
    $scope.ApplicationFee = "";
    $scope.ConvenienceFee = "";
    $scope.LateFee = "";
    $scope.ReferenceNumber = "";
    $scope.LegalStatus = "";
    $scope.LicenseTypeName = "";
    $scope.IndividualName = "";
    $scope.RenewalApplication64 = "";

    // Init
    $scope.init = function () {

        HideLoader();
        if ($scope.isSessionActive()) {
            sessionStorage.PaymentDone = "true";
            $scope.ApplicationNumber = sessionStorage.ApplicationNumber;

            $scope.InvoiceNumber = sessionStorage.InvoiceNumber;
            $scope.ApplicationFee = sessionStorage.RenewalFees;
            $scope.ConvenienceFee = 0;
            $scope.LateFee = sessionStorage.LateFees;
            $scope.ReferenceNumber = sessionStorage.referenceNumber;
            $scope.TransactionDate = new Date(sessionStorage.TransactionStartDatetime);
            $scope.TransactionTime = "5:00 PM";

            $scope.OriginalLicenseDate = sessionStorage.OriginalLicenseDate;
            $scope.LicenseExpirationDate = sessionStorage.LicenseExpirationDate;
            $scope.LicenseNumber = sessionStorage.LicenseNumber;

            $scope.LicenseFee = sessionStorage.LicenseFee;
            $scope.ApplicationRequest = 0;
            $scope.MassageLicenseApplication = 0;
            $scope.BackgroundCheck = 0;
            $scope.LegalStatus = sessionStorage.LegalStatus;
            if ($scope.LegalStatus == "true") {
                $("#BTNPrintLicense").hide();
            }
            else {
                $("#BTNPrintLicense").show();
            }
            //$scope.FeesTotal = parseInt($scope.ApplicationFee) + parseInt($scope.LateFee);


            $scope.TotalFees = parseInt($scope.LicenseFee) + parseInt($scope.MassageLicenseApplication) + parseInt($scope.ApplicationRequest) + parseInt($scope.BackgroundCheck);
            $scope.ApplicationName = sessionStorage.ApplicationTypeName;
            $scope.LicenseTypeName = sessionStorage.LicenseTypeName;
            $scope.IndividualName = sessionStorage.IndividualName;
            $scope.RenewalApplication64 = sessionStorage.RenewalApplication64;

        }
        else {
            window.location.href = "#/User/Loginwoemail";
        }
    }

    // Save
    // Code For Generate a PDF file for Print Renewal Application
    $scope.PaymentReceiptFlag = false;
    $scope.exportToPDF = function () {
        ShowLoader("Please wait...");
        $scope.PaymentReceiptFlag = true;
        $("#PaymentReceiptID").show();
        html2canvas(document.getElementById('PaymentReceiptID'), {
            onrendered: function (canvas) {
                var data = canvas.toDataURL();
                var docDefinition = {
                    content: [{
                        image: data,
                        width: 500,
                    }]
                };
                //sessionStorage.LicenseType ,sessionStorage.ApplicationType
                var filename = sessionStorage.LicenseNumber + "+" + sessionStorage.ApplicationTypeName + "+" + sessionStorage.ApplicationNumber + "+" + sessionStorage.LicenseTypeName + "+" + "Payment Receipt";
                pdfMake.createPdf(docDefinition).download(filename + ".pdf");
                $scope.PaymentReceiptFlag = false;
                $("#PaymentReceiptID").hide();
                HideLoader();
            }
        });
    };

    // Code For Generate a PDF file for Print License
    $scope.PrintLicenseFlag = false;
    $scope.GenerateLicensetToPDF = function () {
        ShowLoader("Please wait...");
        $scope.PrintLicenseFlag = true;
        $("#PrintLicenseID").show();
        html2canvas(document.getElementById('PrintLicenseID'), {
            onrendered: function (canvas) {

                var data = canvas.toDataURL();
                var docDefinition = {
                    content: [{
                        image: data,
                        width: 500,
                    }]
                };
                //sessionStorage.LicenseType ,sessionStorage.ApplicationType
                var filename = sessionStorage.LicenseNumber + "+" + sessionStorage.ApplicationTypeName + "+" + sessionStorage.ApplicationNumber + "+" + sessionStorage.LicenseTypeName + "+" + "License Output";
                pdfMake.createPdf(docDefinition).download(filename + ".pdf");
                $scope.PrintLicenseFlag = false;
                $("#PrintLicenseID").hide();
                HideLoader();
            }
        });
    }
    $scope.GenerateApplicationPDF = function () {
        ShowLoader("Please wait...");
        var filename = sessionStorage.LicenseNumber + "+Hearing Aid Specialist+" + sessionStorage.ApplicationNumber + "+License Renewal+" + "Renewal Application";
        // pdfMake.createPdf(sessionStorage.RenewalApplication64).download(filename + ".pdf");
        //window.open("data:application/pdf;base64," + btoa(sessionStorage.RenewalApplication64));
        // window.open("data:application/pdf," + escape(sessionStorage.RenewalApplication64));
        //window.open('data:application/pdf,' + escape);
        DocumentService.getFileData(sessionStorage.RenewalApplication64).then(function (data) {
            debugger;
            var decodedFileData = atob(data.file_data);
            var file = new Blob([decodedFileData], { type: doc.file_type });
            saveAs(file, doc.title + '.' + doc.extension);
        });


        HideLoader();
    }
});