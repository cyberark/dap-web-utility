(function() {
    $(document).ready(function () {

        $('#encodedToken').on('input', tokenInputChanged);

        $('#tblInput input').on('input', hostIdInputChanged);
    });

    let hostId;
    let encodedToken;

    function hostIdInputChanged() {
        hostId = $("#txtHostId").val();
        updatePolicy();
    }

    function tokenInputChanged() {
        encodedToken = $("#encodedToken").val();
        updatePolicy();
    }

    function updatePolicy() {
        let output = "";
        if (!hostId) {
            output = "host ID is missing";
        } else if (!encodedToken) {
            output = "Azure AD token is missing";
        } else {
            output = getPolicyFromToken(encodedToken, hostId);
        }
        $("#output").html(output);
    }

    function getPolicyFromToken(encodedToken, appId) {
        try {
            let decodedToken = jwt_decode(encodedToken);
            let token = parseAzureToken(decodedToken);

            return `
            - !host
              id: ${hostId}
              annotations:
                authn-azure/subscription-id: ${token.subscriptionId}
                authn-azure/resource-group: ${token.resourceGroup}
              # The following is optional
                authn-azure/${token.isUserIdentity ? "user" : "system"}-assigned-identity: ${token.identity}
            `;
        } catch (e) {
            console.error(e);
            return "Failed to parse Azure AD Token"
        }
    }

    function parseAzureToken(token) {
        return token.xms_mirid.split('/').reduce((azureIdentity, cur, i, arr) => {
            switch (cur) {
                case "subscriptions":
                    azureIdentity.subscriptionId = arr[i + 1];
                    break;
                case "resourcegroups":
                    azureIdentity.resourceGroup = arr[i + 1];
                    break;
                case "providers":
                    azureIdentity.isUserIdentity = arr.includes("Microsoft.ManagedIdentity", i + 1);
                    azureIdentity.identity = azureIdentity.isUserIdentity ? arr[arr.length - 1] : token.oid;
                    break;
            }
            return azureIdentity;
        }, {});
    }
})();
