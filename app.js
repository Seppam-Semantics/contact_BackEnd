// made all necessary imports
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs');
const path = require('path');
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());


//----------------------------------------------------------------------------------------------------------------------------------
// connect and read SQL query from external SQL file
const overAll = fs.readFileSync(path.join(__dirname, '/SQL/overAllSearch.sql'), 'utf-8');


// --------------------------------------------------------------------------------------------------------------------------------
// create database connection with Backend
const data = mysql.createConnection({
    host: 'sql12.freesqldatabase.com',
    user: 'sql12658086',
    password: 'Zr8B83ynUX',
    port: 3306,
    database: 'sql12658086'
});


// checking database connection
data.connect((err) => {
    if (err) { console.log(err,'Error while connecting the database') }
    else { console.log('Database conected......') }
});
// -------------------------------------------------------------------------------------------------------------------------------




//                             ======== Main Search =======


// Get all data by main search
app.get('/search', (req, res) => {
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

app.get('/allcontact', (req, res) => {
    let qr = "select * from contact";
    data.query(qr, (err, result) => {
        if (err) {
            console.log('Error while getting contacts', err)
        }
        if (result.length > 0) {
            res.send({
                message: "All Contacts are here",
                data: result
            });
        }
    });
});


// ------------------------------------------------------------------------------------------------------------------------------------
//         ==============  Contact for relation ================

app.get('/relcontact', (req,res)=>{
    let qr = "select Contact_id, contact_name, contact_phone from contact";
    data.query(qr, (err,result)=>{
        if(err){
            console.log(err);
        }
        else{
            res.send({
                message:"All contact are gathered",
                data:result
            })
        }
    })
})
// -----------------------------------------------------------------------------------------------------------------------------------------

//              ================= getting tagtype for creating tags==================

app.get('/type',(req,res)=>{
    let qr = "select * from tagType"
    data.query(qr, (err, result)=>{
        if(err){
            console.log(err)
            res.send({
                message:"Error while getting message"
            })
        }
        else{
            res.send({
                data:result
            })
        }
    })
})

// --------------------------------------------------------------------------------------------------------------------------------------------

// ------------------------------ get contact by tag name ------------------------------

app.get('/tagcontact', (req, res) => {
    let tagname = req.body.tagname;
    let qr = "select A.* from contact_details A inner join contact_tag_linkage B on A.contact_id = B.contact_id  B.tag1 = B.id or A.tag2 = B.id or A.tag3 = B.id or A.tag4 = B.id or A.tag5 = B.id or A.tag6 = B.id or A.tag7 = B.id or A.tag8 = B.id or A.tag9 = B.id or A.tag10 = B.id or A.relationtag = B.id where B.tagname = ?";
    data.query(qr, [tagname], (err, result) => {
        if (err) {
            console.log("error getting data from database");
        }
        if (result.length > 0) {
            res.send({
                message: "All user datas",
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


// ------------------------------------------------------------------------------------------------------------------------------------------

// ----------------------------- get all professional tagnames for contatct creation-------------------------------

app.get('/rtag', (req,res)=>{
    let qr = "select tag_name from tags where tag_type_id = (select tagType_id from tagtype where tagtype_name = 'relation')"
    data.query(qr,(err,result)=>{
        if(err){
            res.send({
                message:"Error while gettin data"
            });
        }
        else{
            res.send({
                message:"All tag",
                data:result
            })
        }
    });
});


// -------------------------------------------------------------------------------------------------------------------------------------------


// ========================== getting tag name =====================


app.get('/tags', (req, res) => {
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

app.get('/folder',(req,res)=>{
    let qr = "select tag_name from tags where tag_type_id = 3";
    data.query(qr,(err,result)=>{
        if(err){
            res.send({
                message:"Error while getting data",
            })
        }
        else{
            res.send({
                message:"Folder names",
                data:result
            })
        }
    });
});


// --------------------------------------------------------------------------------------------------------------------------------------------------------


// ==================== create contact with tags.... ==================================
app.post('/createcontact', (req, res) => {
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

            data.query(qr, [contact_name, contact_phone, contact_phone1, contact_phone2, contact_email, contact_email1, contact_address, contact_address1,relation,contact_status], (err, result) => {
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


app.post('/createtag', (req, res) => {

    const tag_input = req.body;
    const names = tag_input.tagname;
    const arr = [];
    console.log(names);
    names.forEach((tag_name) => {
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
                console.log(tag_name);
            }
        });

    });

});


// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// // Update contact
app.put('/updatecontact/:contact_Id', (req, res) => {

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
        if(err){
            console.log(err)
            res.send({
                message: "Error while updating the contact"
            });
        }
        else{
            let qr = `UPDATE contact_tag_linkage SET folder = (SELECT tag_id FROM tags WHERE tag_name = "${folder}"),  reltag = (SELECT tag_id FROM tags WHERE tag_name = "${reltag}"), ${tag_names.map((_, index) => `tag${index + 1}=(SELECT tag_id FROM tags WHERE tag_name = ?)`).join(', ')} WHERE contact_id = ${contact_id}`;
            data.query(qr, [...tag_names], (err, result)=>{
                if(err){
                    console.log(err, "Error while updating the values");
                }
                else{
                    res.send({
                        message:"Data updated successfully"
                    })
                }

            });
        }
    });
});

// get single data

app.get('/single/:contact_Id', (req,res)=>{
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
    data.query(qr,[contact_Id],(err,result)=>{
        if(err){
            console.log(err);
        }
        if(result.length>0){
            res.send({
                message:"All contact details",
                data:result,
                tags : [result[0].tag1,result[0].tag2,result[0].tag3,result[0].tag4,result[0].tag5,result[0].tag6,result[0].tag7,result[0].tag8,result[0].tag9,result[0].tag10,result[0].tag11,result[0].tag12,result[0].tag13,result[0].tag14,result[0].tag15,result[0].tag16,result[0].tag17,result[0].tag18,result[0].tag19,result[0].tag20]
            })
        }
    })
})

app.use(express.static(path.join(__dirname,'docs')));


// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
app.listen(4000, () => {
    console.log('Server Started with port 4000')
})