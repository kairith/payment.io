const paymentsClient = new google.payments.api.PaymentsClient({
    environment: 'TEST'  // Change to 'PRODUCTION' for production environment
});

const baseRequest = {
    apiVersion: 2,
    apiVersionMinor: 0
};

const allowedCardNetworks = ["AMEX", "DISCOVER", "JCB", "MASTERCARD", "VISA"];
const allowedCardAuthMethods = ["PAN_ONLY", "CRYPTOGRAM_3DS"];

const tokenizationSpecification = {
    type: 'PAYMENT_GATEWAY',
    parameters: {
        'gateway': 'example',  // Change to your payment gateway
        'gatewayMerchantId': 'exampleGatewayMerchantId'  // Change to your merchant ID
    }
};

const baseCardPaymentMethod = {
    type: 'CARD',
    parameters: {
        allowedAuthMethods: allowedCardAuthMethods,
        allowedCardNetworks: allowedCardNetworks
    }
};

const cardPaymentMethod = Object.assign(
    {},
    baseCardPaymentMethod,
    {
        tokenizationSpecification: tokenizationSpecification
    }
);

function getGoogleIsReadyToPayRequest() {
    return Object.assign(
        {},
        baseRequest,
        {
            allowedPaymentMethods: [baseCardPaymentMethod]
        }
    );
}

function getGooglePaymentDataRequest() {
    const paymentDataRequest = Object.assign({}, baseRequest);
    paymentDataRequest.allowedPaymentMethods = [cardPaymentMethod];
    paymentDataRequest.transactionInfo = {
        totalPriceStatus: 'FINAL',
        totalPrice: '1.00',  // Change to your price
        currencyCode: 'USD',  // Change to your currency
    };
    paymentDataRequest.merchantInfo = {
        merchantName: 'Example Merchant'  // Change to your merchant name
    };
    return paymentDataRequest;
}

function onGooglePayLoaded() {
    const paymentsClient = new google.payments.api.PaymentsClient({environment: 'TEST'});
    paymentsClient.isReadyToPay(getGoogleIsReadyToPayRequest())
        .then(function(response) {
            if (response.result) {
                addGooglePayButton();
            }
        })
        .catch(function(err) {
            console.error(err);
        });
}

function addGooglePayButton() {
    const paymentsClient = new google.payments.api.PaymentsClient({environment: 'TEST'});
    const button = paymentsClient.createButton({onClick: onGooglePaymentButtonClicked});
    document.getElementById('container').appendChild(button);
}

function onGooglePaymentButtonClicked() {
    const paymentDataRequest = getGooglePaymentDataRequest();
    const paymentsClient = new google.payments.api.PaymentsClient({environment: 'TEST'});
    paymentsClient.loadPaymentData(paymentDataRequest)
        .then(function(paymentData) {
            processPayment(paymentData);
        })
        .catch(function(err) {
            console.error(err);
        });
}

function processPayment(paymentData) {
    console.log(paymentData);
    // Process payment data
}

document.addEventListener('DOMContentLoaded', onGooglePayLoaded);
