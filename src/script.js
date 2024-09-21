// DESIGNED BY BEYONDTECH
// script.js

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Materialize components
    var elems = document.querySelectorAll('select');
    M.FormSelect.init(elems);

    var collapsibleElems = document.querySelectorAll('.collapsible');
    M.Collapsible.init(collapsibleElems);
});

function calculateLoss() {
    // Step 1: Distance and Attenuation
    const cableDistance = parseFloat(document.getElementById('cableDistance').value);
    const distanceUnit = document.getElementById('distanceUnit').value;
    const attenuationPerUnit = parseFloat(document.getElementById('attenuationPerUnit').value);

    if (isNaN(cableDistance) || isNaN(attenuationPerUnit)) {
        M.toast({html: 'Please complete all fields in Step 1.', classes: 'red'});
        return;
    }

    let distanceInKm = cableDistance;
    if (distanceUnit === 'm') {
        distanceInKm = cableDistance / 1000;
    }

    const totalFiberLoss = distanceInKm * attenuationPerUnit;

    // Step 2: Connector Losses
    const connectorLoss = parseFloat(document.getElementById('connectorLoss').value);
    const numConnectorPairs = parseInt(document.getElementById('numConnectorPairs').value) || 0;
    const totalConnectorLoss = connectorLoss * numConnectorPairs;

    // Step 3: Splice Losses
    const spliceLoss = parseFloat(document.getElementById('spliceLoss').value);
    const numSplices = parseInt(document.getElementById('numSplices').value) || 0;
    const totalSpliceLoss = spliceLoss * numSplices;

    // Step 4: Other Component Losses
    const switchLoss = parseFloat(document.getElementById('switchLoss').value) || 0;
    const splitterLoss = parseFloat(document.getElementById('splitterLoss').value) || 0;
    const otherLoss = parseFloat(document.getElementById('otherLoss').value) || 0;
    const totalOtherLoss = switchLoss + splitterLoss + otherLoss;

    // Step 5: Electronic Equipment Specifications
    const transmitterPower = parseFloat(document.getElementById('transmitterPower').value);
    const receiverSensitivity = parseFloat(document.getElementById('receiverSensitivity').value);

    if (isNaN(transmitterPower) || isNaN(receiverSensitivity)) {
        M.toast({html: 'Please complete all fields in Step 5.', classes: 'red'});
        return;
    }

    const systemGain = transmitterPower - receiverSensitivity;

    // Step 6: Power Penalties
    const powerPenalties = parseFloat(document.getElementById('powerPenalties').value) || 0;
    const repairMargin = parseFloat(document.getElementById('repairMargin').value) || 0;
    const totalPenalties = powerPenalties + repairMargin;

    // Step 7: Loss Budget Calculation and System Margin
    const totalLinkLossBudget = systemGain - totalPenalties;
    const totalCableAttenuation = totalFiberLoss + totalConnectorLoss + totalSpliceLoss + totalOtherLoss;
    const systemPerformanceMargin = totalLinkLossBudget - totalCableAttenuation;

    // Display Results
    let resultMessage = '';
    let adviceMessage = '';

    if (systemPerformanceMargin >= 0) {
        resultMessage = `The system performance margin is ${systemPerformanceMargin.toFixed(2)} dB.`;
        adviceMessage = 'The system meets the recommended guidelines.';
    } else {
        resultMessage = `The system performance margin is ${systemPerformanceMargin.toFixed(2)} dB.`;
        adviceMessage = 'The system does NOT meet the recommended guidelines. Please consider adjusting the parameters.';
    }

    document.getElementById('result').textContent = resultMessage;
    document.getElementById('advice').textContent = adviceMessage;
}
