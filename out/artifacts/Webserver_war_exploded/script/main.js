var fileName;
var BetreffValues = [];
var KeyArray = [];
var tableData = [];
var TagError = false;
var ausgabeString = ``;
var jsonEinträge = '{"Einträge":[]}'; //Create json



function buildJSON(text, xslx) {

    //console.log("Before replace: " + text);       
    text = text.replace(/"/gi, ""); //replace double quotation marks
    text = text.replace(/'/gi, ""); //replace single quotation marks
    //text = text.replace(/;;/gi, "REPLACE;");
    //console.log("After replace: " + text);       


    var lines = text.split(/[\r\n]+/g); //tolerate both Windows and Unix linebreaks
    
    var title = lines[1].split(xslx ? "," : ";");

    for (var i = 0; i < title.length; i++) {
        title[i] = title[i].replace(/ /gi, ""); //replace spaces

    }

    jsonEinträge = JSON.parse(jsonEinträge); //parse json
    var jsonArray = [];

    for (var j = 2; j < lines.length; j++) {
        var linevalues = lines[j].split(xslx ? "," : ";");
        //console.log(linevalues);
        if(linevalues.length == 1 && linevalues[0] == ""){break;}
        var jsonString = '{';

        for (var i = 0; i < title.length; i++) {

            var re = /^\s*(1[012]|0?[1-9])(-|\/|\.)(3[01]|[12][0-9]|0?[1-9])(-|\/|\.)(?!00)[0-9]{2}\s*$/g; //validate Date
            var found = linevalues[i].match(re); //check values
            console.log(linevalues[i]);
            if(found){
                linevalues[i] = setDateFormat(found[0]);   //format Dates
            }

            if (i > 0) {                //if there are more than 0 entries, seperate them with ,
                jsonString += ' , ';
            }

            jsonString += '"'; //set everything into json format
            jsonString += title[i].replace('"', " ");
            jsonString += '": "';
            //console.log(linevalues[i]);

            jsonString += linevalues[i].replace('"', " ");
            jsonString += '"';

            tableData.push(linevalues[i]);
        }
        jsonString += '}';
        //console.log(jsonString);
        jsonString = JSON.parse(jsonString);
        jsonEinträge['Einträge'].push(jsonString);
        //console.log(jsonEinträge);
    }


    createTable();
}

function setDateFormat(found){
    console.log("found: " + found);
    var splitted = found.split(/[-.\/]/);
    var year = "20";

    if(splitted[0] < 9){
        splitted[0] = "0" + splitted[0];
    }
    if(splitted[1] < 9){
        splitted[1] = "0" + splitted[1];
    }
    if(splitted[2] > 30){
        year = "19";
    }

    var date = splitted[1] + "." + splitted[0] + "." + year + splitted[2];
    return date;
}

function createTable() {

    var ausgabeString = `

        <form id='send' action='test' method='post' accept-charset='UTF-8'>

        <span id='selectNone'>Bitte wählen Sie mindestens<br> eine Zeile aus.</span>

        <span id='saveDatum' style='display: none'>Datum</span>
        <span id='saveUhrzeit' style='display: none'>Uhrzeit</span>

        <div class="flex-container">
            <div id="BetreffDiv">
                <div class="backdrop">
                <div class="highlights"></div>
                </div>
                <label for="saveTerminname">Betreff: </label>
                <input id='saveTerminname' class='BetreffInput' maxlength="50" required placeholder="#Tabellenüberschrift#, Normaler Text"></input>
                <img src="images/info.png" class="info" title="Info Betreff"/>
                <span id="characterSpan" style="display: none;"></span>
            </div>
            
            <div>
                <input id='button' type='submit' value='Konvertieren' title='Ausgewählte Felder zu .ics convertieren'>
                <br>
                <a id='chooseFile' href='index.html'>Oder andere File auswählen...</a>
            </div>

            
            <div class="row">
                <input type="text" autocomplete='off' id="searchText" class="search-input" placeholder="Search...">
                <div class="suggestions"></div>

                <ul class="dropdown-menu">
                <li><input class='filterCheckboxes_all' checked type='checkbox'/>Alle auswählen</li>
                    `;
                for (var key in jsonEinträge.Einträge[0]) {
                    ausgabeString += "<li><input class='filterCheckboxes' checked value='"+key+"' type='checkbox'/>" + key + "</li>"
                }
                ausgabeString += `
                </ul>

                <div id='openSearch'>
                    <img src="images/arrow_down.png" title="Suchfilter"/>
                </div>
                <div id='menu_pic'>
                    <img src="images/tags.png" title="Tags"/>
                </div>

                
            </div>
            <div id='Tagdiv' ondragenter='return dragEnter(event)' ondrop='return dragDrop(event)' ondragover='return dragOver(event)'>
                Ziehen Sie die folgenden Tags auf die gewünschten Überschriften<br>
                <div class='Tags' draggable='true' ondragstart='return dragStart(event)' id='Datum' title="Ziehen Sie den Tag auf die gewünschte Überschrift">Datum</div>
                <div class='Tags' draggable='true' ondragstart='return dragStart(event)' id='Uhrzeit' title="Ziehen Sie den Tag auf die gewünschte Überschrift">Uhrzeit</div>
            </div>

        </div>

        <div id='tableback'>

        <table id='table' class='csv scrollable display'>
                <thead>

                    <tr class="tablehead">
                        <th data-filterable="false" data-sortable="false">

                            <div class='checkboxspace'>
                                <label class='control control-checkbox' title='Alles auswählen'><input class='checkbox' type='checkbox' onchange='checkAll(this)' id='checkmark' name='active'><div class='control_indicator'></div></label>
                            </div>
                        </th>
    `;
    var z = 1;
    for (var key in jsonEinträge.Einträge[0]) { //iterate over titles
        KeyArray.push("#" + key + "#");
        ausgabeString += "<th id='filter_col" + z + "' data-column='" + z + "' ondragenter='return dragEnter(event)' ondrop='return dragDrop(event)' ondragover='return dragOver(event)' class='" + key + "'>" + key + "<br></th>"; //add titles as th´s
        z++;
    }


    ausgabeString += "</tr></thead><tbody id='tbody'> "; //end thead and start tbody

    for (var i = 0; i < jsonEinträge.Einträge.length; i++) { //iterate over full json

        ausgabeString += "<tr>";

        var obj = jsonEinträge.Einträge[i];

        //checkbox of present line

        ausgabeString += "<td><div class='checkboxspace'><label class='control control-checkbox' title='Zeile auswählen'><input class='checkbox data' type='checkbox' onchange='highlight(this)' name='active' value='" + JSON.stringify(obj) + "'><div class='control_indicator'></div></label></div></td>";

        for (const [key, value] of Object.entries(obj)) {
            ausgabeString += "<td class='" + key + "'>" + value + "</td>"; //add current field
        }

        ausgabeString += "</tr>";

    }

    ausgabeString += "</tbody></table>";

    ausgabeString += "</form>";

    document.getElementById('show-text').innerHTML += ausgabeString; //display table
    document.getElementById('upload-wrapper').style.display = 'none';
    document.getElementById('menu_pic').style.opacity = 1;
    document.getElementById('openSearch').style.opacity = 1;

    events();
    resizeTable();

}

function events(){
    $(document).ready(function() {

        var table = $('#table').DataTable({
            "paging": false,
            "info": false,
            "language": {
                "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/German.json"
            },
        });

      

        $('#searchText').unbind().on('keyup keydown click', function() {

            if($('.dataTables_empty').length){
                resizeTable();
            }

            var checked = [];
            var counter = 1;
            $.each($(".filterCheckboxes"), function(){
                if($(this).is(':checked')){
                    checked.push(counter);
                }
                counter++;
            });


            var searchTerm = $('#searchText').val();

            $.fn.dataTable.ext.search.push(function(settings, data, dataIndex) {
                //search only in column 1 and 2
                //console.log(checked);
                for(var i = 0; i < checked.length; i++){
                    if (~data[checked[i]].indexOf(searchTerm)) return true;
                }
                return false;
            })
            table.draw(); 
            $.fn.dataTable.ext.search.pop();

          
        });

        $(window).scroll(function () {
            if($(this).scrollTop() > 100){
                $("#scrollTop").css({ opacity: 1 });
            }else{
                $("#scrollTop").css({opacity:0});
            }
        });

        $("#scrollTop").click(function(){
            $("html").scrollTop(0); //set original scroll position                                           

        });


        $("#openSearch").click(function() {
            $('.dropdown-menu').toggle(150);
        });

        $('#PopUp span').click(function(){
            $('#PopUp').hide();
        })

        $('#menu_pic').click(function() {
            $('#Tagdiv').toggle("slide", {direction: "right"}, 150);
        });

        $('.info').click(function(){
            if($('#PopUpBetreffHilfe').is(":visible")){
                $('#PopUpBetreffHilfe').hide();
                event.stopPropagation(); 
            }else{
                $('#PopUpBetreffHilfe').show();
                event.stopPropagation(); 

            }
        })

        $('#PopUpBetreffHilfe span').click(function(){
            $('#PopUpBetreffHilfe').hide();
        })

        $('.filterCheckboxes_all').click(function(){
            var checked = $(this).is(":checked");
            $('.filterCheckboxes').each(function() { //go through every checkbox
                if(checked != $(this).is(":checked")){
                    $(this).click();

                }
         
            });
        })

        $(window).click(function() {
            $('.dropdown-menu').hide();
            $('#PopUp').hide();
            $('#PopUpBetreffHilfe').hide();
            $('.ui-helper-hidden-accessible').html("");

        });

        $('#openSearch, .dropdown-menu, #Tagdiv, #menu_pic, .column_filter, #PopUp, #PopUpBetreffHilfe, .info').click(function(event) {
            event.stopPropagation();
        });


        $('input[type="search"]').on('input', function(e) {
            if ('' == this.value) {
                this.value = " ";
            }
        });


    });

    //autocomplete.js
    singleComplete(); //autocomplete for summary input
    searchComplete();

    //ClassAutocomplete(jsonEinträge.Einträge); //autocpmplete for all th inputs

    //set variables
    var $container = $('.container');
    var $highlights = $('.highlights');
    var $textarea = $('.BetreffInput');
    var $toggle = $('button');

    // yeah, browser sniffing sucks, but there are browser-specific quirks to handle that are not a matter of feature detection
    var ua = window.navigator.userAgent.toLowerCase();
    var isIE = !!ua.match(/msie|trident\/7|edge/);

    function applyHighlights(text) {    //applies highlighting to keywords

        //console.log("apply");
        var Textmatch = text.match(/([#])(?:(?=(\\?))\2.)*?\1/g);
        //console.log(jsonEinträge);
        var keys = Object.keys(jsonEinträge.Einträge[0]);

        BetreffValues = [];
        if (Textmatch) {
            for (var j = 0; j < Textmatch.length; j++) {
                for (var i = 0; i < keys.length; i++) {
                    var tmp = "#" + keys[i] + "#";
                    if (tmp == Textmatch[j]) {
                        text = text.replace(Textmatch[j], '<mark>$&</mark>');
                        BetreffValues.push(Textmatch[j]);
                    }
                }
            }
        }

        if (isIE) {
            // IE wraps whitespace differently in a div vs textarea, this fixes it
            text = text.replace(/ /g, ' <wbr>');
        }
        return text;
    }

    function handleInput() {
        var text = $textarea.val();
        var highlightedText = applyHighlights(text);
        $highlights.html(highlightedText);
    }

    function bindEvents() {
        $textarea.on({
            'input': handleInput
        });

        $toggle.on('click', function() {
            $container.toggleClass('perspective');
        });
    }

    bindEvents();  //bind searchfield events
    handleInput(); //handle searchfield input
    sendJSON();

}



function sendJSON() {
    $(document).ready(function() { //take updated DOM

        $("#send").submit(function(e) { //if main Form submits
            e.preventDefault(e);
            var jsonSend = []; //empty Array for json

            if ($(".data:checkbox:checked").length > 0) {
                //console.log("Something is checked!");
                $(".data:checkbox:checked").each(function() { //take all values from checked fields
                    // console.log("Eintrag: " + $(this).val());
                    jsonSend.push($(this).val()); //fills array with these values                                    
                });

                var jsonSendEntries = '{"Einträge":[], "Summary":[], "Datum":"", "Uhrzeit":""}'; //Create json
                jsonSendEntries = JSON.parse(jsonSendEntries); //parse json

                var tmp = "";
                for (var i = 0; i < jsonSend.length; i++) { //iterate through array
                    tmp = JSON.parse(jsonSend[i]); //json needs to parse
                    jsonSendEntries['Einträge'].push(tmp); //fills final json

                }

                var Betreff = document.getElementById("saveTerminname").value;
                Betreff = stringHighlightSearch(jsonSendEntries.Einträge, Betreff);

                var Datum = document.getElementById("saveDatum").innerHTML;
                var Uhrzeit = document.getElementById("saveUhrzeit").innerHTML;

                const reTime = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
                const reDate = /^(0?[1-9]|[12][0-9]|3[01])[\/\-\.](0?[1-9]|1[012])[\/\-\.]\d{4}$/;

                console.log(jsonSendEntries['Einträge']);

                var validError = false;


                for(var i = 0; i < jsonSendEntries['Einträge'].length; i++){

                    var UhrzeitValue = jsonSendEntries['Einträge'][i][Uhrzeit];
                    var DatumValue = jsonSendEntries['Einträge'][i][Datum];

                    if(UhrzeitValue.includes("Uhr") || UhrzeitValue.includes("uhr")){
                        UhrzeitValue = UhrzeitValue.slice(0, -3);
                        UhrzeitValue = UhrzeitValue.split(" ").join("");
                    }

                    console.log("sliced uhrzeit: " + UhrzeitValue)

                    if(!reTime.test(UhrzeitValue) || !reDate.test(DatumValue)){
                        validError = true;
                    }
                }



                jsonSendEntries = JSON.stringify(jsonSendEntries); //json to string
                //console.log(validError);
                if (Datum !== "" && Uhrzeit !== "" && !validError){
                    //creates a form with the finished json to send with post

                    for (var b = 0; b < Betreff.length; b++) {
                        jsonSendEntries = JSON.parse(jsonSendEntries);

                        jsonSendEntries['Summary'].push(Betreff[b]);

                        jsonSendEntries = JSON.stringify((jsonSendEntries));

                    }

                    console.log("jsonSendEntries: " + JSON.stringify(jsonSendEntries));

                    jsonSendEntries = JSON.parse(jsonSendEntries);

                    jsonSendEntries.Datum = Datum;
                    jsonSendEntries.Uhrzeit = Uhrzeit;

                    jsonSendEntries = JSON.stringify((jsonSendEntries));

                    var tmpString = "<form id='dynForm' action='/Webserver_war/test' method='post'><input type='hidden' name='q' value='" + JSON.stringify(jsonSendEntries) + "'>";

                    document.querySelector('body').innerHTML += tmpString;


                    console.log(JSON.stringify(jsonSendEntries));

                    document.getElementById("dynForm").submit();



                   var elem = document.getElementById('dynForm');
                   elem.parentNode.removeChild(elem);


                    events();

                }else if(validError){
                   $("#PopUp").show();
                }
                else {
                    alert("Fehler");
                }



            } else {
                e.preventDefault(e);

                document.getElementById('selectNone').style.display = 'inherit'; //show error message if nothing´s selected
            }

        });
    });
}

function stringHighlightSearch(json, Betreff) { //creates value array from highlighted Keywords

    var outputArray = [];

    for (var i = 0; i < json.length; i++) {
        var tmpString = Betreff;

        $.each(json[i], function(key, value) {
            for (var j = 0; j < BetreffValues.length; j++) {
                var betreffvalue = BetreffValues[j].split('#');

                if (key == betreffvalue[1]) {
                    tmpString = tmpString.replace("#" + key + "#", value);
                }

            }
        });

        outputArray.push(tmpString);

    }

    return outputArray;
}



function resizeTable() {
    //console.log(jsonEinträge);
    var count = Object.keys(jsonEinträge["Einträge"][0]).length;
    
    
    //console.log(document.getElementsByTagName("form").style.width);
    var formWidth = document.getElementById("send").offsetWidth;
    var firstThWidth = document.getElementsByTagName("th")[0].offsetWidth;

    var size = (formWidth - firstThWidth) / count;
    console.log("count: " + count);
    console.log("size: " + size);
    for (var i = 1; i <= count; i++) {
        document.getElementsByTagName("th")[i].style.width = size + "px";
    }

}

function highlight(checkObj) { //highlight checked lines

    if (checkObj.checked) {
        checkObj.parentElement.parentElement.parentElement.parentElement.classList.add("checked");
        document.getElementById('selectNone').style.display = 'none';


    } else {

        checkObj.parentElement.parentElement.parentElement.parentElement.classList.remove("checked");


    }

}

function checkAll(checkObj) { //(un)check all checkboxes

    var scroll = $("html").scrollTop(); //get scroll position
    //console.log("checkall");
    $('.control-checkbox').each(function() { //go through every checkbox

        if ($(this).children().prop("checked") != $(checkObj).prop("checked")) { //only click, if main checkbox has not the same property
            $(this).click();
            //console.log("click");
        }

    });
    $("html").scrollTop(scroll); //set original scroll position                                           

}

function dragStart(ev) {
    ev.dataTransfer.effectAllowed = 'move';
    ev.dataTransfer.setData("Text", ev.target.getAttribute('id'));
    ev.dataTransfer.setDragImage(ev.target, 50, 50);
    return true;
}

// these functions prevents default behavior of browser
function dragEnter(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    return true;
}

function dragOver(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    return true;

}

// function defined for when drop element on target

function dragDrop(ev) {

    ev.preventDefault();
    ev.stopPropagation();

    var doc = ev.target;
    //console.log(doc);
    var notes = false;

    //console.log(doc.childNodes.length);
    if(doc.childNodes.length > 2){
        notes = true;
    }

    if(ev.target.id == "Tagdiv"){
        notes = false;
        var dataEle = document.getElementById(ev.dataTransfer.getData("Text"));
        dataEle.style.backgroundColor =  "rgb(117, 216, 133)";
        dataEle.style.textDecoration = "none"; 
        dataEle.style.margin = "0.15vw";
        dataEle.setAttribute("title", "Ziehen Sie den Tag auf die gewünschte Überschrift");

    }

    //console.log(notes);
    if (ev.target.className != "Tags" && ev.target.id != "selectfilter" && !notes) {   
        TagError = false;                                                       //set Error Variable to default

        var checkmark = document.getElementById("checkmark");
        if(checkmark.checked){
            checkmark.click();
        }

        if(document.querySelector(".checkbox:disabled")){
            document.querySelectorAll(".checkbox:disabled").forEach((e) => {
                e.parentNode.childNodes[1].style.backgroundColor = "white";
                e.disabled = false;
            
                
            });
        }

        var data = ev.dataTransfer.getData("Text");                             //data = Tag   

        if(data == "Uhrzeit"){
            var all = document.getElementsByClassName("falseTime");
            for(var k = 0; k < all.length; k++){
                if(all[k].childNodes.length > 1){
                    all[k].removeChild(all[k].childNodes[1]);
                }else{
                    all[k].removeChild(all[k].childNodes[0]);
                }
            }
            
                document.querySelectorAll(".falseTime").forEach( e =>
                    e.classList.remove("falseTime"));
            
            //console.log("Anzahl Uhrzeit removed: " + k);
        }else{
            var all = document.getElementsByClassName("falseDate");
            //console.log("all.length: " + all.length);
            for(var k = 0; k < all.length; k++){
                if(all[k].childNodes.length > 1){
                    all[k].removeChild(all[k].childNodes[1]);
                }else{
                    all[k].removeChild(all[k].childNodes[0]);
                }
            }
            
                document.querySelectorAll( ".falseDate" ).forEach( e =>
                    e.classList.remove( "falseDate" ) );
            
            

        }

        var dataEle = document.getElementById(data);
        ev.target.appendChild(dataEle);                   //append Tag to target

        var parentNodevalues = dataEle.parentNode.innerHTML;  //get innerHTML of Tag
        //console.log(parentNodevalues);
        var parentArray = parentNodevalues.split("<");                              //cut unnecessary things off
        var parentValue = parentArray[0];                                           //get the right String of the Tag
        
        var targetClass = ev.target.className;
        targetClass = targetClass.split(" ")[0];

        document.getElementById("save" + data).innerHTML = parentValue;             //change Element from which the form gets their Tag info

        const reTime = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;                         //regex
        const reDate = /^(0?[1-9]|[12][0-9]|3[01])[\/\-\.](0?[1-9]|1[012])[\/\-\.]\d{4}$/;


        for(var i = 0; i < jsonEinträge.Einträge.length; i++){   
            if(ev.target.id == "Tagdiv"){
                checkErrorDateTime();
                break;
            }
             
            var x = i + 1;               

            var value = document.getElementsByClassName(targetClass)[x].innerHTML;
            value = value.replace(/\s/g, '');

            if(data == "Datum"){                 

                if(!reDate.test(value)){
                    dataEle.style.backgroundColor = "grey";
                    dataEle.style.textDecoration = "line-through";
                    dataEle.setAttribute("title", "Die Einträge sind fehlerhaft");

                    
                    var targetErrorEle = document.getElementsByClassName(targetClass);
                    var zaehler = i + 1;
                    
                    targetErrorEle[zaehler].innerHTML += "<div class='tooltip'><img class='errorImgDatum' src='images/error.png'/><span class='tooltiptext'>dd.mm.yyyy</span></div>";
                    targetErrorEle[zaehler].classList.add("falseDate");

                    targetErrorEle[zaehler].parentNode.querySelector('.checkbox').disabled = true;
                    targetErrorEle[zaehler].parentNode.querySelector('.checkbox').checked = false;
                    targetErrorEle[zaehler].parentNode.querySelector('.control_indicator').style.backgroundColor = "grey";


                    TagError = true;                  
                    
                }else{
                    dataEle.style.backgroundColor = "#ff8d2f";
                    dataEle.style.textDecoration = "none";
                    dataEle.setAttribute("title", "Einige Einträge sind fehlerhaft");

                }
                if(!TagError){
                    dataEle.style.backgroundColor =  "rgb(117, 216, 133)";
                    dataEle.style.textDecoration = "none";
                    dataEle.setAttribute("title", "");


                }
            }else if(data == "Uhrzeit"){                  

                if(value.includes("Uhr") || value.includes("uhr")){
                    value = value.slice(0, -3);
                }

                if(!reTime.test(value)){
                    console.log("Falsche Uhrzeit");
                    dataEle.style.backgroundColor = "grey";                    
                    dataEle.style.textDecoration = "line-through";
                    dataEle.setAttribute("title", "Die Einträge sind fehlerhaft");


                    var targetErrorEle = document.getElementsByClassName(targetClass);
                    var zaehler = i + 1;
                    
                    targetErrorEle[zaehler].innerHTML += "<div class='tooltip'><img class='errorImgUhrzeit' src='images/error.png'/><span class='tooltiptext'>hh:mm</span></div>";                    
                    targetErrorEle[zaehler].classList.add("falseTime");

                    targetErrorEle[zaehler].parentNode.querySelector('.checkbox').disabled = true;
                    targetErrorEle[zaehler].parentNode.querySelector('.checkbox').checked = false;
                    targetErrorEle[zaehler].parentNode.querySelector('.control_indicator').style.backgroundColor = "grey";

                    

                    TagError = true;                  
                    
                }else{
                    dataEle.style.backgroundColor = "#ff8d2f";
                    dataEle.style.textDecoration = "none";
                    dataEle.setAttribute("title", "Einige Einträge sind fehlerhaft");
                }
                if(!TagError){
                    dataEle.style.backgroundColor =  "rgb(117, 216, 133)";     
                    dataEle.style.textDecoration = "none";
                    dataEle.setAttribute("title", "");

                    
                }
            }

            checkErrorDateTime();
        }

        

    }
    return false;
    
}

function checkErrorDateTime(){
    if(document.querySelector(".errorImgUhrzeit")){
        document.querySelectorAll(".errorImgUhrzeit").forEach((e) => {
            e.parentNode.parentNode.parentNode.querySelector('.checkbox').disabled = true;
            e.parentNode.parentNode.parentNode.querySelector('.checkbox').checked = false;
            e.parentNode.parentNode.parentNode.querySelector('.control_indicator').style.backgroundColor = "grey";
        });
    }

    if(document.querySelector(".errorImgDatum")){
        document.querySelectorAll(".errorImgDatum").forEach((e) => {
            e.parentNode.parentNode.parentNode.querySelector('.checkbox').disabled = true;
            e.parentNode.parentNode.parentNode.querySelector('.checkbox').checked = false;
            e.parentNode.parentNode.parentNode.querySelector('.control_indicator').style.backgroundColor = "grey";
        });
    }
}
