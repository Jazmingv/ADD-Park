var UltimoComprobante = "";
var checkFiscalInterval;
//window.addEventListener('DOMContentLoaded', function () {
//    setTimeout(function () {
//        StartCheckingFiscal();
//    }, 1000);
//});
function StartCheckingFiscal(responseFunction) {
    StopCheckingFiscal();
    if (typeof chrome !== "undefined") {
        checkFiscalInterval = setInterval(function () {
            try {
                chrome.runtime.sendMessage(K7hardID, { Type: 'Fiscal', Comando: 'GetNews' }, null, function (response) {
                    var lastError = chrome.runtime.lastError;
                    if (lastError && lastError.message.indexOf("Receiving end does not exist") > -1) {
                        StopCheckingFiscal();
                        K7hardInstaled = false;
                        return;
                    }
                    else {
                        K7hardInstaled = true;
                        if (response.data != "") {
                            if (responseFunction == "K7HardNews")
                                K7HardNews(response);
                            else
                                FiscalNews(response);
                            if (response.ExtVersion)
                                K7hardVersion = response.ExtVersion;
                        }
                    }
                });
            }
            catch (e) {
                StopCheckingFiscal();
                nonStoredError = "StartCheckingFiscal:" + e.message;
                Beep();
            }
        }, 300);
    }
}
function StopCheckingFiscal() {
    if (checkFiscalInterval)
        clearInterval(checkFiscalInterval);
}
function SendCommand(cmd) {
    if (K7hardInstaled) {
        try {
            chrome.runtime.sendMessage(K7hardID, cmd, null, function (response) {
                var lastError = chrome.runtime.lastError;
                if (lastError && lastError.message.indexOf("Receiving end does not exist") > -1) {
                    K7hardInstaled = false;
                    return;
                }
            });
        }
        catch {
            K7hardInstaled = false;
        }
    }
    //else
    //    FiscalCommand(cmd);
}
function FeedTicket(lines) {
    SendCommand({ Type: 'Fiscal', Comando: 'FeedTicket', Lines: lines });
}
function OpenNoFiscal() {
    SendCommand({ Type: 'Fiscal', Comando: 'AbrirDNF' });
}
function SendNoFiscalText(text) {
    SendCommand({ Type: 'Fiscal', Comando: 'LineaDeTextoDNF', Texto: text });
}
function CloseNoFiscal() {
    SendCommand({ Type: 'Fiscal', Comando: 'CerrarDNF' });
}
function OpenDNFH(letra, tipoDeResponsable, razonSocial, tipoDeDocumento, numeroDeDocumento, embarkNumber) {
    SendCommand({
        Type: 'Fiscal', Comando: 'AbrirDNFH',
        Letra: letra || 'X',
        TipoDeResponsable: tipoDeResponsable || 'F',
        RazonSocial: razonSocial || 'Test S.R.L.',
        TipoDeDocumento: tipoDeDocumento || '96',
        NumeroDeDocumento: numeroDeDocumento || '123456789',
        EmbarkNumber: embarkNumber || 'N/A'
    });
}
function PrintDNFHitem(descripcion, cantidad) {
    SendCommand({ Type: 'Fiscal', Comando: 'DNFHitem', Descripcion: descripcion, Cantidad: cantidad });
}
function PrintReceiptText(text) {
    SendCommand({ Type: 'Fiscal', Comando: 'ReceiptText', Texto: text });
}
function CloseDNFH() {
    SendCommand({ Type: 'Fiscal', Comando: 'CerrarDNFH' });
}
function SetEmbarkNumber(text) {
    SendCommand({ Type: 'Fiscal', Comando: 'SetEmbarkNumber', Texto: text });
}
function OpenFiscal(letra, tipoDeResponsable, razonSocial, tipoDeDocumento, numeroDeDocumento, domicilio) {
    SendCommand({
        Type: 'Fiscal', Comando: 'AbrirDF',
        Letra: letra || 'X',
        TipoDeResponsable: tipoDeResponsable || 'F',
        RazonSocial: razonSocial || 'Test S.R.L.',
        TipoDeDocumento: tipoDeDocumento || '96',
        NumeroDeDocumento: numeroDeDocumento || '123456789',
        Domicilio: domicilio || 'n/a'
    });
}
function SendFiscalText(text) {
    SendCommand({ Type: 'Fiscal', Comando: 'LineaDeTextoDF', Texto: text });
}
function SendFiscalItem(text, cantid, precio, IVA) {
    SendCommand({ Type: 'Fiscal', Comando: 'ItemFiscal', Texto: text, Cantidad: cantid, Precio: precio, IVA: IVA });
}
function ReturnRecharge(text, monto, IVA) {
    SendCommand({ Type: 'Fiscal', Comando: 'ReturnRecharge', Texto: text, Monto: monto, IVA: IVA });
}
function DescuentoGlobal(texto, monto) {
    SendCommand({ Type: 'Fiscal', Comando: 'DescuentoGlobal', Texto: texto, Monto: monto });
}
function SubtotalFiscal() {
    SendCommand({ Type: 'Fiscal', Comando: 'SubtotalDF' });
}
function CloseFiscal() {
    SendCommand({ Type: 'Fiscal', Comando: 'CerrarDF' });
}
function UnblockFiscal() {
    SendCommand({ Type: 'Fiscal', Comando: 'ClosePort' });
    SendFiscalItem("Item de desbloqueo", 1, 0.1, 0);
    CloseFiscal();
    PrintDNFHitem("Item de desbloqueo", 1);
    CloseDNFH();
    OpenNoFiscal();
    SendNoFiscalText("Desbloqueo exitoso");
    CloseNoFiscal();
    StartCheckingFiscal();
}
function SetFechaHora() {
    SendCommand({ Type: 'Fiscal', Comando: 'SetFechaHora' });
}
function SetHeaderTrailer(linea, texto) {
    SendCommand({ Type: 'Fiscal', Comando: 'SetHeaderTrailer', Linea: linea, Texto: texto });
}
function GetPrinterInfo() {
    SendCommand({ Type: 'Fiscal', Comando: 'GetPrinterInfo' });
}
function GetFantasyName() {
    SendCommand({ Type: 'Fiscal', Comando: 'GetFantasyName', Linea: '1' });
}
function CutPaper() {
    SendCommand({ Type: 'Fiscal', Comando: 'CortarElPapel' });
}
function CierreX() {
    SendCommand({ Type: 'Fiscal', Comando: 'CierreX' });
}
function CierreZ() {
    SendCommand({ Type: 'Fiscal', Comando: 'CierreZ' });
}
function PrintFromString(printData) {
    var checkForNumber = false;
    var DNFH = false;
    GetPrinterInfo();
    var lines = printData.split("/json/");
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        if (line.indexOf("OpenFiscal:") == 0) {
            var params = line.replace("OpenFiscal:", "").split("|");
            if (params[0] == "S" || params[0] == "R") {
                OpenDNFH(params[0], params[1], params[2], params[3], params[4], "Nota de credito");
                DNFH = true;
            }
            else
                OpenFiscal(params[0], params[1], params[2], params[3], params[4], params[5]);
        }
        else if (line.indexOf("SendFiscalText:") == 0) {
            var param = line.replace("SendFiscalText:", "");
            SendFiscalText(param);
        }
        else if (line.indexOf("SendFiscalItem:") == 0) {
            var params = line.replace("SendFiscalItem:", "").split("|");
            SendFiscalItem(params[0], Number(params[1]), Number(params[2]), Number(params[3]));
        }
        else if (line.indexOf("ReturnRecharge:") == 0) {
            var params = line.replace("ReturnRecharge:", "").split("|");
            ReturnRecharge(params[0], Number(params[1]), Number(params[2]));
        }
        else if (line.indexOf("DescuentoGlobal:") == 0) {
            var params = line.replace("DescuentoGlobal:", "").split("|");
            DescuentoGlobal(params[0], Number(params[1]));
        }
        else if (line.indexOf("SetHeaderTrailer:") == 0) {
            var params = line.replace("SetHeaderTrailer:", "").split("|");
            SetHeaderTrailer(params[0], params[1]);
        }
        else if (line.indexOf("CloseFiscal:") == 0) {
            checkForNumber = true;
            if (DNFH)
                CloseDNFH();
            else
                CloseFiscal();
        }
        else if (line.indexOf("SubtotalFiscal:") == 0) {
            SubtotalFiscal();
        }
        else if (line.indexOf("OpenNoFiscal:") == 0) {
            OpenNoFiscal();
        }
        else if (line.indexOf("SendNoFiscalText:") == 0) {
            var param = line.replace("SendNoFiscalText:", "");
            SendNoFiscalText(param);
        }
        else if (line.indexOf("CloseNoFiscal:") == 0) {
            CloseNoFiscal();
        }
    }
    return checkForNumber;
}
//# sourceMappingURL=Fiscal.js.map