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
        let output = '';
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
        let subscription = findInXmsMirid("subscriptions", false, token);

        let resourceGroup = findInXmsMirid("resourcegroups", false, token);

        let azureIdentity = {
            subscriptionId: subscription,
            resourceGroup: resourceGroup
        };

        let providers = findInXmsMirid("providers", true, token);

        let userIdentityRegex = /Microsoft\.ManagedIdentity\/(?:[^\/]+\/)*([^\/]+)/;
        let userIdentity = userIdentityRegex.exec(providers);

        azureIdentity.isUserIdentity = userIdentity && userIdentity.length > 1;
        azureIdentity.identity = azureIdentity.isUserIdentity ? userIdentity[1] : token.oid;

        return azureIdentity;
    }

    function findInXmsMirid(xmsMiridKey, shouldMatchToEnd, token) {
        let valueRegex = shouldMatchToEnd ? '(.+)$' : '([^\\/]+)';
        let subscriptionMatch = token.xms_mirid.match(`\\b${xmsMiridKey}\\/${valueRegex}`);
        if (!subscriptionMatch || subscriptionMatch.length <= 1){
            throw new Error(`Failed to find ${xmsMiridKey} in xms_mirid: ${token.xms_mirid}`);
        }
        return subscriptionMatch[1];
    }
})();
