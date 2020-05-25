var ExcelToJSON = function() {

    this.parseExcel = function(file) {
      var reader = new FileReader();

      reader.onload = function(e) {
        var data = e.target.result;
        var workbook = XLSX.read(data, {
          type: 'binary', cellDates:true});
        workbook.SheetNames.forEach(function(sheetName) {
    
          var csv = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);
          console.log(typeof csv);
          buildJSON(csv, true);
 
        })
      };

      reader.onerror = function(ex) {
        console.log(ex);
      };

      reader.readAsBinaryString(file);
    };
};

function handleFileSelect(evt) {
  
  //var files = evt.target.files; // FileList object
  var xl2json = new ExcelToJSON();
  xl2json.parseExcel(evt);
}