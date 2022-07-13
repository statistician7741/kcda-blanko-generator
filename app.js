//baca data
const xlsx = require("node-xlsx").default;
const fs = require("fs");
const XlsxPopulate = require('xlsx-populate');
const DesKectemplate_path = __dirname + "/DesaKel only.xlsx";
const Puskesmastemplate_path = __dirname + "/Puskesmas.xlsx";
const isWithKec = false;
const metadata_path = __dirname + "/metadata.xlsx";
const data = xlsx.parse(metadata_path);

//modul mongodb utk koneksi mongo db database
const url = 'mongodb://127.0.0.1:27017/bps';
const mongoose = require('mongoose');

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err) => {

})

const DesKelKCDA = require('./models/DesaKelKCDA.model');
const KecKCDA = require('./models/KecKCDA.model');

//##### Blanko Desa Kelurahan
//get template
const generateDesaKecBlanko = function (all_tabels, all_kecs) {
    all_tabels.forEach((deskel, i) => {
        data[0].data.forEach((row, i) => {
            if (deskel._id === row[8]) {
                if (i > 1) {
                    XlsxPopulate.fromFileAsync(DesKectemplate_path)
                        .then(workbook => {
                            //set data
                            //nama desa/kel
                            workbook.sheet(0).cell("B2").value(row[1]);
                            isWithKec?workbook.sheet(1).cell("A2").value(`Kec: ${row[0]}`):null;
                            //nama pic
                            workbook.sheet(0).cell("C2").value(`Kontak BPS: ${row[2]}`);
                            isWithKec?workbook.sheet(1).cell("C2").value(`Kontak BPS: ${row[2]}`):null;
                            //desa
                            if (deskel.data[0]) {
                                const data2020 = [];
                                deskel.data.forEach((val, i) => {
                                    if (i < 5 || i > 28 || (i > 8 && i < 21)) data2020.push([val.isi])
                                })
                                workbook.sheet(0).range("F5:F113").value(data2020);
                            }
                            //kec
                            all_kecs.forEach((kec, i) => {
                                if (kec._id === row[9]) {
                                    const datakec2020 = []
                                    kec.data.forEach((val, i) => {
                                        if (i > 2) datakec2020.push([val.k1])
                                    })
                                    isWithKec?workbook.sheet(1).range("E5:E9").value(datakec2020):null;
                                }
                            })
                            //save to ssd
                            const fileNamePath = __dirname + `/${row[0]}/${row[1]}.xlsx`
                            if (fs.existsSync(fileNamePath)) {
                                fs.unlinkSync(fileNamePath);
                            }
                            if (!fs.existsSync(__dirname + `/${row[0]}`)) {
                                fs.mkdirSync(__dirname + `/${row[0]}`);
                            }
                            workbook.toFileAsync(fileNamePath);
                        }).then(dataa => {
                            //done
                            console.log(deskel._id + ' Created.');
                        })
                }
            }
        });
    })
    console.log('========FINISH=======');
}


//##### Blanko Desa Kelurahan
//get template
const generatePuskesmasBlanko = function () {
    let all_kec = []
    let _currentKec = undefined
    let _isJustChanged = false
    let _kec = {
        deskel: []
    }
    data[0].data.forEach((row, i) => {
        if (i > 1) {
            // console.log(row)
            _isJustChanged = row[0] !== _currentKec ? true : false;
            // console.log(_isJustChanged)
            if (_isJustChanged && _currentKec) {
                // console.log(_kec)
                all_kec.push({
                    ..._kec
                })
                _kec.deskel = []
            }
            _currentKec = row[0];
            _kec.name = _currentKec;
            _kec.deskel.push(row[1])
            if (i === data[0].data.length - 1) all_kec.push({
                ..._kec
            })
        }
    })
    // console.log(all_kec)
    // return
    all_kec.forEach(kec => {
        XlsxPopulate.fromFileAsync(Puskesmastemplate_path)
            .then(workbook => {
                //set data
                workbook.find("{kec}", kec.name.replace(/^\d{3}\s/, ''))
                kec.deskel.forEach((deskel, j) => {
                    workbook.sheet(0).cell(`A${7 + j}`).value(deskel);
                    workbook.sheet(0).cell(`H${7 + j}`).value(deskel);
                    workbook.sheet(0).cell(`P${7 + j}`).value(deskel);
                    workbook.sheet(0).cell(`W${7 + j}`).value(deskel);
                })
                //save to ssd
                const fileNamePath = __dirname + `/${kec.name}/Puskesmas ${kec.name}.xlsx`
                if (fs.existsSync(fileNamePath)) {
                    fs.unlinkSync(fileNamePath);
                }
                if (!fs.existsSync(__dirname + `/${kec.name}`)) {
                    fs.mkdirSync(__dirname + `/${kec.name}`);
                }
                workbook.toFileAsync(fileNamePath);
            }).then(dataa => {
                //done
                console.log('Finished');
            })
    })
}

//run

DesKelKCDA.find({}, (e, all_tabels) => {
    KecKCDA.find({}, (e, all_kecs) => {
        // console.log(all_tabels[0]);
        generateDesaKecBlanko(all_tabels, all_kecs)
    })
})
generatePuskesmasBlanko()