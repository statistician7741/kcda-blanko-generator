const testFolder = 'C:\\Users\\acer\\Google Drive (bps7404ipds@gmail.com)\\2021\\SP2020\\Digitalisasi Titik Bangunan SP2020\\03-OUTPUT\\04-Peta WB-2020\\20210609\\zoom';
const fs = require('fs');
const XlsxPopulate = require('xlsx-populate');
const fileXlsx = './zoom.xlsx';

fs.readdir(testFolder, (err, files) => {
        XlsxPopulate.fromFileAsync(fileXlsx)
            .then(workbook => {
                //set data
                console.log(files);
                workbook.sheet(0).range('A1:A211').value(files.map(v=>[v]))
                //save to ssd
                const fileNamePath = __dirname + `/zoom ok.xlsx`
                if (fs.existsSync(fileNamePath)) {
                    fs.unlinkSync(fileNamePath);
                }
                workbook.toFileAsync(fileNamePath);
            }).then(dataa => {
                //done
                console.log('Finished');
            })
});