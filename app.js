//baca data
const xlsx = require("node-xlsx").default;
const fs = require("fs");
const XlsxPopulate = require('xlsx-populate');
const template_path = __dirname + "/DesaKel-Kec.xlsx";
const metadata_path = __dirname + "/metadata.xlsx";
const data = xlsx.parse(metadata_path);

//get template
data[0].data.forEach((row, i) => {
    if (i > 0) {
        // console.log(row[0], row[1], row[2])
        XlsxPopulate.fromFileAsync(template_path)
            .then(workbook => {
                //set data
                //nama desa/kel
                workbook.sheet(0).cell("B2").value(row[1]);
                workbook.sheet(1).cell("A2").value(`Kec: ${row[0]}`);
                //nama pic
                workbook.sheet(0).cell("C2").value(`Kontak BPS: ${row[2]}`);
                workbook.sheet(1).cell("C2").value(`Kontak BPS: ${row[2]}`);
                //save to ssd
                const fileNamePath = __dirname + `/${row[0]}/${row[1]}.xlsx`
                if (fs.existsSync(fileNamePath)) {
                    fs.unlinkSync(fileNamePath);
                }
                if (!fs.existsSync(__dirname + `/${row[0]}`)){
                    fs.mkdirSync(__dirname + `/${row[0]}`);
                }
                workbook.toFileAsync(fileNamePath);
            }).then(dataa => {
                //done
                console.log('Finished');
            })
    }
});