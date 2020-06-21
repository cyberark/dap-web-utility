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
        let output;
        if (!hostId) {
            output = "host ID is missing";
        } else if (!encodedToken) {
            output = "Azure managed identity token is missing";
        } else {
            output = getPolicyFromToken(encodedToken, hostId);
        }
        $("#policy").html(output);
    }

    function getPolicyFromToken(encodedToken) {
        try {
            let decodedToken = jwt_decode(encodedToken);
            let azureIdentity = parseAzureToken(decodedToken);
            let identityAnnotation = azureIdentity.isUserIdentity ? "user-assigned-identity" : "system-assigned-identity";

            return `
            - !host
              id: ${hostId}
              annotations:
                authn-azure/subscription-id: ${azureIdentity.subscriptionId}
                authn-azure/resource-group: ${azureIdentity.resourceGroup}
              # The following is optional
                authn-azure/${identityAnnotation}: ${azureIdentity.identity}
            `;
        } catch (e) {
            console.error(e);
            return "Failed to parse Azure managed identity Token: \n" + e;
        }
    }

    function parseAzureToken(token) {
        let subscriptionRegex = /\bsubscriptions\/([^\/]+)/;
        let subscription = findInXmsMirid("subscriptions", subscriptionRegex, token);

        let resourceGroupsRegex = /\bresourcegroups\/([^\/]+)/;
        let resourceGroup = findInXmsMirid("resourcegroups", resourceGroupsRegex, token);

        let azureIdentity = {
            subscriptionId: subscription,
            resourceGroup: resourceGroup
        };

        let providersRegex = /\bproviders\/(.+)$/;
        let providers = findInXmsMirid("providers", providersRegex, token);

        let userIdentityRegex = /Microsoft\.ManagedIdentity\/(?:[^\/]+\/)*([^\/]+)/;
        let userIdentity = userIdentityRegex.exec(providers);

        azureIdentity.isUserIdentity = userIdentity && userIdentity.length > 1;
        azureIdentity.identity = azureIdentity.isUserIdentity ? userIdentity[1] : token.oid;

        return azureIdentity;
    }

    function findInXmsMirid(name, subscriptionRegex, token) {
        let subscriptionMatch = subscriptionRegex.exec(token.xms_mirid);
        if (!subscriptionMatch || subscriptionMatch.length <= 1){
            throw new Error(`Failed to find ${name} in xms_mirid: ${token.xms_mirid}`);
        }
        return subscriptionMatch[1];
    }
})();
