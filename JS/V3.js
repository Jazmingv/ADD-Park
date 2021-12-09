window.onresize = onResizeGeneral;
window.addEventListener('online', (e) => online(e));
window.addEventListener('offline', (e) => offline(e));
var K7hardID = "mbfkojhkmppmojenfoenhnknddgkccdk"; // store id
var K7hardInstaled = false;
var K7hardVersion = "0.0.0";
//if (document.location.host.indexOf('localhost') !== -1) {
//    K7hardID = "hbmfjgggooiihmobniokgpmibklgofpd";  // test id VM5
//}
//else if (document.location.host.indexOf('beta.kwarp7') !== -1) {
//    //K7hardID = "lkoonoagggcjbakmepinmgepjmmmaanb";  // test id Airby
//    K7hardID = "hbmfjgggooiihmobniokgpmibklgofpd";  // test id VM5
//}
var blink;
var BrowserIsIE = false;
var BrowserIsChrome = false;
var BrowserVersion = 0;
var userAgent = BrowserInfo();
var linkedDeviceID = "notSet";
var pantID = "ANY";
var tabID = "notSet";
var AliveSignalInterval;
var AliveSignalMSs = 10 * 60 * 1000;
setClock();
window.onerror = function (msg, url, line, col, error) {
    try {
        closeBusy();
        var extra = !col ? '' : '\ncolumn: ' + col;
        extra += !error ? '' : '\nerror: ' + error;
        try {
            extra += "\nstack: " + error.stack;
        }
        catch { }
        var detail = "Global: " + "\nurl: " + url + "\nline: " + line + extra + "\nbrowser: " + userAgent;
        if (!pantID) {
            pantID = "UNSET";
        }
        if (msg == "Uncaught RangeError: Wrong length!" && line == 2) {
            PageMethods.LogEvent3p(pantID, "Instascan", msg, afterLog, onFailure3g);
        }
        else if (tabID && tabID != "notSet") {
            if (msg == "SyntaxError: Unexpected token ')'" && line == 1) {
                PageMethods.ErrorInJava(pantID, tabID, detail, msg, dummy, onFailure3g);
            }
            else {
                PageMethods.ErrorInJava(pantID, tabID, detail, msg, storeError, onFailure3g);
            }
        }
        else {
            PageMethods.ErrorInJava3(msg, detail, storeError, onFailure3g);
        }
        var suppressErrorAlert = true;
        return suppressErrorAlert;
    }
    catch (error) {
        showMSG("Vuelva a cargar la pagina por favor.");
    }
};
function onFailure3g(error) {
    onFailure3(error);
}
window.addEventListener('DOMContentLoaded', function () {
    tabID = document.getElementById("tabID").value;
    closeBusy();
    if (document.getElementById('HeadSection')) {
        PageMethods.loadMenu(ParamFromURL("PantID"), loadMenuResult, onFailure);
        if (document.getElementById("appPay")) {
            blink = setInterval(function () {
                var appPayStyle = document.getElementById("appPay").style;
                if (appPayStyle.color != "red")
                    clearInterval(blink);
                else if (appPayStyle.opacity == "1")
                    appPayStyle.opacity = "0.1";
                else
                    appPayStyle.opacity = "1";
            }, 500);
        }
    }
    setTimeout(function () {
        CCDinit();
    }, 1000);
    setTimeout(function () {
        PageMethods.NEWS(NEWSresult, onFailure);
    }, 10000);
    AliveSignalInterval = setInterval(function () {
        PageMethods.AliveSignal(pantID, tabID, AliveSignalResponse, AliveSignalFail);
    }, AliveSignalMSs);
});
var NEWS;
function NEWSresult(result) {
    NEWS = (result === 'true');
    Novedades();
}
function Novedades() {
    if (NEWS && !iOS() && Notification) {
        if (Notification.permission !== 'granted') {
            try {
                Notification.requestPermission().then(function (permission) {
                    if (permission == 'granted')
                        Novedades();
                });
            }
            catch { }
        }
        else {
            try {
                var notification = new Notification('Novedades', {
                    icon: '/Images/K7.42.png',
                    body: 'Haga click aqui para ver las novedades',
                });
                notification.onclick = function () {
                    NEWS = false;
                    notification.close();
                    window.open('https://docs.google.com/document/d/e/2PACX-1vQhhxme5YrzNtj8P8oBuNN57vs7rsQNM6znhjwpU6CXRSLNxGq2YeKbQ35YkG4YK4OMkgWQdQkAIPmi/pub?embedded=true');
                    PageMethods.NEWSclick(dummy, onFailure);
                };
            }
            catch {
                // https://stackoverflow.com/questions/29774836/failed-to-construct-notification-illegal-constructor
                PageMethods.LogEvent3p("ANY", "Novedades", userAgent, dummy, onFailureG);
            }
        }
    }
}
var nonStoredError = "";
var DebugMode = false;
var CCDfirstRun = true;
var CCDlastResponseID = "";
var checkCCDInterval;
var DeviceID = "";
var K7link = false;
//declare var K7link: boolean;
function ParamFromURL(name) {
    name = name.toUpperCase().replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href.toUpperCase());
    if (results == null)
        return "";
    else
        return results[1];
}
function ParamFromURL2(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    if (results == null)
        return "";
    else
        return results[1].replace(/%20/g, " ");
}
function onFailureG(error) {
}
function newID() {
    var g = "";
    for (var i = 0; i < 32; i++)
        g += Math.floor(Math.random() * 0xF).toString(0xF) +
            (i == 7 || i == 11 || i == 15 || i == 19 ? "-" : "");
    return g;
}
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(c_name) {
    var c_value = document.cookie;
    var c_start = c_value.indexOf(" " + c_name + "=");
    if (c_start == -1) {
        c_start = c_value.indexOf(c_name + "=");
    }
    if (c_start == -1) {
        c_value = null;
    }
    else {
        c_start = c_value.indexOf("=", c_start) + 1;
        var c_end = c_value.indexOf(";", c_start);
        if (c_end == -1) {
            c_end = c_value.length;
        }
        c_value = decodeURI(c_value.substring(c_start, c_end));
    }
    return c_value;
}
function getBoolCookie(c_name) {
    var value = getCookie(c_name);
    if (value && value.toLowerCase() == "true")
        return 1;
    else
        return 0;
}
function changeLocation(link) {
    var timeOut = 1000;
    if (BrowserIsChrome)
        timeOut = 150;
    setTimeout(function () {
        window.location.href = link;
    }, timeOut);
}
function dummy(result) {
}
var showBusyTimeout;
var closeBusyTimeout;
var clockInterval;
function showBusy() {
    if (closeBusyTimeout)
        clearTimeout(closeBusyTimeout);
    if (showBusyTimeout)
        clearTimeout(showBusyTimeout);
    if (clockInterval)
        clearInterval(clockInterval);
    setClock();
    showBusyTimeout = setTimeout(function () {
        Opaque('opaque3', true);
        document.getElementById('busyMsg').style.display = 'block';
        clockInterval = setInterval(setClock, 1000);
    }, 400);
}
function showBusyNow() {
    if (closeBusyTimeout)
        clearTimeout(closeBusyTimeout);
    if (clockInterval)
        clearInterval(clockInterval);
    clockInterval = setInterval(setClock, 1000);
    setClock();
    Opaque('opaque3', true);
    document.getElementById('busyMsg').style.display = 'block';
}
function isBusy() {
    return document.getElementById('busyMsg').style.display == 'block';
}
function isOpaque() {
    return document.getElementById('opaque').style.display == 'block' ||
        document.getElementById('opaque2').style.display == 'block' ||
        document.getElementById('opaque3').style.display == 'block';
}
function closeBusy(now) {
    var delay = 200;
    if (now)
        delay = 50;
    if (showBusyTimeout)
        clearTimeout(showBusyTimeout);
    if (document.getElementById('busyMsg')) {
        closeBusyTimeout = setTimeout(function () {
            Opaque('opaque3', false);
            document.getElementById('busyMsg').style.display = 'none';
        }, delay);
    }
    if (clockInterval)
        clearInterval(clockInterval);
}
function onResizeGeneral() {
    var mm = 0;
    if (document.getElementById('HeadSection') != undefined &&
        document.getElementById('HeadSection').style.display != "none")
        mm = document.getElementById('HeadSection').offsetHeight;
    if (document.getElementById('body')) {
        var body = document.getElementById('body').offsetHeight;
        if (body < window.innerHeight)
            body = window.innerHeight - 9;
        document.getElementById('opaque').style.height = (body - mm).toString() + "px";
        document.getElementById('opaque2').style.height = (body - mm).toString() + "px";
        document.getElementById('opaque3').style.height = (body - mm).toString() + "px";
    }
}
function Opaque(ID, show) {
    if (document.getElementById(ID)) {
        if (show) {
            onResizeGeneral();
            document.getElementById(ID).style.display = 'block';
        }
        else {
            document.getElementById(ID).style.height = "0px";
            document.getElementById(ID).style.display = 'none';
        }
    }
}
function showQuestion(msg, onClick, focusID) {
    document.getElementById('msgQuestionText').innerHTML = msg;
    if (typeof focusID !== 'undefined')
        document.getElementById('msgQcancel').onclick = function () { closeMsgQuestion(focusID); };
    else
        document.getElementById('msgQcancel').onclick = function () { closeMsgQuestion(); };
    document.getElementById('confirmButton').onclick = onClick;
    Opaque("opaque2", true);
    document.getElementById('msgQuestion').style.display = 'block';
    document.getElementById('confirmButton').focus();
}
function closeMsgQuestion(focusID) {
    Opaque("opaque2", false);
    document.getElementById('msgQuestion').style.display = 'none';
    if (typeof focusID !== 'undefined' && document.getElementById(focusID)) {
        let focusElement = document.getElementById(focusID);
        focusElement.select();
        focusElement.focus();
    }
}
function showActiveMSG(msg, onClick) {
    document.getElementById('msgButton').onclick = onClick;
    showMSG(msg);
}
function showMSG(msg, duration, width) {
    document.getElementById('msgText').innerHTML = msg;
    Opaque("opaque2", true);
    if (width)
        document.getElementById('msgBox').style.width = width;
    else
        document.getElementById('msgBox').style.width = "initial";
    document.getElementById('msgBox').style.display = 'block';
    if (duration) {
        document.getElementById('msgButton').style.display = 'none';
        setTimeout(function () {
            closeMSG();
        }, duration);
    }
    else {
        document.getElementById('msgButton').style.display = 'block';
        document.getElementById('msgButton').focus();
    }
}
function closeMSG() {
    Opaque("opaque2", false);
    document.getElementById('msgBox').style.display = 'none';
}
function accentsTidy(s) {
    var r = s.toLowerCase();
    var non_asciis = {
        'a': '[Ã Ã¡Ã¢Ã£Ã¤Ã¥]',
        'ae': 'Ã¦',
        'c': 'Ã§',
        'e': '[Ã¨Ã©ÃªÃ«]',
        'i': '[Ã¬Ã­Ã®Ã¯]',
        'n': 'Ã±',
        'o': '[Ã²Ã³Ã´ÃµÃ¶]',
        'oe': 'Å“',
        'u': '[Ã¹ÃºÃ»Å±Ã¼]',
        'y': '[Ã½Ã¿]'
    };
    for (var i in non_asciis) {
        r = r.replace(new RegExp(non_asciis[i], 'g'), i);
    }
    return r;
}
function updateParam(uri, key, value) {
    var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    var separator = uri.indexOf('?') !== -1 ? "&" : "?";
    var ret;
    if (uri.match(re)) {
        ret = uri.replace(re, '$1' + key + "=" + value + '$2');
    }
    else {
        ret = uri + separator + key + "=" + value;
    }
    if (value == "") {
        ret = ret.replace("?" + key + "=", "").replace("&" + key + "=", "");
    }
    return ret;
}
function createUUID() {
    // http://www.ietf.org/rfc/rfc4122.txt
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";
    var uuid = s.join("");
    return uuid;
}
function BrowserInfo() {
    try {
        var nVer = navigator.appVersion;
        var nAgt = navigator.userAgent;
        var browserName = navigator.appName;
        var fullVersion = '' + parseFloat(navigator.appVersion);
        var majorVersion = parseInt(navigator.appVersion, 10);
        var nameOffset, verOffset, ix;
        // In Opera 15+, the true version is after "OPR/" 
        if ((verOffset = nAgt.indexOf("OPR/")) != -1) {
            browserName = "Opera";
            fullVersion = nAgt.substring(verOffset + 4);
        }
        // In older Opera, the true version is after "Opera" or after "Version"
        else if ((verOffset = nAgt.indexOf("Opera")) != -1) {
            browserName = "Opera";
            fullVersion = nAgt.substring(verOffset + 6);
            if ((verOffset = nAgt.indexOf("Version")) != -1)
                fullVersion = nAgt.substring(verOffset + 8);
        }
        // In MSIE, the true version is after "MSIE" in userAgent
        else if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
            browserName = "Microsoft Internet Explorer";
            fullVersion = nAgt.substring(verOffset + 5);
            BrowserIsIE = true;
        }
        else if ((verOffset = nAgt.indexOf("Edge")) != -1) {
            browserName = "Edge";
            fullVersion = nAgt.substring(verOffset + 5);
        }
        // In Chrome, the true version is after "Chrome" 
        else if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
            browserName = "Chrome";
            BrowserIsChrome = true;
            fullVersion = nAgt.substring(verOffset + 7);
        }
        // In Safari, the true version is after "Safari" or after "Version" 
        else if ((verOffset = nAgt.indexOf("Safari")) != -1) {
            browserName = "Safari";
            fullVersion = nAgt.substring(verOffset + 7);
            if ((verOffset = nAgt.indexOf("Version")) != -1)
                fullVersion = nAgt.substring(verOffset + 8);
        }
        // In Firefox, the true version is after "Firefox" 
        else if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
            browserName = "Firefox";
            fullVersion = nAgt.substring(verOffset + 8);
        }
        // In most other browsers, "name/version" is at the end of userAgent 
        else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) <
            (verOffset = nAgt.lastIndexOf('/'))) {
            browserName = nAgt.substring(nameOffset, verOffset);
            fullVersion = nAgt.substring(verOffset + 1);
            if (browserName.toLowerCase() == browserName.toUpperCase()) {
                browserName = navigator.appName;
            }
        }
        // trim the fullVersion string at semicolon/space if present
        if ((ix = fullVersion.indexOf(";")) != -1)
            fullVersion = fullVersion.substring(0, ix);
        if ((ix = fullVersion.indexOf(" ")) != -1)
            fullVersion = fullVersion.substring(0, ix);
        majorVersion = parseInt('' + fullVersion, 10);
        if (isNaN(majorVersion)) {
            fullVersion = '' + parseFloat(navigator.appVersion);
            majorVersion = parseInt(navigator.appVersion, 10);
        }
        BrowserVersion = Number(majorVersion);
        return browserName + " " + majorVersion;
    }
    catch (ex) {
        return navigator.userAgent;
    }
}
function popUpBlockMsg() {
    if (BrowserIsChrome)
        showMSG("La creacion de la nueva ventana fue bloqueada por su navegador. <br>" +
            "<a href='https://support.google.com/chrome/answer/95472?hl=es' target='_blank'>" +
            "Haga click aqui para una explicacion de como eliminar este mensaje</a>.");
    else
        showMSG("La creacion de la nueva ventana fue bloqueada por su navegador.");
}
function FromFunction(functionName) {
    return StackTrace().indexOf(functionName) > -1;
}
function StackTrace() {
    var err = new Error();
    return err.stack;
    //var trace = "";
    //st2(arguments.callee.caller)
    //function st2(f) {
    //    if (f) {
    //        trace += f.name + "|";
    //        st2(f.caller);
    //    }
    //}
    //return trace;
}
function AliveSignalFail(error) {
    AliveSignalResponse("Fail");
}
function AliveSignalResponse(result) {
    if (result == "Expired" || result == "Missing" || result == "LogIn" || result == "Fail") {
        if (AliveSignalInterval) {
            clearInterval(AliveSignalInterval);
        }
        if (HeartBeatInterval) {
            clearInterval(HeartBeatInterval);
        }
        if (result == "Missing") {
            showActiveMSG("La sesion fue suspendida en el server.", new Function("ReloadPage()"));
        }
        else if (result == "LogIn") {
            showActiveMSG("Sesion fue suspendida por falta de actividad.", new Function("GoToLogIn()"));
        }
        else if (result == "Fail") {
            showActiveMSG("Se perdio la comunicacion con el server.", new Function("ReloadPage()"));
        }
        else {
            showActiveMSG("Luego de una hora sin actividad la sesion fue suspendida.", new Function("ReloadPage()"));
        }
    }
}
function ReloadPage() {
    closeMSG();
    showBusyNow();
    document.location.reload();
}
function ReloadPage2() {
    showMSG("â€‹â€‹Restableciendo sesiÃ³n inactiva", 5000);
    showBusyNow();
    document.location.reload();
}
function GoToLogIn() {
    closeMSG();
    showBusyNow();
    document.location.href = "/LogIn.aspx";
}
function strZero(num, len) {
    return ("000000000000" + num.toString()).slice(-len);
}
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
function CCDinit() {
    if (typeof chrome !== 'undefined') {
        checkCCDInterval = setInterval(function () {
            try {
                chrome.runtime.sendMessage(K7hardID, { Type: 'CCD' }, function (response) {
                    var lastError = chrome.runtime.lastError;
                    if (lastError && lastError.message.indexOf("Receiving end does not exist") > -1) {
                        K7hardInstaled = false;
                        clearInterval(checkCCDInterval);
                        return;
                    }
                    if (response && response.data != "" && CCDlastResponseID != response.ID) {
                        CCDlastResponseID = response.ID;
                        if (!CCDfirstRun)
                            CCDevent(response.data);
                    }
                    K7hardInstaled = true;
                    CCDfirstRun = false;
                });
            }
            catch (e) {
                if (checkCCDInterval)
                    clearInterval(checkCCDInterval);
                nonStoredError = "CCDinit:" + e.message;
            }
        }, 1000);
    }
}
setTimeout(function () {
    try {
        if (((BrowserIsChrome && BrowserVersion < 90) || BrowserIsIE) && !K7link) {
            document.getElementById("appWarning").style.display = "inline-block";
        }
    }
    catch (e) { }
}, 3000);
function ImportantNotice() {
    if (BrowserIsIE)
        showMSG("Le recomendamos usar KwARP 7 desde " +
            "<a href='https://www.google.com/chrome/browser/' target='_blank'>" +
            "Chrome</a> por motivos de seguridad, velocidad y compatibilidad.");
    else
        showMSG("Tenga a bien actualizar su version de " +
            "<a href='https://www.google.com/chrome/browser/' target='_blank'>" +
            "Chrome</a> por motivos de seguridad, velocidad y compatibilidad.<br /><br />Muchas gracias.");
    document.getElementById("appWarning").style.display = "none";
}
function BugInfo() {
    showMSG("Lo sentimos, ha ocurrido un error. El mismo ya fue notificado para ser analizado.<br /><br />Disculpe las molestias.");
    closeBug();
}
function ShowUserInfo() {
    if (document.getElementById("appUserPanel").style.display != "block") {
        ClosePanels();
        document.getElementById("appUserPanel").style.display = "block";
        event.stopPropagation();
        if (document.getElementById("AltaPorCCD"))
            CCDclose();
    }
}
var loadMenuComplete = false;
var lastSearch = "";
function ShowMenu() {
    if (document.getElementById("appMenuDropDown").style.display != "block") {
        ClosePanels();
        document.getElementById("appMenuDropDown").style.display = "block";
        document.getElementById("filterMenu").focus();
        event.stopPropagation();
    }
    if (document.getElementById("AltaPorCCD"))
        CCDclose();
}
function ClosePanels() {
    if (document.getElementById("appUserPanel"))
        document.getElementById("appUserPanel").style.display = "none";
    if (document.getElementById("appMenuDropDown"))
        document.getElementById("appMenuDropDown").style.display = "none";
    cancelHideSMd();
    hideSM();
    if (document.getElementById("popup") && document.getElementById("popup").style.display != "block")
        $("td").css("outline", "none");
}
function loadMenuResult(result) {
    try {
        if (result == "error:")
            window.location.href = "/Servicios.aspx";
        else if (result == "END:") {
            document.getElementById("classicMenu").innerHTML = "";
            document.getElementById('menuSearch').style.display = "none";
            loadMenuComplete = true;
            closeBusy();
        }
        else {
            closeBusy();
            if (result.length > 10) {
                document.getElementById("recentMenu").innerHTML =
                    result + "<div class='menuSeparator'></div>";
            }
            PageMethods.loadMenuClassic(loadMenuCResult, onFailure);
        }
    }
    catch (error) {
        PageMethods.ErrorInJava2("loadMenuResult", error.message, userAgent, storeError, onFailure);
    }
}
function loadMenuCResult(result) {
    document.getElementById("MenuClassic").innerHTML = result;
    if (document.getElementById("menuClassicL1")) {
        document.getElementById("classicMenu").innerHTML =
            document.getElementById("menuClassicL1").innerHTML +
                "<div class='menuSeparator'></div>";
        document.getElementById("menuClassicL1").innerHTML = "";
    }
    else
        document.getElementById("classicMenu").innerHTML = "";
    PageMethods.loadMenuBasic(loadMenuBResult, onFailure);
}
function loadMenuBResult(result) {
    document.getElementById('fullMenu').innerHTML = result;
    loadMenuComplete = true;
    //doFilterMenu();
}
function onSuccess3(result) { }
function onFailure(error) {
    closeBusy();
}
function onFailure4(error) {
}
function isEven(n) {
    return n % 2 == 0;
}
function isOdd(n) {
    return Math.abs(n % 2) == 1;
}
function menuClasico() {
    if (loadMenuComplete)
        PageMethods.loadMenuC(loadMenuCResult, onFailure);
    else
        showMSG("Menu clasico un no disponible. Reintente en unos segundos.", 3000);
}
function ShowHideOlds() {
    if (document.getElementById("lowUse").style.display == "none") {
        document.getElementById("ShowHideOlds").textContent = "Ver menos opciones";
        document.getElementById("lowUse").style.display = "block";
    }
    else {
        document.getElementById("ShowHideOlds").textContent = "Ver mas opciones";
        document.getElementById("lowUse").style.display = "none";
    }
}
var newTab = false;
function newTabClick(element) {
    newTab = true;
    element.parentElement.click();
    event.stopPropagation();
}
function menuClick(element, count, link, recent) {
    showBusyNow();
    var ID = element.id.replace("rc_", "").replace("cl_", "").replace("win_", "");
    PageMethods.MenuCount(ID, count, document.getElementById("filterMenu").value, newTab, onSuccess3, onFailure);
    if (link.length > 7 && link.substring(0, 7) == "FISCAL:") {
        var proc = link.substring(7);
        if (linkedDeviceID != null && linkedDeviceID.length == 12) {
            PageMethods.ComandoFiscal(linkedDeviceID, proc, onSuccess3, onFailure);
            setTimeout(function () {
                closeBusy();
            }, 8000);
        }
        else if (K7hardInstaled) {
            PageMethods.LogEvent3p(pantID, "FISCAL", proc, onSuccess3, onFailure);
            if (proc == "CF_CierreX")
                CierreX();
            else if (proc == "CF_CierreZ")
                CierreZ();
            else if (proc == "CF_FecHor")
                SetFechaHora();
            else if (proc == "CF_Desblo")
                UnblockFiscal();
            else if (proc == "CF_AvaTkt")
                FeedTicket(2);
            setTimeout(function () {
                closeBusy();
            }, 8000);
        }
        else {
            closeBusy();
            PageMethods.LogEvent3p(pantID, "FISCAL", "Falta instalar K7Hard", afterLog, onFailure);
            showMSG("Para imprimir por controlador fiscal debe tener instalada " +
                "<a href='https://chrome.google.com/webstore/detail/kwarp-7-hardware/mbfkojhkmppmojenfoenhnknddgkccdk' target='_blank'>" +
                "la extension para Chrome de KwARP 7 que le permite acceder al hardware</a>.");
            //PageMethods.LogEvent("FISCAL", "Falta instalar K7Link", onSuccess3, onFailure);
            //showMSG(
            //    "<strong style='font-size: large;'>Para imprimir por controlador fiscal debe tener instalado " +
            //    "<a href='https://docs.google.com/document/d/1dx9wter2a--7C1W9e-nSoWPsTgFpedu-MRPy7DX9jxM/pub?embedded=true' target='_blank'>" +
            //    "el programa K7link</a>.</strong>");
        }
    }
    else if (link == "HELP") {
        closeBusy();
        showHelp2();
    }
    else {
        if (newTab) {
            window.open(link, "_blank");
            closeBusy();
        }
        else
            changeLocation(link);
    }
    newTab = false;
    ClosePanels();
    event.stopPropagation();
}
function doFilterMenu(from) {
    try {
        if (!loadMenuComplete)
            return false;
        //RestoreNewMenu();
        var text = document.getElementById("filterMenu").value;
        if (from == 2) {
            text = document.getElementById("filterMenu2").value;
            document.getElementById("filterMenu").value = text;
        }
        else if (document.getElementById("filterMenu2")) {
            document.getElementById("filterMenu2").value = text;
        }
        if (text != lastSearch) {
            lastSearch = text;
            var divs = document.getElementsByClassName('menuItemK7');
            var menuItemsFound = 0;
            for (var i = 0; i < divs.length; i++) {
                var menuItem = divs[i];
                if (text == "" || accentsTidy(menuItem.innerHTML).indexOf(text.toLowerCase()) > 0) {
                    menuItem.style.display = (menuItem.id.indexOf("win_") == 0) ? "block" : "flex";
                    menuItemsFound++;
                }
                else {
                    menuItem.style.display = "none";
                }
            }
            document.getElementById("filterMenuIndicator").style.display = (menuItemsFound == 0 ? "none" : "flex");
            if (from == 1)
                showFilterMenu();
            else
                history.replaceState(undefined, undefined, updateParam(location.href, "search", text));
        }
    }
    catch (error) {
        PageMethods.ErrorInJava2("doFilterMenu", error.message, userAgent, storeError, onFailure);
    }
}
function hideSM() {
    if (document.getElementById("MenuClassic"))
        document.getElementById("MenuClassic").style.display = "none";
    if (document.getElementById("fullMenu"))
        document.getElementById("fullMenu").style.display = "none";
    if (document.getElementById("fullMenuItem"))
        document.getElementById("fullMenuItem").style.backgroundColor = "";
    if (loadMenuComplete) {
        let CM = document.getElementById("classicMenu");
        for (let i = 0; i < CM.childNodes.length; i++) {
            if (CM.childNodes[i].style)
                CM.childNodes[i].style.backgroundColor = "";
        }
    }
}
var nextShow;
var nextShowDelay = 70;
function cancelHideSMd() {
    if (nextShow) {
        clearTimeout(nextShow);
        nextShow = null;
    }
}
function hideSMd() {
    cancelHideSMd();
    nextShow = setTimeout(function () {
        nextShow = null;
        hideSM();
    }, nextShowDelay);
}
function showSM(element) {
    cancelHideSMd();
    nextShow = setTimeout(function () {
        try {
            nextShow = null;
            hideSM();
            var menuID = element.id.replace("rc_", "").replace("cl_", "");
            var DDstyle = window.getComputedStyle(document.getElementById("appMenuDropDown"));
            var rootMenu = document.getElementById("rootMenu");
            rootMenu.style.top = "calc(" + DDstyle.top + " + 15px)";
            rootMenu.style.left = "calc(" + DDstyle.left + " + " + DDstyle.width + ")";
            document.getElementById("MenuClassic").style.display = "block";
            for (var i = 0; i < rootMenu.childNodes.length; i++) {
                var child = rootMenu.childNodes[i];
                if (menuID.indexOf(child.id) == 0)
                    child.style.display = "block";
                else {
                    child.style.display = "none";
                }
                for (var i2 = 0; i2 < child.childNodes.length; i2++) {
                    var node = child.childNodes[i2];
                    if (menuID.indexOf(node.id.replace("cl_", "")) == 0) {
                        node.style.backgroundColor = "lightgray";
                    }
                    else {
                        node.style.backgroundColor = "";
                    }
                }
            }
            var CM = document.getElementById("classicMenu");
            for (var i = 0; i < CM.childNodes.length; i++) {
                var child = CM.childNodes[i];
                if (child.id) {
                    if (menuID.indexOf(child.id.replace("cl_", "")) == 0) {
                        child.style.backgroundColor = "lightgray";
                    }
                    else {
                        child.style.backgroundColor = "";
                    }
                }
            }
        }
        catch (error) {
            PageMethods.ErrorInJava2("showSM", error.message, userAgent, storeError, onFailure);
        }
    }, nextShowDelay);
    event.stopPropagation();
}
function showFilterMenu() {
    cancelHideSMd();
    nextShow = setTimeout(function () {
        nextShow = null;
        hideSM();
        var div = document.getElementById("fullMenu");
        var DDstyle = window.getComputedStyle(document.getElementById("appMenuDropDown"));
        div.style.top = "calc(" + DDstyle.top + " + 15px)";
        div.style.left = "calc(" + DDstyle.left + " + " + DDstyle.width + ")";
        div.style.display = (document.getElementById("filterMenuIndicator").style.display != "none" ? "block" : "none");
        document.getElementById("fullMenuItem").style.backgroundColor = "lightgray";
        if (div.scrollHeight > div.clientHeight)
            div.style.width = "220px";
        else
            div.style.width = "200px";
    }, nextShowDelay);
    event.stopPropagation();
}
function FiscalNews(response) {
    if (DebugMode && fiscalLog) {
        if (response.DatosEnviados && response.DatosEnviados != sentData) {
            sentData = response.DatosEnviados;
            PageMethods.LogEvent3p(pantID, "FiscalE", sentData, afterLog, onFailure);
        }
        if (response.UltimaRespuesta && response.UltimaRespuesta != ultimaRespuesta) {
            ultimaRespuesta = response.UltimaRespuesta;
            PageMethods.LogEvent3p(pantID, "FiscalR", ultimaRespuesta, afterLog, onFailure);
        }
        if (response.ExtVersion && response.ExtVersion != extVersion) {
            extVersion = response.ExtVersion;
            PageMethods.LogEvent3p(pantID, "FiscalV", extVersion, afterLog, onFailure);
        }
    }
    if (response.UltimoStatus && response.UltimoStatus != ultimoStatus) {
        ultimoStatus = response.UltimoStatus;
        if (fiscalLog) {
            if (DebugMode || (ultimoStatus != "Ok" && ultimoStatus != "Documento fiscal abierto\nDocumento abierto\n")) {
                if (ultimoStatus.indexOf("Desbordamiento de totales") > -1) {
                    fiscalAlert = "Desbordamiento de totales en impresora fiscal";
                }
                else if (ultimoStatus.indexOf("Poca bateria") > -1) {
                    fiscalAlert = "Poca bateria en impresora fiscal";
                }
                else if (ultimoStatus.indexOf("Memoria fiscal casi llena") > -1) {
                    fiscalAlert = "Memoria fiscal casi llena";
                }
                PageMethods.LogEvent3p(pantID, "FiscalS", ultimoStatus, afterLog, onFailure);
            }
        }
    }
    else if (!response.UltimoStatus && (ultimoStatus.indexOf("Ok") == 0 || ultimoStatus.indexOf("Error de conexion") == 0))
        ultimoStatus = "";
    PuntoDeVenta = response.PuntoDeVenta;
    if (response.UltimoComprobante != UltimoComprobante) {
        UltimoComprobante = response.UltimoComprobante;
        if (DebugMode && fiscalLog) {
            PageMethods.LogEvent3p(pantID, "FiscalC", PuntoDeVenta + "-" + UltimoComprobante, afterLog, onFailure);
        }
    }
}
function disablePostBackInMenu(from) {
    var evt = ((event) ? event : window.event);
    var key = (evt.keyCode) ? evt.keyCode : evt.which;
    event.stopPropagation();
    if (key == 13) {
        return false;
    }
    else if (key == 27) {
        ClosePanels();
        return true;
    }
    else {
        doFilterMenu(from);
        return true;
    }
}
function GoToV2() {
    showBusy();
    PageMethods.PreviousVersion(onSuccess3, onFailure);
    window.location.href = window.location.href.replace("ABM3.aspx", "ABM2.aspx");
}
function GoToRenovation() {
    showBusy();
    if (document.getElementById("appPay").title.indexOf("sucursales definidas") > 1) {
        window.location.href = "/ABM3.aspx?PantID=09020100";
    }
    else {
        SID = ParamFromURL("SID");
        if (SID)
            window.location.href = "/Renovacion.aspx?SID=" + SID;
        else
            window.location.href = "/Renovacion.aspx";
    }
}
function GoToUnder(cargo) {
    showBusy();
    window.location.href = "/UnderConstruction.aspx?cargo=" + cargo;
}
function GoToThankYou(cargo) {
    showBusy();
    window.location.href = "/ThankYou.aspx?cargo=" + cargo;
}
if (("standalone" in window.navigator) && window.navigator['standalone']) {
    var noddy, remotes = false;
    document.addEventListener('click', function (event) {
        noddy = event.target;
        while (noddy.nodeName !== "A" && noddy.nodeName !== "HTML") {
            noddy = noddy.parentNode;
        }
        if ('href' in noddy && noddy.href.indexOf('http') !== -1 && (noddy.href.indexOf(document.location.host) !== -1 || remotes)) {
            event.preventDefault();
            document.location.href = noddy.href;
        }
    }, false);
}
function GoHome() {
    showBusy();
    try {
        GoHomeSpecific();
    }
    catch { }
    window.location.href = document.location.origin;
}
function showHelp2() {
    var helpID = document.getElementById('helpID').value;
    if (helpID.indexOf("spreadsheets/") == 0) {
        window.open("https://docs.google.com/" + helpID, "_blank");
    }
    else if (helpID.indexOf("/edit") > 10) {
        window.open("https://docs.google.com/document/d/" + helpID.replace("/edit", ""), "_blank");
    }
    else if (helpID.indexOf("u/2/d/e/") == 0) {
        showHelp("https://docs.google.com/document/" + helpID + "/pub?embedded=true");
    }
    else {
        showHelp("https://docs.google.com/document/d/" + helpID + "/pub?embedded=true");
    }
}
function clickOnLink(link) {
    link = link.replace("embedded%3Dtrue", "embedded=true");
    if (link.indexOf("&sa=D&") > 10)
        link = link.substring(0, link.indexOf("&sa=D&"));
    if (link.indexOf("https://docs.google.com/") == 0) {
        if (link.indexOf("/pub") > 10 && link.indexOf("/pub?") == -1 &&
            link.indexOf("embedded=true") == -1)
            link = link.replace("/pub", "/pub?embedded=true");
        showHelp(link);
    }
    else {
        link = link.split("%26").join("&");
        link = link.split("%3D").join("=");
        link = link.replace("SID=0", "SID=" + SID);
        link = link.replace("add.kwarp7.com", window.location.host);
        link = link.replace("add.kwarp7.net", window.location.host);
        window.open(link, "_blank");
        PageMethods.LogEvent3p(document.getElementById('pantID').value, "showHelpE", link, dummy, onFailureG);
    }
}
function showHelp(link) {
    document.getElementById('helpFrame').innerHTML = "";
    document.getElementById("helpWin").style.backgroundImage =
        "url('/Images/loading_transparent.gif')";
    $.get(link, function (data) {
        //$('#helpFrame').html(data);
        //var help = document.getElementById('helpFrame').innerHTML;
        //help = help.split("https://www.google.com/url?q=").join("");
        //help = help.split("href=\"http").join("onclick='event.preventDefault(); clickOnLink(this.href)' href=\"http");
        //document.getElementById('helpFrame').innerHTML = help;
        data = data.split("https://www.google.com/url?q=").join("");
        data = data.split("href=\"http").join("onclick='event.preventDefault(); clickOnLink(this.href)' href=\"http");
        if (data.indexOf("searchParams.delete('embedded')") > 2) {
            document.getElementById('helpFrame').style.padding = 'unset';
            data = "<!DOCTYPE html>" + data.substring(data.indexOf("</head>") + 7);
        }
        else
            document.getElementById('helpFrame').style.padding = '';
        document.getElementById('helpFrame').innerHTML = data;
        document.getElementById("helpWin").scrollTop = 0;
        document.getElementById("helpWin").style.backgroundImage = "none";
        document.getElementById('helpWin').style.backgroundColor = "white";
        Opaque('opaque3', true);
    });
    //document.getElementById("helpFrame").src = link;
    document.getElementById("helpWin").style.display = "block";
    PageMethods.LogEvent3p(document.getElementById('pantID').value, "showHelp", link, dummy, onFailureG);
}
function closeHelp() {
    document.getElementById("helpWin").style.display = "none";
    Opaque('opaque3', false);
}
function BodyKeyUp() {
    if (event instanceof KeyboardEvent && event.which == 27) {
        ClosePanels();
    }
    return true;
}
function MSGkeyUp() {
    if (event instanceof KeyboardEvent && event.which == 27) {
        closeMSG();
        event.stopPropagation();
    }
    return true;
}
function MSGQkeyUp(e) {
    if (e.which == 27) {
        closeMsgQuestion();
    }
}
function Beep() {
    try {
        var snd = new Audio("data:audio/wav;base64," +
            "//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgAI0wWs/ItAAAGDgYtAgAyN+QWaAAihwMWm4G8QQRDiMcCBcH3Cc+CDv/7xA4Tvh9Rz/" +
            "y8QADBwMWgQAZG/ILNAARQ4GLTcDeIIIhxGOBAuD7hOfBB3/94gcJ3w+o5/5eIAIAAAVwWgQAVQ2ORaIQwEMAJiDg95G4nQL7mQVWI6G" +
            "wRcfsZAcsKkJvxgxEjzFUgfHoSQ9Qq7KNwqHwuB13MA4a1q/DmBrHgPcmjiGoh//EwC5nGPEmS4RcfkVKOhJf+WOgoxJclFz3kgn//dB" +
            "A+ya1GhurNn8zb//9NNutNuhz31f////9vt///z+IdAEAAAK4LQIAKobHItEIYCGAExBwe8jcToF9zIKrEdDYIuP2MgOWFSE34wYiR5i" +
            "qQPj0JIeoVdlG4VD4XA67mAcNa1fhzA1jwHuTRxDUQ//iYBczjHiTJcIuPyKlHQkv/LHQUYkuSi57yQT//uggfZNajQ3Vmz+Zt//+mm3" +
            "Wm3Q576v////+32///5/EOgAAADVghQAAAAA//uQZAUAB1WI0PZugAAAAAoQwAAAEk3nRd2qAAAAACiDgAAAAAAABCqEEQRLCgwpBGMl" +
            "JkIz8jKhGvj4k6jzRnqasNKIeoh5gI7BJaC1A1AoNBjJgbyApVS4IDlZgDU5WUAxEKDNmmALHzZp0Fkz1FMTmGFl1FMEyodIavcCAUHD" +
            "WrKAIA4aa2oCgILEBupZgHvAhEBcZ6joQBxS76AgccrFlczBvKLC0QI2cBoCFvfTDAo7eoOQInqDPBtvrDEZBNYN5xwNwxQRfw8ZQ5wQ" +
            "VLvO8OYU+mHvFLlDh05Mdg7BT6YrRPpCBznMB2r//xKJjyyOh+cImr2/4doscwD6neZjuZR4AgAABYAAAABy1xcdQtxYBYYZdifkUDgz" +
            "zXaXn98Z0oi9ILU5mBjFANmRwlVJ3/6jYDAmxaiDG3/6xjQQCCKkRb/6kg/wW+kSJ5//rLobkLSiKmqP/0ikJuDaSaSf/6JiLYLEYnW/" +
            "+kXg1WRVJL/9EmQ1YZIsv/6Qzwy5qk7/+tEU0nkls3/zIUMPKNX/6yZLf+kFgAfgGyLFAUwY//uQZAUABcd5UiNPVXAAAApAAAAAE0VZ" +
            "QKw9ISAAACgAAAAAVQIygIElVrFkBS+Jhi+EAuu+lKAkYUEIsmEAEoMeDmCETMvfSHTGkF5RWH7kz/ESHWPAq/kcCRhqBtMdokPdM7vi" +
            "l7RG98A2sc7zO6ZvTdM7pmOUAZTnJW+NXxqmd41dqJ6mLTXxrPpnV8avaIf5SvL7pndPvPpndJR9Kuu8fePvuiuhorgWjp7Mf/PRjxcF" +
            "CPDkW31srioCExivv9lcwKEaHsf/7ow2Fl1T/9RkXgEhYElAoCLFtMArxwivDJJ+bR1HTKJdlEoTELCIqgEwVGSQ+hIm0NbK8WXcTEI0" +
            "UPoa2NbG4y2K00JEWbZavJXkYaqo9CRHS55FcZTjKEk3NKoCYUnSQ0rWxrZbFKbKIhOKPZe1cJKzZSaQrIyULHDZmV5K4xySsDRKWOru" +
            "anGtjLJXFEmwaIbDLX0hIPBUQPVFVkQkDoUNfSoDgQGKPekoxeGzA4DUvnn4bxzcZrtJyipKfPNy5w+9lnXwgqsiyHNeSVpemw4bWb9p" +
            "sYeq//uQZBoABQt4yMVxYAIAAAkQoAAAHvYpL5m6AAgAACXDAAAAD59jblTirQe9upFsmZbpMudy7Lz1X1DYsxOOSWpfPqNX2WqktK0D" +
            "MvuGwlbNj44TleLPQ+Gsfb+GOWOKJoIrWb3cIMeeON6lz2umTqMXV8Mj30yWPpjoSa9ujK8SyeJP5y5mOW1D6hvLepeveEAEDo0mgCRC" +
            "lOEgANv3B9a6fikgUSu/DmAMATrGx7nng5p5iimPNZsfQLYB2sDLIkzRKZOHGAaUyDcpFBSLG9MCQALgAIgQs2YunOszLSAyQYPVC2Yd" +
            "GGeHD2dTdJk1pAHGAWDjnkcLKFymS3RQZTInzySoBwMG0QueC3gMsCEYxUqlrcxK6k1LQQcsmyYeQPdC2YfuGPASCBkcVMQQqpVJshui" +
            "1tkXQJQV0OXGAZMXSOEEBRirXbVRQW7ugq7IM7rPWSZyDlM3IuNEkxzCOJ0ny2ThNkyRai1b6ev//3dzNGzNb//4uAvHT5sURcZCFcuK" +
            "LhOFs8mLAAEAt4UWAAIABAAAAAB4qbHo0tIjVkUU//uQZAwABfSFz3ZqQAAAAAngwAAAE1HjMp2qAAAAACZDgAAAD5UkTE1UgZEUExqY" +
            "ynN1qZvqIOREEFmBcJQkwdxiFtw0qEOkGYfRDifBui9MQg4QAHAqWtAWHoCxu1Yf4VfWLPIM2mHDFsbQEVGwyqQoQcwnfHeIkNt9Ynki" +
            "aS1oizycqJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDo" +
            "ADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sx" +
            "EhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAA" +
            "BoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAA" +
            "F5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9" +
            "q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqX" +
            "StV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNp" +
            "uJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qp" +
            "oiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt" +
            "/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYW" +
            "FRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////" +
            "////////////////////////////////////////////////////////////////////////////////////////////////////////" +
            "////////////////////////////////////////////////////////////////////////////////////////////////////////" +
            "////////////////////////////////////////////////////////////////////////////////////////////////////////" +
            "////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUA" +
            "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
        snd.play();
    }
    catch (ex) {
    }
}
function iOS() {
    return [
        'iPad Simulator',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad',
        'iPhone',
        'iPod'
    ].includes(navigator.platform)
        // iPad on iOS 13 detection
        || (navigator.userAgent.includes("Mac") && "ontouchend" in document);
}
function AndroidVersion() {
    try {
        var ua = navigator.userAgent;
        if (ua.indexOf("Android") >= 0) {
            return parseFloat(ua.slice(ua.indexOf("Android") + 8));
        }
    }
    catch { }
    return -1;
}
function GoToMenu() {
    showBusy();
    PageMethods.MenuRedirect(gotoMenuResponse, onFailure);
}
function gotoMenuResponse(result) {
    if (result == "local") {
        closeBusy();
        ShowMenu();
    }
    else
        window.location.href = result;
}
function setClock() {
    try {
        if (document.getElementById("clockFace")) {
            const now = new Date();
            const seconds = now.getSeconds();
            const secondsDegrees = ((seconds / 60) * 360) + 90;
            document.getElementById("secondHand").style.transform = `rotate(${secondsDegrees}deg)`;
            const mins = now.getMinutes();
            const minsDegrees = ((mins / 60) * 360) + ((seconds / 60) * 6) + 90;
            document.getElementById("minuteHand").style.transform = `rotate(${minsDegrees}deg)`;
            const hour = now.getHours();
            const hourDegrees = ((hour / 12) * 360) + ((mins / 60) * 30) + 90;
            document.getElementById("hourHand").style.transform = `rotate(${hourDegrees}deg)`;
            document.getElementById("busyMsg").style.backgroundImage = "none";
            document.getElementById("clockFace").style.display = "block";
        }
        else
            setTimeout(function () { setClock(); }, 200);
    }
    catch { }
}
var offlineStart;
function online(e) {
    if (offlineStart) {
        document.getElementById('netErr').style.display = 'none';
        showBusyNow();
        var endTime = performance.now();
        var timeDiff = endTime - offlineStart; //in ms
        var log = timeDiff.toFixed() + "ms";
        if (timeDiff > 1000) {
            timeDiff /= 1000; // in s
            log = timeDiff.toFixed() + "s";
        }
        if (timeDiff > 60) {
            timeDiff /= 60; // in m
            log = timeDiff.toFixed() + "m";
        }
        PageMethods.LogEvent3p(pantID, "InetOff", log, ReloadPage, onFailure);
    }
    offlineStart = null;
}
function offline(e) {
    offlineStart = performance.now();
    Opaque('opaque3', true);
    document.getElementById('netErr').style.display = 'inline-block';
}
function NonBasicResponse(response) {
    if (response.indexOf("ERR:") == 0) {
        closeBusy();
        response = response.replace("ERR:", "");
        if (response.length > 3)
            showMSG(response);
        return false;
    }
    else if (response.indexOf("MSG:") == 0) {
        closeBusy();
        response = response.replace("MSG:", "");
        if (response.length > 3)
            showMSG(response);
        return false;
    }
    else
        return true;
}
function Defaults() {
    PageMethods.Defaults(pantID, onDefaultResponse, onFailure);
}
function updateAmbiente(select) {
    PageMethods.updateAmbiente(pantID, select.id, select.value, onDefaultResponse, onFailure);
}
function onDefaultResponse(result) {
    showMSG(result);
}
//# sourceMappingURL=V3.js.map