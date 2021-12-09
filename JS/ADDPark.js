window.addEventListener('DOMContentLoaded', function () {
    showBusyNow();
    tabID = document.getElementById("tabID").value;
    PageMethods.StartTab(tabID, startTab, onFailure4);
});
function startTab(response) {
    let json = JSON.parse(response);
    if (NonBasicResponse(json.Response)) {
        document.getElementById("Tarifa").innerHTML = json.TarifasButtons;
        document.getElementById("TarifaEntrada").innerHTML = json.TarifasOptions;
        document.getElementById("EntradaSalida").innerHTML = json.BarrerasOptions;
        document.getElementById("MotivoBarrera").innerHTML = json.MotivosOptions;
        PageMethods.CheckCaja(tabID, CheckCaja, onFailure4);
    }
}
function CheckCaja(response) {
    if (NonBasicResponse(response)) {
        $("#Ticket").off();
        $("#Ingreso").off();
        if (response == "isOpen:") {
            document.getElementById("Varios").style.display = "none";
            document.getElementById("OpenCaja").style.display = "none";
            document.getElementById("Cobro").style.display = "block";
            $("#Ticket").on('keyup', function (e) {
                if (e.key === 'Enter' || e.keyCode === 13) {
                    TicketChange();
                }
            });
            $("#Ingreso").on('keyup', function (e) {
                if (e.key === 'Enter' || e.keyCode === 13) {
                    TicketChange();
                }
            });
        }
        else {
            ShowVarios();
            document.getElementById("Recuento").style.display = response == "NormalUser:" ? "none" : "block";
            document.getElementById("NCxTicket").style.display = response == "NormalUser:" ? "none" : "block";
        }
        closeBusy();
    }
}
function ShowVarios() {
    document.getElementById("Cobro").style.display = "none";
    document.getElementById("OpenCaja").style.display = "block";
    document.getElementById("Varios").style.display = "block";
}
function APWIP(element) {
    PageMethods.APWIP(element.innerHTML, dummy, onFailure4);
    showMSG("Funcionalidad en construccion.<br><br>Su interes ha sido registrado.");
}
function ShowPopUp(fieldsetID, width) {
    Opaque("opaque", true);
    $("#PopUps").find("fieldset").each(function () {
        this.style.display = "none";
        ;
    });
    document.getElementById("PopUps").style.width = width;
    document.getElementById("PopUps").style.display = "block";
    document.getElementById(fieldsetID).style.display = "block";
}
function ClosePopUp() {
    document.getElementById("PopUps").style.display = "none";
    Opaque("opaque", false);
}
function ShowOpenCaja() {
    showBusy();
    PageMethods.CheckCaja(tabID, ShowOpenCaja2, onFailure4);
}
function ShowOpenCaja2(response) {
    CheckCaja(response);
    if (document.getElementById("Cobro").style.display != "block") {
        $('label[for="ImporteFondos"]').text("Fondos recibidos");
        document.getElementById("PopUpConfirm").onclick = OpenCaja;
        ShowPopUp("Fondos", "220px");
        var fondos = document.getElementById("ImporteFondos");
        fondos.value = "0";
        fondos.select();
        fondos.focus();
    }
}
function OpenCaja() {
    let importe = Number(document.getElementById("ImporteFondos").value);
    if (importe > 0) {
        OpenCajaConfirm();
    }
    else {
        showQuestion("Â¿Confirma que NO ha recibido fondos?", new Function("OpenCajaConfirm()"), "ImporteFondos");
    }
}
function OpenCajaConfirm() {
    closeMsgQuestion();
    showBusy();
    let importe = Number(document.getElementById("ImporteFondos").value);
    PageMethods.OpenCaja(tabID, importe, CheckCaja, onFailure4);
    ClosePopUp();
}
function ShowCloseCaja() {
    $('label[for="ImporteFondos"]').text("Fondos entregados");
    document.getElementById("PopUpConfirm").onclick = CloseCaja;
    ShowPopUp("Fondos", "220px");
    var fondos = document.getElementById("ImporteFondos");
    fondos.value = "0";
    fondos.select();
    fondos.focus();
}
function CloseCaja() {
    let importe = Number(document.getElementById("ImporteFondos").value);
    if (importe > 0) {
        CloseCajaConfirm();
    }
    else {
        showQuestion("Â¿Confirma que NO entrega fondos?", new Function("CloseCajaConfirm()"), "ImporteFondos");
    }
}
function CloseCajaConfirm() {
    closeMsgQuestion();
    let importe = Number(document.getElementById("ImporteFondos").value);
    PageMethods.CloseCaja(tabID, importe, CheckCaja, onFailure4);
    ClosePopUp();
}
var TicketChangeTimeout;
function TicketChange() {
    if (TicketChangeTimeout)
        clearTimeout(TicketChangeTimeout);
    TicketChangeTimeout = setTimeout(function () {
        let TipOpe = $('input[type="radio"]:checked', '#Operacion').val();
        let ticket = document.getElementById("Ticket").value.trim();
        if (ticket.length == 10 || TipOpe == "no00") {
            showBusyNow();
            let Tarifa = $('input[type="radio"]:checked', '#Tarifa').val();
            let ingreso = document.getElementById("Ingreso").value;
            PageMethods.GetTicketInfo(tabID, TipOpe, Tarifa, ticket, ingreso, TicketInfo, onFailure4);
        }
    }, 400);
}
function TicketInfo(response) {
    let json = JSON.parse(response);
    closeBusy();
    if (json.Status == "Message") {
        ResetOperacion();
        showMSG(json.Message);
    }
    else {
        document.getElementById("Ingreso").value = json.Info.Ingreso;
        document.getElementById("Limite").value = json.Info.Limite;
        document.getElementById("Importe").value = json.Info.Importe.toFixed(2);
        document.getElementById("APagar").value = json.Info.APagar.toFixed(2);
        document.getElementById("Permanencia").value = json.Info.Permanencia;
        // check Tarifa and change in UI if necessary
        document.getElementById("Medio").disabled = !json.ShowPago;
        if (json.Message)
            showMSG(json.Message);
    }
}
function Efectivo() {
    showBusy();
    document.getElementById("Medio").disabled = true;
    PageMethods.Efectivo(tabID, Number(document.getElementById("APagar").value), PostPay, onFailure4);
}
function PostPay(response) {
    closeBusy();
}
function ShowTicketEntrada() {
    $("#TarifaEntrada").find('option:eq(0)').prop('selected', true);
    document.getElementById("PopUpConfirm").onclick = TicketEntrada;
    ShowPopUp("TicketEntrada", "220px");
}
function TicketEntrada() {
    let patente = document.getElementById("PatenteEntrada").value.trim();
    if (patente.length < 6) {
        showMSG("Debe ingresar una pantente valida");
    }
    else {
        showBusy();
        ClosePopUp();
        let tarifa = document.getElementById("TarifaEntrada").value;
        PageMethods.TicketEntrada(tabID, tarifa, patente, PostTicketEntrada, onFailure4);
    }
}
function PostTicketEntrada(response) {
    if (NonBasicResponse(response)) {
        closeBusy();
        showMSG("Funcionalidad en construccion.");
    }
}
function ShowBarreras() {
    document.getElementById("SubirBarrera").checked = true;
    document.getElementById("BarreraObs").value = "";
    document.getElementById("PopUpConfirm").onclick = Barreras;
    ShowPopUp("Barreras", "380px");
}
function Barreras() {
    PageMethods.Barreras(tabID, document.getElementById("EntradaSalida").value, document.getElementById("SubirBarrera").checked, document.getElementById("MotivoBarrera").value, document.getElementById("BarreraObs").value, dummy, onFailure4);
    ClosePopUp();
}
function ResetOperacion() {
    document.getElementById("Ticket").value = "";
    document.getElementById("Ingreso").value = "";
    document.getElementById("Limite").value = "";
    document.getElementById("Importe").value = "";
    document.getElementById("APagar").value = "";
    document.getElementById("Permanencia").value = "";
    document.getElementById("Medio").disabled = true;
    let TipOpe = $('input[type="radio"]:checked', '#Operacion').val();
    if (TipOpe == "no00") {
        document.getElementById("Ticket").value = "99";
        document.getElementById("Ticket").readOnly = true;
        let d = new Date();
        d.setDate(d.getDate() - 1);
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        let ingreso = document.getElementById("Ingreso");
        ingreso.value = d.toISOString().slice(0, 16);
        ingreso.readOnly = false;
        ingreso.focus();
    }
    else {
        document.getElementById("Ticket").readOnly = false;
        document.getElementById("Ingreso").readOnly = true;
    }
}
//# sourceMappingURL=ADDPark.js.map