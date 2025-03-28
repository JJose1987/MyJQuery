// Remplazar de la posicion 0 al index por lo indicado
String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}
// Cuanta es el porcentaje de parecido de una palabra con otra
String.prototype.levenshtein = function(compared) {
    var distance = [];

    for (var i0 = 0; i0 <= this.length; i0++) {
        distance[i0] = [];
        distance[i0][0] = i0;
    }

    for (var i0 = 0; i0 <= compared.length; i0++) {
        distance[0][i0] = i0;
    }

    for (var i0 = 1; i0 <= this.length; i0++) {
        for (var i1 = 1; i1 <= compared.length; i1++) {
            distance[i0][i1] = Math.min(distance[i0 - 1][i1 - 0] + 1,
                                        distance[i0 - 0][i1 - 1] + 1,
                                        distance[i0 - 1][i1 - 1] + ((this[i0 - 1] == compared[i1 - 1])? 0 : 1));
        }
    }

    return 100 - ((distance[this.length][compared.length] * this.length) / 100);
}
// Primera letra en mayúscula
String.prototype.capitalize = function() {
    return this.substr(0, 1).toUpperCase() + this.substr(1).toLowerCase();
}
// Repetir Cadena de texto las veces que le indicamos
String.prototype.repeat = function(times) {
    var out = this;

    for (var i = 0; i < (times - 1); i++) {
        out += this;
    }

    return out;
}
// Encriptar o Descriptar un texto pasandole un clave
String.prototype.xorCipher = function(key = ' ', des = false) {
    var blockSize = 256;
    var out = (this + (' ').repeat(blockSize)).substring(0, blockSize);
    var keygen = (key.repeat(parseInt(blockSize / key.length))).substring(0, blockSize);

    return Array.from(out)
        .map((char, i) =>
            String.fromCharCode(char.charCodeAt(0) + (des ? -1 : 1) * keygen.charCodeAt(i))
        )
        .join('');
}
// Generar una imagen con el QR del texto pasado
String.prototype.textQR = function(ctx = null, x = 0, y = 0, wh = 256) {
    if (ctx != null) {
        var img = new Image();
        img.onload = function() {
            ctx.drawImage(img, x, y);
        }
        img.src = (new QRious({value: this,size: wh})).toDataURL();

        return img;
    }

    return null;
}

// A traves de un imagen QR se genera un texto
Image.prototype.QRtext = function() {
    try {
        var iCnv = document.createElement('canvas');
        var iCtx = iCnv.getContext('2d');

        iCnv.width  = this.width;
        iCnv.height = this.height;

        iCtx.drawImage(this, 0, 0);

        var iData = iCtx.getImageData(0, 0, this.width, this.height);
        var code  = jsQR(iData.data, this.width, this.height);

        if (code) {
            return code.data;
        }
    } catch(e) {
        return 'error : ' + e.message;
    }
}


// Convertir Hexagemial a RGB
function hexToRgb(hex) {
    hex = hex.replace('#', '');
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r: r, g: g, b: b };
}

// Convertir RGB a Hexagemial
function rgbToHex(r, g = 0, b = 0) {
    if (!$.isArray(r)) {
        if ((r + '').indexOf('rgb(') > -1) {
            var out = /^rgb\((\d+), (\d+), (\d+)\)$/.exec(r);

            return out ? '#' +
                ('0' + parseInt(out[1],10).toString(16)).slice(-2) +
                ('0' + parseInt(out[2],10).toString(16)).slice(-2) +
                ('0' + parseInt(out[3],10).toString(16)).slice(-2) : null;
        } else {
            return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        }
    } else {
        return '#' + ((1 << 24) + (r[0] << 16) + (r[1] << 8) + r[2]).toString(16).slice(1);
    }
}

// Convierte el color de rgb a hexagesimal
function rgb2hex(rgb) {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    return rgbToHex(parseInt(rgb[1]), parseInt(rgb[2]), parseInt(rgb[3]));
}

// Obtener el numero de la semana del año indicado
Date.prototype.iso8601Week = function () {
    // Create a copy of the current date, we don't want to mutate the original
    const date = new Date(this.getTime());

    // Find Thursday of this week starting on Monday
    date.setDate(date.getDate() + 4 - (date.getDay() || 7));
    const thursday = date.getTime();

    // Find January 1st
    date.setMonth(0); // January
    date.setDate(1);  // 1st
    const jan1st = date.getTime();

    // Round the amount of days to compensate for daylight saving time
    const days = Math.round((thursday - jan1st) / 86400000); // 1 day = 86400000 ms
    return Math.floor(days / 7) + 1;
}

// Convetir la fecha gregoriana en juliana
Date.prototype.julian = function () {
    const date = new Date(this.getTime());

    var y = date.getFullYear();
    var M = date.getMonth();
    var d = date.getDate();

    if (M <= 2) {
        y -= 1;
        M += 12;
    }

    var A = Math.floor(y / 100);
    var B = 2 - A + Math.floor(A / 4);

    return (Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (M + 1)) + d + B - 1524.5);
}

// Obtener el porcentaje de visibilidad de la luna
Date.prototype.moonfase = function () {
    const date = new Date(this.getTime());

    var y = date.getFullYear();
    var M = date.getMonth();
    var d = date.getDate();

    var knownNewMoon = 2451550.1; // Día juliano conocido para una luna nueva
    var lunarMonth = 29.53058867; // Duración promedio del mes lunar en días

    var daysSinceKnownNewMoon = (new Date(y, M, d)).julian() - knownNewMoon;
    var newMoons = Math.floor(daysSinceKnownNewMoon / lunarMonth);

    var currentNewMoon = knownNewMoon + newMoons * lunarMonth;
    var lunarAge = ((new Date(y, M, d)).julian() - currentNewMoon) % lunarMonth;

    if (lunarAge < 1.84566) {
        return [0, 'New'];
    } else if (lunarAge < 5.53699) {
        return [1, 'CrescentQuarter'];
    } else if (lunarAge < 9.22831) {
        return [2, 'FirstQuarter'];
    } else if (lunarAge < 12.91963) {
        return [3, 'WaxingGibbous'];
    } else if (lunarAge < 16.61096) {
        return [4, 'Full'];
    } else if (lunarAge < 20.30228) {
        return [5, 'WindingGibbous'];
    } else if (lunarAge < 23.99361) {
        return [6, 'LastRoom'];
    } else if (lunarAge < 27.68493) {
        return [7, 'LastQuarter'];
    }

    return [0, 'New'];
}

// Sumar/Restar dias a la fecha indicada
Date.prototype.addDays = function (days = 0, weekday = null) {
    const date = new Date(this.getTime());

    var y = date.getFullYear();
    var M = date.getMonth();
    var d = date.getDate();

    var out = new Date(y, M, d + days);

    if (weekday != null) {
        var i = [6, 0, 1, 2, 3, 4, 5][out.getDay()];
        var j = 1;

        while (i != weekday) {
            out = new Date(y, M, d + j++);
            if (++i > 7) {
                i = 1;
            }
        }
    }

    return out;
}

// Calcular el Domingo de resurreccion de un año indicado
Date.prototype.holyWeek = function () {
    const date = new Date(this.getTime());

    var y = date.getFullYear();

    var k = parseInt(y / 100);
    var q = parseInt(k / 4);
    var d = ((19 * (y % 19)) + ((15 - (parseInt((13 + (8 * k)) / 25)) + k - q) % 30)) % 30;
    var e = ((2 * (y % 4)) + (4 * (y % 7)) + (6 * d) + ((4 + k - q) % 7)) % 7;

    var out = new Date(y, 3, d + e - 9);
    if ((d + e) < 10) {
        out = new Date(y, 2, d + e + 22);
    }

    return out;
}

// Fecha del sistema
var now = new Date().toISOString();
var [y, M, d, h, m, s, nm] = now.match(/\d+/g);
nm = nm + '000';
h  = parseInt(h) + 2;

// URL de la pagina
var url = window.location.pathname;
var url = url.substr(1, url.indexOf('/index.html'));

// Altura y anchura de la vetana
var height = $(window).height();
var width  = $(window).width();

// Identificar si se ejecuta desde un movil
var isPhone = (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i));

// Identificar el idioma
var userLanguage = navigator.language || navigator.userLanguage;

// Enviar Whatsapp
function sendWhatsapp(value) {
    if (isPhone) {
        location.href = 'whatsapp://send?text=' + ((value).replaceAll(' ', '%20')).replaceAll('\n', '%0A');
    }
}

//  Crear un Toast que se borra cuando tu le indiques
function toast(message = '', ms = 0) {
    var $temp = $('<div>').html(message)
        .css({'background-color': '#000000'
            , 'color'           : '#ffffff'
            , 'width'           : '25%'
            , 'padding'         : '1%'
            , 'text-align'      : 'center'
            , 'vertical-align'  : 'center'
            , 'border-radius'   : '5%'
            , 'position'        : 'absolute'
            , 'left'            : '37.5%'
            , 'bottom'          : '10%'})
        .appendTo('body');

    setTimeout(function() {
        $temp.css({'transition'  : 'opacity ' + ms / 2 + 'ms ease-in-out'
                 , 'opacity'     : '0'});

        setTimeout(function() {$temp.remove();}, 1000);
    }, ms);
}

// Dibujar poligono regular de n lados
function drawPoligon(context, kwargs = {color : '#000000', x : 0, y : 0, size : 0, sides : 1, fill : true, rotate: 0}) {
    if (typeof kwargs['color'] == 'undefined') {
        kwargs['color'] = '#000000';
    }

    if (typeof kwargs['x'] == 'undefined') {
        kwargs['x'] = 0;
    }

    if (typeof kwargs['y'] == 'undefined') {
        kwargs['y'] = 0;
    }

    if (typeof kwargs['size'] == 'undefined') {
        kwargs['size'] = 0;
    }

    if (typeof kwargs['sides'] == 'undefined') {
        kwargs['sides'] = 1;
    }

    if (typeof kwargs['fill'] == 'undefined') {
        kwargs['fill'] = false;
    }

    if (typeof kwargs['rotate'] == 'undefined') {
        kwargs['rotate'] = 0;
    }

    if (context != null) {
        context.save();
        context.translate(kwargs['x'], kwargs['y']);
        context.rotate(kwargs['rotate'] * (Math.PI / 180));

        const angle = (2 * Math.PI) / kwargs['sides'];

        context.beginPath();

        for (let i = 0; i < kwargs['sides']; i++) {
            const xPos = kwargs['size'] * Math.cos(angle * i);
            const yPos = kwargs['size'] * Math.sin(angle * i);
            if (i === 0) {
                context.moveTo(xPos, yPos);
            } else {
                context.lineTo(xPos, yPos);
            }
        }

        if (kwargs['fill']) {
            context.fillStyle = kwargs['color'];
            context.fill();
        }

        context.strokeStyle = kwargs['color'];
        context.closePath();
        context.stroke();
        
        context.restore();
    }
}

// Dibujar estrella regular de n lados
function drawStar(context, kwargs = {color : '#000000', x : 0, y : 0, size : 0, sides : 1, fill : true, rotate: 0}) {
    if (typeof kwargs['color'] == 'undefined') {
        kwargs['color'] = '#000000';
    }

    if (typeof kwargs['x'] == 'undefined') {
        kwargs['x'] = 0;
    }

    if (typeof kwargs['y'] == 'undefined') {
        kwargs['y'] = 0;
    }

    if (typeof kwargs['size'] == 'undefined') {
        kwargs['size'] = 0;
    }

    if (typeof kwargs['sides'] == 'undefined') {
        kwargs['sides'] = 1;
    }

    if (typeof kwargs['fill'] == 'undefined') {
        kwargs['fill'] = false;
    }

    if (typeof kwargs['rotate'] == 'undefined') {
        kwargs['rotate'] = 0;
    }

    if (context != null) {
        context.save();
        context.translate(kwargs['x'], kwargs['y']);
        context.rotate(kwargs['rotate'] * (Math.PI / 180));

        const angle = (Math.PI / kwargs['sides']); // Ángulo para los vértices exteriores
        const radioIn = kwargs['size'] / 2; // Radio para los vértices interiores

        context.beginPath();
        for (let i = 0; i < kwargs['sides'] * 2; i++) {
            const radio = i % 2 === 0 ? kwargs['size'] : radioIn; // Alternar entre exterior e interior
            const xPos = radio * Math.cos(i * angle);
            const yPos = radio * Math.sin(i * angle); // Invertir Y para el canvas
            if (i === 0) {
                context.moveTo(xPos, yPos);
            } else {
                context.lineTo(xPos, yPos);
            }
        }

        if (kwargs['fill']) {
            context.fillStyle = kwargs['color'];
            context.fill();
        }

        context.strokeStyle = kwargs['color'];
        context.closePath();
        context.stroke();
        
        context.restore();
    }
}

$(document).ready(function(e) {
    main();
});
