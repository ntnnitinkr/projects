(function() {
    registerPrintButtonHandler();
    
    return;

    function registerPrintButtonHandler() {
        var button = document.getElementById("summary-print-pdf");

        if (!button || button.onclick === onPrintButtonClick) {
            setTimeout(registerPrintButtonHandler, 200);
            return;
        }

        button.onclick = onPrintButtonClick;
    }
    
    function onPrintButtonClick() {
        window.print();
    }
})();

(function() {
    registerPrintButtonHandler();
    
    return;

    function registerPrintButtonHandler() {
        var button = document.getElementById("print-pdf");

        if (!button || button.onclick === onPrintButtonClick) {
            setTimeout(registerPrintButtonHandler, 200);
            return;
        }

        button.onclick = onPrintButtonClick;
    }
    
    function onPrintButtonClick() {
        window.print();
    }
})();

(function() {
    registerPrintButtonHandler();
    
    return;

    function registerPrintButtonHandler() {
        var button = document.getElementById("pred-print-pdf");

        if (!button || button.onclick === onPrintButtonClick) {
            setTimeout(registerPrintButtonHandler, 200);
            return;
        }

        button.onclick = onPrintButtonClick;
    }
    
    function onPrintButtonClick() {
        window.print();
    }
})();