if (window.File && window.FileReader && window.FileList && window.Blob) {
    function showFile(file) { //if a file is selected

        
            var preview = document.getElementById('show-text'); //get div

            if (file == null) {
                var file = document.querySelector('input[type=file]').files[0]; //get file  
                
            } else {

            }
            //console.log(file);

            var reader = new FileReader(); //add new Filereader

            var fileType = file.name.split(".")[1];

            if (fileType == "CSV" || fileType == "csv") { //has to be a .csv File

                reader.onload = function(event) {

                    
                    var text = event.target.result; //get Filetext

                    fileName = file.name;
                    fileName = fileName.split(".");
                    fileName = fileName[0] + ".ics";

                    buildJSON(text);

                }

                preview.innerHTML = "";

            }else if(fileType == "xlsx" || fileType == "XLSX"){
                
                handleFileSelect(file);
                
            }
            else {
                preview.innerHTML = "<span class='error'>It doesn't seem to be a .csv/.xlsx file!</span>"; //error
            }
            reader.readAsText(file, 'UTF-8'); //utf8
        
    }
} else {
    alert("Your browser is too old to support HTML5 File API"); //error
}
