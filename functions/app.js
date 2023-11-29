// made all necessary imports
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const serverless = require('serverless-http');
const app = express();
const router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({origin:'*', 
              methods: 'GET, POST, PUT, DELETE, OPTIONS', 
              allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
              credentials: true}));

//----------------------------------------------------------------------------------------------------------------------------------

const overAll = `select A.contact_id, A.contact_name, A.contact_phone, A.contact_phone1, A.contact_phone2,
A.contact_email, A.contact_email1, A.contact_address, A.contact_address1,
(select C.tag_name from tags C  where C.tag_id = B.folder limit 1) as Folder,
(select C.tag_name from tags C  where C.tag_id = B.reltag limit 1) as reltag,
(select C.tag_name from tags C  where C.tag_id = B.tag1 limit 1) as Tag1,
(select C.tag_name from tags C  where C.tag_id = B.tag2 limit 1) as Tag2,
(select C.tag_name from tags C  where C.tag_id = B.tag3 limit 1) as Tag3,
(select C.tag_name from tags C  where C.tag_id = B.tag4 limit 1) as Tag4,
(select C.tag_name from tags C  where C.tag_id = B.tag5 limit 1) as Tag5,
(select C.tag_name from tags C  where C.tag_id = B.tag6 limit 1) as Tag6,
(select C.tag_name from tags C  where C.tag_id = B.tag7 limit 1) as Tag7,
(select C.tag_name from tags C  where C.tag_id = B.tag8 limit 1) as Tag8,
(select C.tag_name from tags C  where C.tag_id = B.tag9 limit 1) as Tag9,
(select C.tag_name from tags C  where C.tag_id = B.tag10 limit 1) as Tag10,
(select C.tag_name from tags C  where C.tag_id = B.tag11 limit 1) as Tag11,
(select C.tag_name from tags C  where C.tag_id = B.tag12 limit 1) as Tag12,
(select C.tag_name from tags C  where C.tag_id = B.tag13 limit 1) as Tag13,
(select C.tag_name from tags C  where C.tag_id = B.tag14 limit 1) as Tag14,
(select C.tag_name from tags C  where C.tag_id = B.tag15 limit 1) as Tag15,
(select C.tag_name from tags C  where C.tag_id = B.tag16 limit 1) as Tag16,
(select C.tag_name from tags C  where C.tag_id = B.tag17 limit 1) as Tag17,
(select C.tag_name from tags C  where C.tag_id = B.tag18 limit 1) as Tag18,
(select C.tag_name from tags C  where C.tag_id = B.tag19 limit 1) as Tag19,
(select C.tag_name from tags C  where C.tag_id = B.tag20 limit 1) as Tag20,
A.contact_status from contact A inner join contact_tag_linkage B on A.contact_id = B.contact_id
where A.contact_status = "Y" AND (A.contact_name like ? or
      A.contact_phone like ? or
      A.contact_phone1 like ? or
      A.contact_phone2 like ? or
      A.contact_email like ? or
      A.contact_email1 like ? or
(select C.tag_name from tags C  where C.tag_id = B.folder and C.tag_status = "Y" limit 1) like ? or
(select C.tag_name from tags C  where C.tag_id = B.reltag and C.tag_status = "Y" limit 1) like ? or
(select C.tag_name from tags C  where C.tag_id = B.tag1 and C.tag_status = "Y" limit 1) like ? or
(select C.tag_name from tags C  where C.tag_id = B.tag2 and C.tag_status = "Y" limit 1) like ? or
(select C.tag_name from tags C  where C.tag_id = B.tag3 and C.tag_status = "Y" limit 1) like ? or
(select C.tag_name from tags C  where C.tag_id = B.tag4 and C.tag_status = "Y" limit 1) like ? or
(select C.tag_name from tags C  where C.tag_id = B.tag5 and C.tag_status = "Y" limit 1) like ? or
(select C.tag_name from tags C  where C.tag_id = B.tag6 and C.tag_status = "Y" limit 1) like ? or
(select C.tag_name from tags C  where C.tag_id = B.tag7 and C.tag_status = "Y" limit 1) like ? or
(select C.tag_name from tags C  where C.tag_id = B.tag8 and C.tag_status = "Y" limit 1) like ? or
(select C.tag_name from tags C  where C.tag_id = B.tag9 and C.tag_status = "Y" limit 1) like ? or
(select C.tag_name from tags C  where C.tag_id = B.tag10 and C.tag_status = "Y" limit 1) like ? or
(select C.tag_name from tags C  where C.tag_id = B.tag11 and C.tag_status = "Y" limit 1) like ? or
(select C.tag_name from tags C  where C.tag_id = B.tag12 and C.tag_status = "Y" limit 1) like ? or
(select C.tag_name from tags C  where C.tag_id = B.tag13 and C.tag_status = "Y" limit 1) like ? or
(select C.tag_name from tags C  where C.tag_id = B.tag14 and C.tag_status = "Y" limit 1) like ? or
(select C.tag_name from tags C  where C.tag_id = B.tag16 and C.tag_status = "Y" limit 1) like ? or
(select C.tag_name from tags C  where C.tag_id = B.tag17 and C.tag_status = "Y" limit 1) like ? or
(select C.tag_name from tags C  where C.tag_id = B.tag18 and C.tag_status = "Y" limit 1) like ? or
(select C.tag_name from tags C  where C.tag_id = B.tag19 and C.tag_status = "Y" limit 1) like ? or
(select C.tag_name from tags C  where C.tag_id = B.tag20 and C.tag_status = "Y" limit 1) like ?);`;

// --------------------------------------------------------------------------------------------------------------------------------
// create database connection with Backend
const data = mysql.createConnection({
    host: 'contact-test.c1hc2il42dkf.ap-south-1.rds.amazonaws.com',
    user: 'admin',
    password: 'seppam-test',
    port: 3306,
    database: 'contact_management',
});


// checking database connection
data.connect((err) => {
    if (err) { console.log(err, 'Error while connecting the database') }
    else { console.log('Database conected......') }
});
// -------------------------------------------------------------------------------------------------------------------------------

//                             ======== Main Search =======

// Get all data by main search
router.get('/search', (req, res) => {
    let name = req.query.name;
    const add = '%' + name + '%';
    const qr = overAll.replaceAll('?', mysql.escape(add));
    // const qr = overAll;
    data.query(qr, [name], (err, result) => {
        if (err) {
            console.log(err, "error getting data from database");
        }
        if (result.length > 0) {
            res.json({
                message: "All user datas",
                result
            });
        }
        else {
            res.send({
                message: "No data found"
            });
        }
    });
});



// ----------------------------------------------------------------------------------------------------------------------------------------

//                          ========= All Contacts ==========

router.get('/allcontact', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    let qr = "select * from contact";
    data.query(qr, (err, result) => {
        if (err) {
            console.log('Error while getting contacts', err)
        }
        else {
            res.send({
                message: "All Contacts are here",
                data: result
            });
        }
    });
});



router.get('/foldercontact/:Foldercontact', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    let foldername = req.params.Foldercontact
    let qr = `select * from contact A inner join contact_tag_linkage B on A.contact_id=B.contact_id where B.folder = (select tag_id from tags where tag_name = '${foldername}');`;
    data.query(qr, (err, result) => {
        if (err) {
            res.send({
                message: "Error while getting contact with folder name",
                Error: err
            })
        }
        else {
            res.send({
                message: "contact got successfully",
                data: result
            })
        }
    })
})
// ------------------------------------------------------------------------------------------------------------------------------------
//         ==============  Contact for relation ================

router.get('/relcontact', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    let qr = "select Contact_id, contact_name, contact_phone from contact";
    data.query(qr, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send({
                message: "All contact are gathered",
                data: result
            })
        }
    })
})
// -----------------------------------------------------------------------------------------------------------------------------------------

//              ================= getting tagtype for creating tags==================

router.get('/type', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    let qr = "select * from tagtype"
    data.query(qr, (err, result) => {
        if (err) {
            console.log(err)
            res.send({
                message: "Error while getting message"
            })
        }
        else {
            res.send({
                data: result
            })
        }
    })
})

// --------------------------------------------------------------------------------------------------------------------------------------------

// ------------------------------ InActive contact ------------------------------

router.get('/inactivecontact', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    let qr = "select * from contact where contact_status = 'N'";
    data.query(qr, (err, result) => {
        if (err) {
            console.log("error getting data from database");
        }
        if (result.length > 0) {
            res.send({
                message: "All inActive contact datas",
                data: result
            });
        }
        else {
            res.send({
                message: "No data found"
            })
        }
    });
});

router.put('/activeContact', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    let contact_id = req.body.id
    for (id of contact_id) {
        let qr = "update contact set contact_status = 'Y' where contact_id = ?";
        data.query(qr, [id], (err, result) => {
            if (err) {
                console.log(err, "error upadating data")
            }
            else {
                console.log("Contact activated successfully");
            }
        })
    }
})

// ----------------------------------------------------------------------------------------------------------------------------------
// ------------------------------ Active Contact List -------------------------------------------------------------------------------

router.get('/activecon', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    let qr = "select * from contact where contact_status = 'Y'";
    data.query(qr, (err, result) => {
        if (err) {
            console.log("error getting data from database");
        }
        if (result.length > 0) {
            res.send({
                message: "All Active contact datas",
                data: result
            });
        }
        else {
            res.send({
                message: "No data found"
            })
        }
    });
});

router.put('/Inactive', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    let contact_id = req.body.id
    for (id of contact_id) {
        let qr = "update contact set contact_status = 'N' where contact_id = ?";
        data.query(qr, [id], (err, result) => {
            if (err) {
                console.log(err, "error upadating data")
            }
            else {
                console.log("Contact De-activated successfully");
            }
        })
    }
})



// ------------------------------------------------------------------------------------------------------------------------------------------

// ----------------------------- get all professional tagnames for contatct creation-------------------------------

router.get('/rtag', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    let qr = "select tag_name from tags where tag_type_id = (select tagType_id from tagtype where tagtype_name = 'relation')"
    data.query(qr, (err, result) => {
        if (err) {
            res.send({
                message: "Error while gettin data"
            });
        }
        else {
            res.send({
                message: "All tag",
                data: result
            })
        }
    });
});


// -------------------------------------------------------------------------------------------------------------------------------------------


// ========================== getting tag name =====================


router.get('/tags', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    let qr = "select tag_name from tags where tag_type_id = (select tagType_id from tagtype where tagtype_name = 'professional')";
    data.query(qr, (err, result) => {
        if (err) {
            console.log(err, "error while getting data from database")
        }
        if (result.length > 0) {
            res.send({
                message: "Getting all tag names",
                data: result
            });
        }
        else {
            res.send({
                message: "No data found"
            });
        }
    });
});

// --------------------------------------------------------------------------------------------------------------------------------------

// ============================ Folder name getting ===============================

router.get('/folder', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    let qr = "select tag_name from tags where tag_type_id = 3";
    data.query(qr, (err, result) => {
        if (err) {
            res.send({
                message: "Error while getting data",
            })
        }
        else {
            res.send({
                message: "Folder names",
                data: result
            })
        }
    });
});


// --------------------------------------------------------------------------------------------------------------------------------------------------------


// ==================== create contact with tags.... ==================================
router.post('/createcontact', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    let contact_name = req.body.name;
    let contact_email = req.body.email;
    let contact_email1 = req.body.email1;
    let contact_phone = req.body.phone;
    let contact_phone1 = req.body.phone1;
    let contact_phone2 = req.body.phone2;
    let contact_address = req.body.address;
    let contact_address1 = req.body.address1;
    let contact_status = req.body.status;
    let folder = req.body.folder;
    let reltag = req.body.reltag;
    let tag_names = req.body.tags;
    let relation = req.body.relname;


    let qr = "select contact_phone from contact where contact_phone = ?"
    data.query(qr, [contact_phone], (err, result) => {
        if (result.length > 0) {
            res.send({
                message: "Mobile Number Already Exist"
            })
        }
        else {
            let qr = "insert into contact (contact_name, contact_phone, contact_phone1, contact_phone2, contact_email, contact_email1, contact_address, contact_address1, Relation, contact_status) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";

            data.query(qr, [contact_name, contact_phone, contact_phone1, contact_phone2, contact_email, contact_email1, contact_address, contact_address1, relation, contact_status], (err, result) => {
                if (err) {
                    console.log(err);
                    res.send({
                        message: "Error while creating contact"
                    });
                } else {
                    let qr = `INSERT INTO contact_tag_linkage (contact_id, folder, reltag, ${tag_names.map((_, index) => `tag${index + 1}`).join(', ')}) VALUES ((SELECT contact_id FROM contact WHERE contact_phone = ?), (SELECT tag_id FROM tags WHERE tag_name = ?), (SELECT tag_id FROM tags WHERE tag_name = ?), ${tag_names.map(() => `(SELECT tag_id FROM tags WHERE tag_name = ?)`).join(', ')});`;
                    data.query(qr, [contact_phone, folder, reltag, ...tag_names], (err, result) => {
                        if (err) {
                            res.send({
                                message: "Error while inserting the tags to the contact"
                            })
                        }
                        else {
                            console.log(result, "result");
                            res.send({
                                message: "Data Inserted successfully"
                            });
                        }
                    });
                }
            });
        }
    });
});


// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


// =========================== create tag ===============================


router.post('/createtag', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    const tag_input = req.body;
    const names = tag_input.tagname;
    const arr = [];
    console.log(names);
    for (tag_name of names) {
        const qr = "select tag_name from tags where tag_name = ?";
        data.query(qr, [tag_name], (err, result) => {
            if (err) {
                console.log("Error while looping data");
            }
            else if (result.length === 0) {

                const tagType = tag_input.type;

                const qr = "insert into tags (tag_name, tag_type_id, tag_status) values (?, (select tagType_id from tagType where tagType = ?), 'Y');"

                data.query(qr, [tag_name, tagType], (err, result1) => {
                    if (err) {
                        console.log(err);
                    }
                    console.log(result1, "result1");
                });
            }
            else if (result.length > 0) {
                arr.push(tag_name);
                console.log(tag_name, "tag name already exists");
            }
        });
    }
});


// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// // Update contact
router.put('/updatecontact/:contact_Id', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    console.log(req.body, "Update contact and Update tags");
    let contact_id = req.params.contact_Id;
    let contact_name = req.body.name;
    let contact_email = req.body.email;
    let contact_email1 = req.body.email1;
    let contact_phone = req.body.phone;
    let contact_phone1 = req.body.phone1;
    let contact_phone2 = req.body.phone2;
    let contact_address = req.body.address;
    let contact_address1 = req.body.address1;
    let contact_status = req.body.status;
    let folder = req.body.folderValue;
    let reltag = req.body.rtagValue;
    let tag_names = req.body.tags;
    let relation = req.body.relname;
    let relcontactno = req.body.relcontact;

    console.log(contact_id);
    let qr = `update contact set contact_name = "${contact_name}", contact_phone = ${contact_phone}, contact_phone1 = ${contact_phone1},  contact_email = "${contact_email}", contact_email1 = "${contact_email1}", contact_address = "${contact_address}", contact_address1 = "${contact_address1}", contact_status = "${contact_status}", relcontactno = "${relcontactno}", relation="${relation}" where contact_id = ${contact_id}`;

    data.query(qr, (err, result) => {
        if (err) {
            console.log(err)
            res.send({
                message: "Error while updating the contact"
            });
        }
        else {
            let qr = `UPDATE contact_tag_linkage SET folder = (SELECT tag_id FROM tags WHERE tag_name = "${folder}"),  reltag = (SELECT tag_id FROM tags WHERE tag_name = "${reltag}"), ${tag_names.map((_, index) => `tag${index + 1}=(SELECT tag_id FROM tags WHERE tag_name = ?)`).join(', ')} WHERE contact_id = ${contact_id}`;
            data.query(qr, [...tag_names], (err, result) => {
                if (err) {
                    console.log(err, "Error while updating the values");
                }
                else {
                    res.send({
                        message: "Data updated successfully"
                    })
                }

            });
        }
    });
});

// get single data

router.get('/single/:contact_Id', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    let contact_Id = req.params.contact_Id
    let qr = `select A.*, 
    (select contact_name from contact where contact_id = A.relcontactNo) as relcontactno, 
    (select tag_name from tags where tag_id = B.folder) as folder, 
    (select tag_name from tags where tag_id = B.reltag) as reltag, 
    (select tag_name from tags where tag_id = B.tag1) as tag1,
    (select tag_name from tags where tag_id = B.tag2) as tag2,
    (select tag_name from tags where tag_id = B.tag3) as tag3,
    (select tag_name from tags where tag_id = B.tag4) as tag4,
    (select tag_name from tags where tag_id = B.tag5) as tag5,
    (select tag_name from tags where tag_id = B.tag6) as tag6,
    (select tag_name from tags where tag_id = B.tag7) as tag7,
    (select tag_name from tags where tag_id = B.tag8) as tag8,
    (select tag_name from tags where tag_id = B.tag9) as tag9,
    (select tag_name from tags where tag_id = B.tag10) as tag10,
    (select tag_name from tags where tag_id = B.tag11) as tag11,
    (select tag_name from tags where tag_id = B.tag12) as tag12,
    (select tag_name from tags where tag_id = B.tag13) as tag13,
    (select tag_name from tags where tag_id = B.tag14) as tag14,
    (select tag_name from tags where tag_id = B.tag15) as tag15,
    (select tag_name from tags where tag_id = B.tag16) as tag16,
    (select tag_name from tags where tag_id = B.tag17) as tag17,
    (select tag_name from tags where tag_id = B.tag18) as tag18,
    (select tag_name from tags where tag_id = B.tag19) as tag19,
    (select tag_name from tags where tag_id = B.tag20) as tag20
    from contact A inner join contact_tag_linkage B on A.contact_id = B.contact_id where A.contact_id=?;`;
    data.query(qr, [contact_Id], (err, result) => {
        if (err) {
            console.log(err);
        }
        if (result.length > 0) {
            res.send({
                message: "All contact details",
                data: result,
                tags: [result[0].tag1, result[0].tag2, result[0].tag3, result[0].tag4, result[0].tag5, result[0].tag6, result[0].tag7, result[0].tag8, result[0].tag9, result[0].tag10, result[0].tag11, result[0].tag12, result[0].tag13, result[0].tag14, result[0].tag15, result[0].tag16, result[0].tag17, result[0].tag18, result[0].tag19, result[0].tag20]
            })
        }
    })
})


router.get('/login',(req,res)=>{
    res.header('Access-Control-Allow-Origin', '*');
    let qr = `select * from login`
    data.query(qr,(err,result)=>{
        if(err){
            res.send({
                message:"error while getting data"
            })
            console.log(err);
        }
        else{
            res.send({
                data:result
            })
        }
    })
});

router.get('/forgetpass/:data',(req,res)=>{
    res.header('Access-Control-Allow-Origin', '*');
    let remail = req.params.data;
    let qr = `select * from login where email = ?`;
    data.query(qr, [remail], (err, result)=>{
        if(result.length == 0){
            res.send({
                message: "Fail"
            })
        }
        else{
            res.send({
                message:"ok",
                data:result
            })
        }
    })
})

router.post('/register',(req,res)=>{
    res.header('Access-Control-Allow-Origin', '*');
    let name = req.body.regname;
    let mobile = req.body.regmobile;
    let email = req.body.regemail;
    let password = req.body.regpassword;
    let qr = "insert into login (name, mobile, email, password) values ( ?, ?, ?, ? );";
    data.query(qr,[name,mobile,email,password],(err,result)=>{
        if(!err){
            res.send({ message: 'ok' });
            console.log(result);
        }
        else{
            console.log(err);
        }
    })
})



// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
app.use('/.netlify/functions/app', router);

module.exports.handler = serverless(app);
